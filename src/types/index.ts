// Video Reference - Main data structure for search results
export interface VideoReference {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelId: string;
  channelTitle: string;
  subscriberCount?: number;
  viewCount: number;
  likeCount?: number;
  commentCount?: number;
  efficiencyScore?: number; // (viewCount / subscriberCount) * 100
  tags: string[];
  publishedAt: string;
  duration: string;
  durationSeconds: number;
}

// Saved collection item with user memo
export interface SavedReference extends VideoReference {
  savedAt: string;
  memo?: string;
}

// Search filter options
export type DurationFilter = 'any' | 'short' | 'medium' | 'long';
export type SortByFilter = 'relevance' | 'date' | 'rating' | 'viewCount';
export type UploadDateFilter = 'any' | 'hour' | 'today' | 'week' | 'month' | 'year';
export type LicenseFilter = 'any' | 'creativeCommon';
export type ResourceType = 'video' | 'channel' | 'playlist';
export type LanguageCode = 'en' | 'ko' | 'ja';

export interface SearchFilters {
  duration: DurationFilter;
  sortBy: SortByFilter;
  uploadDate: UploadDateFilter;
  license: LicenseFilter;
  resourceType: ResourceType;
  relevanceLanguage: LanguageCode;
}

// Default filter values
export const DEFAULT_FILTERS: SearchFilters = {
  duration: 'any',
  sortBy: 'relevance',
  uploadDate: 'any',
  license: 'any',
  resourceType: 'video',
  relevanceLanguage: 'ko',
};

// Search state
export interface SearchState {
  query: string;
  filters: SearchFilters;
  results: VideoReference[];
  topTags: TagCount[];
  isLoading: boolean;
  error: string | null;
  nextPageToken?: string;
}

// Tag frequency count
export interface TagCount {
  tag: string;
  count: number;
}

// YouTube API response types
export interface YouTubeSearchResponse {
  items: YouTubeSearchItem[];
  nextPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

export interface YouTubeSearchItem {
  id: {
    kind: string;
    videoId?: string;
    channelId?: string;
    playlistId?: string;
  };
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: YouTubeThumbnail;
      medium: YouTubeThumbnail;
      high: YouTubeThumbnail;
    };
    channelTitle: string;
  };
}

export interface YouTubeThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface YouTubeVideoDetails {
  id: string;
  snippet: {
    tags?: string[];
    title: string;
    description: string;
    thumbnails: {
      high: YouTubeThumbnail;
    };
    channelId: string;
    channelTitle: string;
    publishedAt: string;
  };
  contentDetails: {
    duration: string; // ISO 8601 format (PT4M13S)
  };
  statistics: {
    viewCount: string;
    likeCount?: string;
    commentCount?: string;
  };
}

export interface YouTubeChannelDetails {
  id: string;
  statistics: {
    subscriberCount: string;
    videoCount: string;
    viewCount: string;
  };
}

