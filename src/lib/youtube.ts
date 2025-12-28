import {
  DurationFilter,
  UploadDateFilter,
  YouTubeSearchResponse,
  YouTubeVideoDetails,
  YouTubeChannelDetails,
} from '@/types';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

// Convert duration filter to YouTube API videoDuration parameter
export function getDurationParam(duration: DurationFilter): string | undefined {
  switch (duration) {
    case 'short':
      return 'short'; // < 4 minutes
    case 'medium':
      return 'medium'; // 4-20 minutes
    case 'long':
      return 'long'; // > 20 minutes
    default:
      return undefined;
  }
}

// Convert upload date filter to YouTube API publishedAfter parameter
export function getPublishedAfterParam(uploadDate: UploadDateFilter): string | undefined {
  const now = new Date();
  
  switch (uploadDate) {
    case 'hour':
      return new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    case 'today':
      return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    case 'week':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    case 'month':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    case 'year':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();
    default:
      return undefined;
  }
}

// Parse ISO 8601 duration to human readable format
export function parseDuration(isoDuration: string): { formatted: string; seconds: number } {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  
  if (!match) {
    return { formatted: '0:00', seconds: 0 };
  }
  
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  
  let formatted: string;
  if (hours > 0) {
    formatted = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  
  return { formatted, seconds: totalSeconds };
}

// Calculate efficiency score (view count / subscriber count * 100)
export function calculateEfficiencyScore(viewCount: number, subscriberCount: number): number {
  if (subscriberCount === 0) return 0;
  return Math.round((viewCount / subscriberCount) * 100);
}

// Format number with K, M suffix
export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

// YouTube API fetch helper
async function fetchYouTubeAPI<T>(endpoint: string, params: Record<string, string>): Promise<T> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  
  if (!apiKey) {
    throw new Error('YouTube API key is not configured');
  }
  
  const searchParams = new URLSearchParams({
    ...params,
    key: apiKey,
  });
  
  const response = await fetch(`${YOUTUBE_API_BASE}/${endpoint}?${searchParams}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'YouTube API request failed');
  }
  
  return response.json();
}

// Search videos
export async function searchVideos(
  query: string,
  options: {
    maxResults?: number;
    pageToken?: string;
    videoDuration?: string;
    order?: string;
    publishedAfter?: string;
    videoLicense?: string;
    type?: string;
    relevanceLanguage?: string;
  } = {}
): Promise<YouTubeSearchResponse> {
  const params: Record<string, string> = {
    part: 'snippet',
    q: query,
    maxResults: (options.maxResults || 12).toString(),
    type: options.type || 'video',
  };
  
  if (options.pageToken) params.pageToken = options.pageToken;
  if (options.videoDuration) params.videoDuration = options.videoDuration;
  if (options.order) params.order = options.order;
  if (options.publishedAfter) params.publishedAfter = options.publishedAfter;
  if (options.videoLicense) params.videoLicense = options.videoLicense;
  if (options.relevanceLanguage) params.relevanceLanguage = options.relevanceLanguage;
  
  return fetchYouTubeAPI<YouTubeSearchResponse>('search', params);
}

// Get video details by IDs (batch)
export async function getVideoDetails(videoIds: string[]): Promise<YouTubeVideoDetails[]> {
  if (videoIds.length === 0) return [];
  
  // YouTube API allows max 50 IDs per request
  const batchSize = 50;
  const batches: string[][] = [];
  
  for (let i = 0; i < videoIds.length; i += batchSize) {
    batches.push(videoIds.slice(i, i + batchSize));
  }
  
  const results: YouTubeVideoDetails[] = [];
  
  for (const batch of batches) {
    const response = await fetchYouTubeAPI<{ items: YouTubeVideoDetails[] }>('videos', {
      part: 'snippet,contentDetails,statistics',
      id: batch.join(','),
    });
    results.push(...response.items);
  }
  
  return results;
}

// Get channel details by IDs (batch)
export async function getChannelDetails(channelIds: string[]): Promise<YouTubeChannelDetails[]> {
  if (channelIds.length === 0) return [];
  
  // Remove duplicates
  const uniqueIds = [...new Set(channelIds)];
  
  const batchSize = 50;
  const batches: string[][] = [];
  
  for (let i = 0; i < uniqueIds.length; i += batchSize) {
    batches.push(uniqueIds.slice(i, i + batchSize));
  }
  
  const results: YouTubeChannelDetails[] = [];
  
  for (const batch of batches) {
    const response = await fetchYouTubeAPI<{ items: YouTubeChannelDetails[] }>('channels', {
      part: 'statistics',
      id: batch.join(','),
    });
    results.push(...response.items);
  }
  
  return results;
}

