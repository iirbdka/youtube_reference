'use client';

import { VideoCard } from './VideoCard';
import { VideoReference, SavedReference } from '@/types';

interface VideoGridProps {
  videos: VideoReference[] | SavedReference[];
  showMemo?: boolean;
}

export function VideoGrid({ videos, showMemo }: VideoGridProps) {
  if (videos.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          showMemo={showMemo}
          memo={'memo' in video ? video.memo : undefined}
        />
      ))}
    </div>
  );
}

