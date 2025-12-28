'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearch } from '@/contexts/SearchContext';
import { LanguageCode } from '@/types';

const languages: { code: LanguageCode; label: string; flag: string }[] = [
  { code: 'ko', label: 'Korean', flag: '🇰🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ja', label: 'Japanese', flag: '🇯🇵' },
];

export function LanguageSelector() {
  const { filters, updateFilter, search, query } = useSearch();

  const handleLanguageChange = (value: string) => {
    updateFilter('relevanceLanguage', value as LanguageCode);
    if (query.trim()) {
      setTimeout(() => search(), 0);
    }
  };

  return (
    <Tabs
      value={filters.relevanceLanguage}
      onValueChange={handleLanguageChange}
      className="w-auto"
    >
      <TabsList className="bg-background/50 backdrop-blur-sm">
        {languages.map((lang) => (
          <TabsTrigger
            key={lang.code}
            value={lang.code}
            className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <span>{lang.flag}</span>
            <span className="hidden sm:inline">{lang.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

