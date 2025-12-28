'use client';

import { Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useSearch } from '@/contexts/SearchContext';
import {
  DurationFilter,
  SortByFilter,
  UploadDateFilter,
  LicenseFilter,
} from '@/types';

const durationOptions: { value: DurationFilter; label: string }[] = [
  { value: 'any', label: '전체 길이' },
  { value: 'short', label: '짧은 영상 (4분 미만)' },
  { value: 'medium', label: '중간 길이 (4-20분)' },
  { value: 'long', label: '긴 영상 (20분 이상)' },
];

const sortByOptions: { value: SortByFilter; label: string }[] = [
  { value: 'relevance', label: '관련성' },
  { value: 'date', label: '업로드 날짜' },
  { value: 'viewCount', label: '조회수' },
  { value: 'rating', label: '평점' },
];

const uploadDateOptions: { value: UploadDateFilter; label: string }[] = [
  { value: 'any', label: '전체 기간' },
  { value: 'hour', label: '지난 1시간' },
  { value: 'today', label: '오늘' },
  { value: 'week', label: '이번 주' },
  { value: 'month', label: '이번 달' },
  { value: 'year', label: '올해' },
];

const licenseOptions: { value: LicenseFilter; label: string }[] = [
  { value: 'any', label: '전체 라이선스' },
  { value: 'creativeCommon', label: 'Creative Commons' },
];

interface FilterSidebarProps {
  className?: string;
}

export function FilterSidebar({ className }: FilterSidebarProps) {
  const { filters, updateFilter, search, query } = useSearch();

  const handleFilterChange = <K extends keyof typeof filters>(
    key: K,
    value: (typeof filters)[K]
  ) => {
    updateFilter(key, value);
    // Re-search with new filters if we have a query
    if (query.trim()) {
      setTimeout(() => search(), 0);
    }
  };

  return (
    <aside className={className}>
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4 text-primary" />
        <h2 className="font-semibold text-sm uppercase tracking-wider">필터</h2>
      </div>
      
      <div className="space-y-5">
        {/* Duration */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            영상 길이
          </label>
          <Select
            value={filters.duration}
            onValueChange={(value: DurationFilter) => handleFilterChange('duration', value)}
          >
            <SelectTrigger className="w-full bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {durationOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator className="bg-border/50" />

        {/* Sort By */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            정렬 기준
          </label>
          <Select
            value={filters.sortBy}
            onValueChange={(value: SortByFilter) => handleFilterChange('sortBy', value)}
          >
            <SelectTrigger className="w-full bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortByOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator className="bg-border/50" />

        {/* Upload Date */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            업로드 날짜
          </label>
          <Select
            value={filters.uploadDate}
            onValueChange={(value: UploadDateFilter) => handleFilterChange('uploadDate', value)}
          >
            <SelectTrigger className="w-full bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {uploadDateOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator className="bg-border/50" />

        {/* License */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            라이선스
          </label>
          <Select
            value={filters.license}
            onValueChange={(value: LicenseFilter) => handleFilterChange('license', value)}
          >
            <SelectTrigger className="w-full bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {licenseOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </aside>
  );
}
