'use client';

import { useRef, useEffect } from 'react';
import { UniversityRecommendationCard } from './UniversityRecommendationCard';
import { useUniversity } from '@/context/university-context';
import type { UniversityWithCoordsAndIntelligence } from '@/types';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecommendationCarouselProps {
  universities: UniversityWithCoordsAndIntelligence[];
}

export function RecommendationCarousel({ universities }: RecommendationCarouselProps) {
  const { selectedUniversity, setSelectedUniversity } = useUniversity();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (universities.length > 0 && !selectedUniversity) {
      setSelectedUniversity(universities[0]);
    }
  }, [universities, selectedUniversity, setSelectedUniversity]);

  if (universities.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[var(--intelligence-glow)]" />
          <h2 className="text-lg font-semibold text-white">
            Recommended for You
          </h2>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-[var(--intelligence-border)] to-transparent" />
      </div>

      <div className="group relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -ml-2 h-10 w-10 rounded-full bg-[var(--intelligence-surface)] border border-[var(--intelligence-border)] opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-black/50 text-white hover:bg-[var(--intelligence-surface)]"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 -mr-2 h-10 w-10 rounded-full bg-[var(--intelligence-surface)] border border-[var(--intelligence-border)] opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-black/50 text-white hover:bg-[var(--intelligence-surface)]"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-intelligence scroll-smooth"
          style={{ scrollbarWidth: 'thin' }}
        >
          {universities.map((university) => (
            <UniversityRecommendationCard
              key={university.id}
              university={university}
              isSelected={selectedUniversity?.id === university.id}
              onClick={() => setSelectedUniversity(university)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
