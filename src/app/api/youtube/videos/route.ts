import { NextRequest, NextResponse } from 'next/server';
import { getVideoDetails, parseDuration } from '@/lib/youtube';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoIds } = body as { videoIds: string[] };

    if (!videoIds || videoIds.length === 0) {
      return NextResponse.json(
        { error: 'Video IDs are required' },
        { status: 400 }
      );
    }

    const videoDetails = await getVideoDetails(videoIds);

    const videos = videoDetails.map(video => ({
      id: video.id,
      title: video.snippet.title,
      description: video.snippet.description,
      thumbnail: video.snippet.thumbnails.high?.url || '',
      channelId: video.snippet.channelId,
      channelTitle: video.snippet.channelTitle,
      viewCount: parseInt(video.statistics.viewCount, 10) || 0,
      likeCount: video.statistics.likeCount ? parseInt(video.statistics.likeCount, 10) : undefined,
      commentCount: video.statistics.commentCount ? parseInt(video.statistics.commentCount, 10) : undefined,
      tags: video.snippet.tags || [],
      publishedAt: video.snippet.publishedAt,
      ...parseDuration(video.contentDetails.duration),
    }));

    return NextResponse.json({ videos });
  } catch (error) {
    console.error('Videos API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch video details' },
      { status: 500 }
    );
  }
}

