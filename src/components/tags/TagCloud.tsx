'use client';

import { Hash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useSearch } from '@/contexts/SearchContext';
import { cn } from '@/lib/utils';

interface TagCloudProps {
  className?: string;
}

export function TagCloud({ className }: TagCloudProps) {
  const { topTags, setQuery, search } = useSearch();

  if (topTags.length === 0) {
    return null;
  }

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    search(tag);
  };

  // Calculate relative sizes based on count
  const maxCount = Math.max(...topTags.map(t => t.count));

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2">
        <Hash className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium text-muted-foreground">Related Tags</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {topTags.map(({ tag, count }) => {
          const intensity = count / maxCount;
          return (
            <Badge
              key={tag}
              variant="outline"
              className={cn(
                'cursor-pointer transition-all duration-200 hover:scale-105',
                'hover:bg-primary hover:text-primary-foreground hover:border-primary',
                intensity > 0.7 && 'bg-primary/10 border-primary/30',
                intensity > 0.4 && intensity <= 0.7 && 'bg-muted/50',
              )}
              onClick={() => handleTagClick(tag)}
            >
              #{tag}
              <span className="ml-1.5 text-[10px] opacity-60">({count})</span>
            </Badge>
          );
        })}
      </div>
    </div>
  );
}

