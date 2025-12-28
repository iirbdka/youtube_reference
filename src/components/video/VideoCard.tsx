'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Bookmark, BookmarkCheck, Users, Eye, Clock, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EfficiencyBadge } from './EfficiencyBadge';
import { useCollection } from '@/contexts/CollectionContext';
import { VideoReference } from '@/types';
import { formatNumber } from '@/lib/youtube';
import { cn } from '@/lib/utils';

interface VideoCardProps {
  video: VideoReference;
  showMemo?: boolean;
  memo?: string;
}

export function VideoCard({ video, showMemo, memo }: VideoCardProps) {
  const { addToCollection, removeFromCollection, isInCollection } = useCollection();
  const [isHovered, setIsHovered] = useState(false);
  
  const isSaved = isInCollection(video.id);

  const handleBookmarkClick = () => {
    if (isSaved) {
      removeFromCollection(video.id);
    } else {
      addToCollection(video);
    }
  };

  const handleWatchClick = () => {
    window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
  };

  return (
    <Card
      className={cn(
        'group overflow-hidden transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50',
        'hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5',
        isHovered && 'scale-[1.02]'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        
        {/* Duration badge */}
        <Badge
          variant="secondary"
          className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-mono"
        >
          <Clock className="h-3 w-3 mr-1" />
          {video.duration}
        </Badge>

        {/* Hover overlay */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent',
            'flex items-end justify-between p-3',
            'opacity-0 transition-opacity duration-200',
            isHovered && 'opacity-100'
          )}
        >
          <Button
            size="sm"
            variant="secondary"
            className="gap-1.5"
            onClick={handleWatchClick}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Watch
          </Button>
          <Button
            size="sm"
            variant={isSaved ? 'default' : 'secondary'}
            className="gap-1.5"
            onClick={handleBookmarkClick}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="h-3.5 w-3.5" />
                Saved
              </>
            ) : (
              <>
                <Bookmark className="h-3.5 w-3.5" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Title */}
        <h3
          className="font-medium text-sm line-clamp-2 leading-snug min-h-[2.5rem]"
          title={video.title}
        >
          {video.title}
        </h3>

        {/* Channel */}
        <p className="text-xs text-muted-foreground truncate">{video.channelTitle}</p>

        {/* Stats row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {formatNumber(video.viewCount)}
            </span>
            {video.subscriberCount !== undefined && (
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {formatNumber(video.subscriberCount)}
              </span>
            )}
          </div>
          
          {video.efficiencyScore !== undefined && (
            <EfficiencyBadge score={video.efficiencyScore} />
          )}
        </div>

        {/* Memo (for collection view) */}
        {showMemo && memo && (
          <p className="text-xs text-muted-foreground bg-muted/50 rounded-md p-2 mt-2 line-clamp-2">
            📝 {memo}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

