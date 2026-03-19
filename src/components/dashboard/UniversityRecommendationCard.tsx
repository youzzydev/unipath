'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MapPin, Star } from 'lucide-react';
import type { UniversityWithCoordsAndIntelligence } from '@/types';

interface UniversityRecommendationCardProps {
  university: UniversityWithCoordsAndIntelligence;
  isSelected: boolean;
  onClick: () => void;
}

export function UniversityRecommendationCard({
  university,
  isSelected,
  onClick,
}: UniversityRecommendationCardProps) {
  const intelligence = university.intelligence;
  const fitScore = intelligence?.fitScore || 0;

  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative flex-shrink-0 w-[280px] rounded-xl overflow-hidden transition-all duration-300',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--intelligence-glow)]',
        isSelected 
          ? 'ring-2 ring-[var(--intelligence-glow)] shadow-[0_0_30px_rgba(0,217,255,0.3)]' 
          : 'hover:ring-1 hover:ring-[var(--intelligence-border)] hover:shadow-lg hover:shadow-[var(--intelligence-glow)]/10'
      )}
    >
      <div className="relative h-[180px] overflow-hidden">
        {intelligence?.heroImageUrl ? (
          <Image
            src={intelligence.heroImageUrl}
            alt={`${university.name} campus`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--intelligence-surface)] to-[var(--intelligence-bg)]" />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        <div className="absolute top-3 left-3">
          <Badge 
            className={cn(
              'font-bold px-2 py-1 text-sm',
              isSelected 
                ? 'bg-[var(--intelligence-glow)] text-black' 
                : 'bg-[var(--intelligence-glow)]/90 text-black backdrop-blur-sm'
            )}
          >
            <Star className="h-3 w-3 mr-1 fill-current" />
            {fitScore}
          </Badge>
        </div>

        {university.is_russell_group && (
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="border-[var(--intelligence-accent)] text-[var(--intelligence-accent)] bg-black/50 backdrop-blur-sm">
              Russell Group
            </Badge>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
            {university.name}
          </h3>
          <div className="flex items-center gap-1 text-sm text-slate-300">
            <MapPin className="h-3 w-3" />
            <span>{university.city}</span>
            <span className="text-slate-500">•</span>
            <span>{university.location}</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-[var(--intelligence-surface)] border-t border-[var(--intelligence-border)]">
        <div className="flex flex-wrap gap-1.5">
          {intelligence?.tags.slice(0, 3).map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary"
              className="text-[10px] px-2 py-0.5 bg-[var(--intelligence-bg)] text-slate-400 border border-[var(--intelligence-border)]"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {isSelected && (
        <div className="absolute inset-0 border-2 border-[var(--intelligence-glow)] rounded-xl pointer-events-none">
          <div className="absolute -top-px left-1/2 -translate-x-1/2 w-20 h-0.5 bg-[var(--intelligence-glow)]" />
          <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-20 h-0.5 bg-[var(--intelligence-glow)]" />
        </div>
      )}
    </button>
  );
}
