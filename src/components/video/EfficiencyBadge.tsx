'use client';

import { Flame, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EfficiencyBadgeProps {
  score: number;
  className?: string;
}

export function EfficiencyBadge({ score, className }: EfficiencyBadgeProps) {
  const isInsight = score >= 300;
  const isGood = score >= 100;
  
  return (
    <Badge
      variant="secondary"
      className={cn(
        'font-mono text-xs font-semibold gap-1',
        isInsight && 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        !isInsight && isGood && 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        !isGood && 'bg-rose-500/20 text-rose-400 border-rose-500/30',
        className
      )}
    >
      {isInsight ? (
        <Flame className="h-3 w-3" />
      ) : isGood ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      {score}%
      {isInsight && <span className="ml-0.5 text-[10px]">Insight</span>}
    </Badge>
  );
}

