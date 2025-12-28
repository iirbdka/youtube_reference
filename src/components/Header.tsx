'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Youtube, Bookmark, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md group-hover:blur-lg transition-all" />
            <div className="relative bg-primary rounded-lg p-1.5">
              <Youtube className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
          <span className="font-bold text-xl tracking-tight">
            Ref<span className="text-primary">Tube</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          <Button
            variant={pathname === '/' ? 'secondary' : 'ghost'}
            size="sm"
            asChild
            className={cn(
              'gap-2',
              pathname === '/' && 'bg-primary/10 text-primary'
            )}
          >
            <Link href="/">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </Link>
          </Button>
          
          <Button
            variant={pathname === '/collection' ? 'secondary' : 'ghost'}
            size="sm"
            asChild
            className={cn(
              'gap-2',
              pathname === '/collection' && 'bg-primary/10 text-primary'
            )}
          >
            <Link href="/collection">
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline">Collection</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

