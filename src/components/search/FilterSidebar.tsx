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
  { value: 'any', label: 'Any Duration' },
  { value: 'short', label: 'Short (< 4 min)' },
  { value: 'medium', label: 'Medium (4-20 min)' },
  { value: 'long', label: 'Long (> 20 min)' },
];

const sortByOptions: { value: SortByFilter; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'date', label: 'Upload Date' },
  { value: 'viewCount', label: 'View Count' },
  { value: 'rating', label: 'Rating' },
];

const uploadDateOptions: { value: UploadDateFilter; label: string }[] = [
  { value: 'any', label: 'Any Time' },
  { value: 'hour', label: 'Last Hour' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
];

const licenseOptions: { value: LicenseFilter; label: string }[] = [
  { value: 'any', label: 'Any License' },
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
        <h2 className="font-semibold text-sm uppercase tracking-wider">Filters</h2>
      </div>
      
      <div className="space-y-5">
        {/* Duration */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Duration
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
            Sort By
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
            Upload Date
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
            License
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

