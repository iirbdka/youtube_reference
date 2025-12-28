'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  VideoReference,
  SearchFilters,
  TagCount,
  DEFAULT_FILTERS,
} from '@/types';

interface SearchContextType {
  query: string;
  setQuery: (query: string) => void;
  filters: SearchFilters;
  setFilters: (filters: SearchFilters) => void;
  updateFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  results: VideoReference[];
  topTags: TagCount[];
  isLoading: boolean;
  error: string | null;
  nextPageToken: string | null;
  search: (newQuery?: string) => Promise<void>;
  loadMore: () => Promise<void>;
  clearResults: () => void;
}

const SearchContext = createContext<SearchContextType | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [results, setResults] = useState<VideoReference[]>([]);
  const [topTags, setTopTags] = useState<TagCount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);

  const updateFilter = useCallback(<K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const search = useCallback(async (newQuery?: string) => {
    const searchQuery = newQuery ?? query;
    
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    // Check session storage cache
    const cacheKey = `search_${searchQuery}_${JSON.stringify(filters)}`;
    const cached = sessionStorage.getItem(cacheKey);
    
    if (cached) {
      const cachedData = JSON.parse(cached);
      setResults(cachedData.results);
      setTopTags(cachedData.topTags);
      setNextPageToken(cachedData.nextPageToken);
      if (newQuery) setQuery(newQuery);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/youtube/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, filters }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Search failed');
      }

      const data = await response.json();
      
      setResults(data.results);
      setTopTags(data.topTags);
      setNextPageToken(data.nextPageToken || null);
      if (newQuery) setQuery(newQuery);

      // Cache the results
      sessionStorage.setItem(cacheKey, JSON.stringify({
        results: data.results,
        topTags: data.topTags,
        nextPageToken: data.nextPageToken,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [query, filters]);

  const loadMore = useCallback(async () => {
    if (!nextPageToken || isLoading) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/youtube/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, filters, pageToken: nextPageToken }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load more');
      }

      const data = await response.json();
      
      setResults(prev => [...prev, ...data.results]);
      setTopTags(prev => {
        // Merge and dedupe tags
        const tagMap = new Map<string, number>();
        [...prev, ...data.topTags].forEach(t => {
          tagMap.set(t.tag, (tagMap.get(t.tag) || 0) + t.count);
        });
        return Array.from(tagMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([tag, count]) => ({ tag, count }));
      });
      setNextPageToken(data.nextPageToken || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [query, filters, nextPageToken, isLoading]);

  const clearResults = useCallback(() => {
    setResults([]);
    setTopTags([]);
    setNextPageToken(null);
    setError(null);
  }, []);

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery,
        filters,
        setFilters,
        updateFilter,
        results,
        topTags,
        isLoading,
        error,
        nextPageToken,
        search,
        loadMore,
        clearResults,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}

