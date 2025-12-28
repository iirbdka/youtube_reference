'use client';

import { useState, FormEvent } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSearch } from '@/contexts/SearchContext';
import { LanguageCode } from '@/types';

const languages: { code: LanguageCode; label: string; flag: string }[] = [
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'en', label: '영어', flag: '🇺🇸' },
  { code: 'ja', label: '일본어', flag: '🇯🇵' },
];

export function SearchBar() {
  const { query, setQuery, filters, updateFilter, search, isLoading } = useSearch();
  const [inputValue, setInputValue] = useState(query);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setQuery(inputValue.trim());
      search(inputValue.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-3xl mx-auto">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="영상 레퍼런스 검색..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="pl-10 h-12 text-base bg-background/80 backdrop-blur-sm border-border/50 focus:border-primary/50"
        />
      </div>
      
      <Select
        value={filters.relevanceLanguage}
        onValueChange={(value: LanguageCode) => updateFilter('relevanceLanguage', value)}
      >
        <SelectTrigger className="w-full sm:w-[140px] h-12 bg-background/80 backdrop-blur-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <span className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button 
        type="submit" 
        disabled={isLoading || !inputValue.trim()}
        className="h-12 px-6 font-medium"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            검색 중
          </>
        ) : (
          '검색'
        )}
      </Button>
    </form>
  );
}
