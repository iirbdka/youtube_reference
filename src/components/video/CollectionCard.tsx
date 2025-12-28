'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Trash2, Edit3, Save, X, ExternalLink, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { EfficiencyBadge } from './EfficiencyBadge';
import { useCollection } from '@/contexts/CollectionContext';
import { SavedReference } from '@/types';
import { formatNumber } from '@/lib/youtube';
import { cn } from '@/lib/utils';

interface CollectionCardProps {
  video: SavedReference;
}

export function CollectionCard({ video }: CollectionCardProps) {
  const { removeFromCollection, updateMemo } = useCollection();
  const [isEditing, setIsEditing] = useState(false);
  const [memoValue, setMemoValue] = useState(video.memo || '');
  const [isHovered, setIsHovered] = useState(false);

  const handleSaveMemo = () => {
    updateMemo(video.id, memoValue);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setMemoValue(video.memo || '');
    setIsEditing(false);
  };

  const handleWatchClick = () => {
    window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
  };

  const formatSavedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card
      className={cn(
        'group overflow-hidden transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50',
        'hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5'
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
            보기
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="gap-1.5"
            onClick={() => removeFromCollection(video.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
            삭제
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

        {/* Channel & Date */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="truncate max-w-[60%]">{video.channelTitle}</span>
          <span className="shrink-0">{formatSavedDate(video.savedAt)} 저장</span>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">
            조회수 {formatNumber(video.viewCount)}
          </span>
          {video.efficiencyScore !== undefined && (
            <EfficiencyBadge score={video.efficiencyScore} />
          )}
        </div>

        {/* Memo section */}
        <div className="pt-2 border-t border-border/50">
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={memoValue}
                onChange={(e) => setMemoValue(e.target.value)}
                placeholder="메모를 입력하세요..."
                className="min-h-[80px] text-sm bg-background/50"
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" className="gap-1.5 flex-1" onClick={handleSaveMemo}>
                  <Save className="h-3.5 w-3.5" />
                  저장
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5"
                  onClick={handleCancelEdit}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="group/memo cursor-pointer"
              onClick={() => setIsEditing(true)}
            >
              {video.memo ? (
                <div className="flex items-start gap-2">
                  <p className="text-xs text-muted-foreground flex-1 line-clamp-3">
                    📝 {video.memo}
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 opacity-0 group-hover/memo:opacity-100 transition-opacity"
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <button className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 w-full">
                  <Edit3 className="h-3 w-3" />
                  메모 추가...
                </button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
