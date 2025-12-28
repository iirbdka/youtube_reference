import { NextRequest, NextResponse } from 'next/server';
import {
  searchVideos,
  getVideoDetails,
  getChannelDetails,
  getDurationParam,
  getPublishedAfterParam,
  parseDuration,
  calculateEfficiencyScore,
} from '@/lib/youtube';
import {
  SearchFilters,
  VideoReference,
  TagCount,
} from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, filters, pageToken } = body as {
      query: string;
      filters: SearchFilters;
      pageToken?: string;
    };

    if (!query || query.trim() === '') {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    // Build search options
    const videoDuration = getDurationParam(filters.duration);
    const publishedAfter = getPublishedAfterParam(filters.uploadDate);
    
    // Execute search
    const searchResponse = await searchVideos(query, {
      maxResults: 12,
      pageToken,
      videoDuration,
      order: filters.sortBy,
      publishedAfter,
      videoLicense: filters.license === 'creativeCommon' ? 'creativeCommon' : undefined,
      type: filters.resourceType,
      relevanceLanguage: filters.relevanceLanguage,
    });

    // Extract video IDs
    const videoIds = searchResponse.items
      .filter(item => item.id.videoId)
      .map(item => item.id.videoId!);

    if (videoIds.length === 0) {
      return NextResponse.json({
        results: [],
        topTags: [],
        nextPageToken: searchResponse.nextPageToken,
      });
    }

    // Fetch video details
    const videoDetails = await getVideoDetails(videoIds);

    // Extract unique channel IDs
    const channelIds = [...new Set(videoDetails.map(v => v.snippet.channelId))];

    // Fetch channel details
    const channelDetails = await getChannelDetails(channelIds);

    // Create channel subscriber map
    const subscriberMap = new Map<string, number>();
    channelDetails.forEach(channel => {
      subscriberMap.set(channel.id, parseInt(channel.statistics.subscriberCount, 10) || 0);
    });

    // Collect all tags for frequency analysis
    const tagCounts = new Map<string, number>();

    // Build enriched video references
    const results: VideoReference[] = videoDetails.map(video => {
      const viewCount = parseInt(video.statistics.viewCount, 10) || 0;
      const subscriberCount = subscriberMap.get(video.snippet.channelId) || 0;
      const { formatted: duration, seconds: durationSeconds } = parseDuration(video.contentDetails.duration);
      const efficiencyScore = calculateEfficiencyScore(viewCount, subscriberCount);
      const tags = video.snippet.tags || [];

      // Count tags
      tags.forEach(tag => {
        const normalizedTag = tag.toLowerCase();
        tagCounts.set(normalizedTag, (tagCounts.get(normalizedTag) || 0) + 1);
      });

      return {
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail: video.snippet.thumbnails.high?.url || '',
        channelId: video.snippet.channelId,
        channelTitle: video.snippet.channelTitle,
        subscriberCount,
        viewCount,
        likeCount: video.statistics.likeCount ? parseInt(video.statistics.likeCount, 10) : undefined,
        commentCount: video.statistics.commentCount ? parseInt(video.statistics.commentCount, 10) : undefined,
        efficiencyScore,
        tags,
        publishedAt: video.snippet.publishedAt,
        duration,
        durationSeconds,
      };
    });

    // Get top 10 tags by frequency
    const topTags: TagCount[] = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));

    return NextResponse.json({
      results,
      topTags,
      nextPageToken: searchResponse.nextPageToken,
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Search failed' },
      { status: 500 }
    );
  }
}

