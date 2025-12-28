'use client';

import { Search, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/search/SearchBar';
import { FilterSidebar } from '@/components/search/FilterSidebar';
import { MobileFilterSheet } from '@/components/search/MobileFilterSheet';
import { VideoGrid } from '@/components/video/VideoGrid';
import { VideoGridSkeleton } from '@/components/video/VideoCardSkeleton';
import { TagCloud } from '@/components/tags/TagCloud';
import { Button } from '@/components/ui/button';
import { useSearch } from '@/contexts/SearchContext';

export default function HomePage() {
  const { results, isLoading, error, nextPageToken, loadMore, query } = useSearch();

  const hasResults = results.length > 0;
  const showEmptyState = !isLoading && !hasResults && !error;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero / Search Section */}
      <section className="relative py-12 lg:py-16 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-3xl opacity-30" />
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              나만의{' '}
              <span className="text-primary">레퍼런스</span>를 찾아보세요
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              고성과 유튜브 영상을 발굴하고 효율 지표를 분석하세요.
              다양한 언어로 트렌딩 콘텐츠를 탐색할 수 있습니다.
            </p>
          </div>

          <SearchBar />
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 pb-12">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              <FilterSidebar className="p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50" />
            </div>
          </aside>

          {/* Results Area */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter + Tags row */}
            {hasResults && (
              <div className="flex flex-wrap items-start gap-4 mb-6">
                <MobileFilterSheet />
                <TagCloud className="flex-1" />
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive mb-6">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Loading state */}
            {isLoading && !hasResults && <VideoGridSkeleton count={12} />}

            {/* Results grid */}
            {hasResults && (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    &quot;{query}&quot; 검색 결과 {results.length}개
                  </span>
                </div>
                <VideoGrid videos={results} />
              </>
            )}

            {/* Load more button */}
            {hasResults && nextPageToken && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={loadMore}
                  disabled={isLoading}
                  className="gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      불러오는 중...
                    </>
                  ) : (
                    '더 보기'
                  )}
                </Button>
              </div>
            )}

            {/* Empty state */}
            {showEmptyState && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
                  <div className="relative bg-muted rounded-full p-6">
                    <Search className="h-10 w-10 text-muted-foreground" />
                  </div>
                </div>
                <h2 className="text-xl font-semibold mb-2">검색을 시작하세요</h2>
                <p className="text-muted-foreground max-w-md">
                  키워드를 입력하면 성과 분석과 인사이트가 포함된 영상 레퍼런스를 찾아드립니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>RefTube — 유튜브 레퍼런스 검색 서비스</p>
        </div>
      </footer>
    </div>
  );
}
