'use client';

import { Bookmark, Trash2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { CollectionCard } from '@/components/video/CollectionCard';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCollection } from '@/contexts/CollectionContext';
import { useState } from 'react';

export default function CollectionPage() {
  const { savedItems, clearCollection } = useCollection();
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleClearAll = () => {
    clearCollection();
    setShowClearDialog(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
              <div className="bg-primary/10 rounded-lg p-2">
                <Bookmark className="h-6 w-6 text-primary" />
              </div>
              내 컬렉션
            </h1>
            <p className="text-muted-foreground mt-1">
              저장된 레퍼런스 {savedItems.length}개
            </p>
          </div>

          {savedItems.length > 0 && (
            <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                  전체 삭제
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    컬렉션 비우기
                  </DialogTitle>
                  <DialogDescription>
                    저장된 {savedItems.length}개의 레퍼런스를 모두 삭제하시겠습니까?
                    이 작업은 되돌릴 수 없습니다.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowClearDialog(false)}>
                    취소
                  </Button>
                  <Button variant="destructive" onClick={handleClearAll}>
                    전체 삭제
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Collection grid */}
        {savedItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {savedItems.map((video) => (
              <CollectionCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
              <div className="relative bg-muted rounded-full p-6">
                <Bookmark className="h-10 w-10 text-muted-foreground" />
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">저장된 레퍼런스가 없습니다</h2>
            <p className="text-muted-foreground max-w-md mb-6">
              검색 결과에서 마음에 드는 영상을 저장해보세요.
              메모를 추가하여 나중에 참고할 수 있습니다.
            </p>
            <Button asChild>
              <Link href="/">검색하러 가기</Link>
            </Button>
          </div>
        )}
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
