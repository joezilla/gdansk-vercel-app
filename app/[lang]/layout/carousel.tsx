'use client';

import { useRef, useState, useEffect, ReactNode } from 'react';

type CarouselProps = {
  children: ReactNode[];
  itemsPerPage?: number;
  gap?: string;
  className?: string;
  ariaLabel?: string;
};

/**
 * Generic snap-scroll carousel with nav arrows and pagination dots.
 * Pass an array of ReactNode children — each child is one card.
 * itemsPerPage controls how many cards show per "page" on desktop.
 */
export function Carousel({ children, itemsPerPage = 3, gap = 'gap-8', className = '', ariaLabel = 'Content carousel' }: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const totalPages = Math.ceil(children.length / itemsPerPage);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const scrollTo = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const newPage = Math.max(0, Math.min(idx, totalPages - 1));
    el.scrollTo({ left: newPage * el.offsetWidth, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    setPage(newPage);
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || !el.offsetWidth) return;
    setPage(Math.round(el.scrollLeft / el.offsetWidth));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') { scrollTo(page - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { scrollTo(page + 1); e.preventDefault(); }
  };

  // Group children into pages
  const pages: ReactNode[][] = [];
  for (let i = 0; i < children.length; i += itemsPerPage) {
    pages.push(children.slice(i, i + itemsPerPage));
  }

  const gridCols = itemsPerPage === 1
    ? 'grid-cols-1'
    : itemsPerPage === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : 'grid-cols-1 md:grid-cols-3';

  return (
    <div
      className={`relative ${className}`}
      role="region"
      aria-label={ariaLabel}
      aria-roledescription="carousel"
      onKeyDown={handleKeyDown}
    >
      {/* Nav arrows */}
      {totalPages > 1 && (
        <>
          <button
            aria-label="View previous items"
            onClick={() => scrollTo(page - 1)}
            disabled={page === 0}
            className={`absolute -left-12 top-1/2 -translate-y-1/2 z-10 p-2 text-primary hover:bg-surface-container-high transition-colors hidden md:block ${page === 0 ? 'opacity-30' : ''}`}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            aria-label="View next items"
            onClick={() => scrollTo(page + 1)}
            disabled={page >= totalPages - 1}
            className={`absolute -right-12 top-1/2 -translate-y-1/2 z-10 p-2 text-primary hover:bg-surface-container-high transition-colors hidden md:block ${page >= totalPages - 1 ? 'opacity-30' : ''}`}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={`flex overflow-x-auto snap-x snap-mandatory no-scrollbar ${gap}`}
        tabIndex={0}
        aria-live="polite"
      >
        {pages.map((pageItems, pageIdx) => (
          <div key={pageIdx} className={`min-w-full snap-start grid ${gridCols} ${gap}`} role="group" aria-label={`Page ${pageIdx + 1} of ${totalPages}`}>
            {pageItems}
          </div>
        ))}
      </div>

      {/* Pagination dots */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-8" role="tablist" aria-label="Carousel pages">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              role="tab"
              onClick={() => scrollTo(i)}
              aria-selected={i === page}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${i === page ? 'bg-primary' : 'bg-on-surface/20'}`}
              aria-label={`Page ${i + 1} of ${totalPages}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
