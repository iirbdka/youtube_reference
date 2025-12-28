'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { VideoReference, SavedReference } from '@/types';

const STORAGE_KEY = 'reftube_collection';

interface CollectionContextType {
  savedItems: SavedReference[];
  addToCollection: (video: VideoReference, memo?: string) => void;
  removeFromCollection: (videoId: string) => void;
  updateMemo: (videoId: string, memo: string) => void;
  isInCollection: (videoId: string) => boolean;
  clearCollection: () => void;
}

const CollectionContext = createContext<CollectionContextType | null>(null);

export function CollectionProvider({ children }: { children: ReactNode }) {
  const [savedItems, setSavedItems] = useState<SavedReference[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load collection from localStorage:', error);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever savedItems changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedItems));
      } catch (error) {
        console.error('Failed to save collection to localStorage:', error);
      }
    }
  }, [savedItems, isHydrated]);

  const addToCollection = useCallback((video: VideoReference, memo?: string) => {
    setSavedItems(prev => {
      // Check if already exists
      if (prev.some(item => item.id === video.id)) {
        return prev;
      }
      
      const savedItem: SavedReference = {
        ...video,
        savedAt: new Date().toISOString(),
        memo,
      };
      
      return [savedItem, ...prev];
    });
  }, []);

  const removeFromCollection = useCallback((videoId: string) => {
    setSavedItems(prev => prev.filter(item => item.id !== videoId));
  }, []);

  const updateMemo = useCallback((videoId: string, memo: string) => {
    setSavedItems(prev =>
      prev.map(item =>
        item.id === videoId ? { ...item, memo } : item
      )
    );
  }, []);

  const isInCollection = useCallback(
    (videoId: string) => savedItems.some(item => item.id === videoId),
    [savedItems]
  );

  const clearCollection = useCallback(() => {
    setSavedItems([]);
  }, []);

  return (
    <CollectionContext.Provider
      value={{
        savedItems,
        addToCollection,
        removeFromCollection,
        updateMemo,
        isInCollection,
        clearCollection,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollection() {
  const context = useContext(CollectionContext);
  if (!context) {
    throw new Error('useCollection must be used within a CollectionProvider');
  }
  return context;
}

