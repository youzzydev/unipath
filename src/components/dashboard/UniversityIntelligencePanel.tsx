'use client';

import { useUniversity } from '@/context/university-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { cn } from '@/lib/utils';
import { 
  MapPin, 
  Award, 
  TrendingUp, 
  Globe, 
  DollarSign,
  Building2,
  Users,
  Target,
  Bookmark,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { getFitScoreColor, getTuitionBandLabel, getLivingCostBandLabel } from '@/data/university-mock';

const fitCategories = [
  { key: 'academic', label: 'Academic', icon: Award },
  { key: 'budget', label: 'Budget', icon: DollarSign },
  { key: 'location', label: 'Location', icon: MapPin },
  { key: 'career', label: 'Career', icon: TrendingUp },
  { key: 'lifestyle', label: 'Lifestyle', icon: Users },
] as const;

export function UniversityIntelligencePanel() {
  const { selectedUniversity } = useUniversity();

  if (!selectedUniversity) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <Target className="h-16 w-16 text-[var(--intelligence-glow)]/30 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">
          Select a University
        </h3>
        <p className="text-sm text-slate-400">
          Choose a university from the map or carousel to view detailed intelligence.
        </p>
      </div>
    );
  }

  const intelligence = selectedUniversity.intelligence;
  const fitScore = intelligence?.fitScore || 0;
  const fitBreakdown = intelligence?.fitBreakdown || {
    academic: 0,
    budget: 0,
    location: 0,
    career: 0,
    lifestyle: 0,
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto scrollbar-intelligence">
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {selectedUniversity.is_russell_group && (
                    <Badge variant="outline" className="border-[var(--intelligence-accent)] text-[var(--intelligence-accent)] text-[10px]">
                      Russell Group
                    </Badge>
                  )}
                  <Badge variant="secondary" className="bg-[var(--intelligence-bg)] text-slate-400 border border-[var(--intelligence-border)]">
                    #{selectedUniversity.ranking_uk} UK
                  </Badge>
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {selectedUniversity.name}
                </h2>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <MapPin className="h-4 w-4" />
                  <span>{selectedUniversity.city}, {selectedUniversity.location}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 py-4 border-y border-[var(--intelligence-border)]">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'text-4xl font-bold tracking-tight',
                  getFitScoreColor(fitScore)
                )}>
                  {fitScore}
                </div>
                <div className="text-sm">
                  <div className="text-slate-400">Fit Score</div>
                  <div className="text-[var(--intelligence-target)] text-xs">Excellent Match</div>
                </div>
              </div>
              <div className="flex-1" />
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="h-9 w-9 border-[var(--intelligence-border)] text-slate-400 hover:text-[var(--intelligence-glow)] hover:border-[var(--intelligence-glow)]">
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {intelligence?.rationale && (
            <div className="rounded-lg bg-[var(--intelligence-bg)] border border-[var(--intelligence-border)] p-4">
              <p className="text-sm text-slate-300 leading-relaxed">
                {intelligence.rationale}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Target className="h-4 w-4 text-[var(--intelligence-glow)]" />
              Fit Breakdown
            </h3>
            <div className="space-y-3">
              {fitCategories.map(({ key, label, icon: Icon }) => {
                const value = fitBreakdown[key];
                return (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Icon className="h-3.5 w-3.5" />
                        <span>{label}</span>
                      </div>
                      <span className={cn(
                        'font-medium',
                        value >= 85 ? 'text-[var(--intelligence-target)]' :
                        value >= 70 ? 'text-[var(--intelligence-glow)]' :
                        'text-[var(--intelligence-warning)]'
                      )}>
                        {value}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[var(--intelligence-bg)] overflow-hidden">
                      <div 
                        className={cn(
                          'h-full rounded-full transition-all duration-500',
                          value >= 85 ? 'bg-[var(--intelligence-target)]' :
                          value >= 70 ? 'bg-[var(--intelligence-glow)]' :
                          'bg-[var(--intelligence-warning)]'
                        )}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-[var(--intelligence-bg)] border border-[var(--intelligence-border)] p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <DollarSign className="h-4 w-4" />
                <span className="text-xs font-medium uppercase">Tuition</span>
              </div>
              <div className="text-lg font-semibold text-white">
                {getTuitionBandLabel(intelligence?.tuitionBand || 2)}
              </div>
            </div>
            <div className="rounded-lg bg-[var(--intelligence-bg)] border border-[var(--intelligence-border)] p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Building2 className="h-4 w-4" />
                <span className="text-xs font-medium uppercase">Living Costs</span>
              </div>
              <div className="text-sm font-semibold text-white">
                {getLivingCostBandLabel(intelligence?.livingCostBand || 2).split('(')[0]}
              </div>
            </div>
            <div className="rounded-lg bg-[var(--intelligence-bg)] border border-[var(--intelligence-border)] p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs font-medium uppercase">Employability</span>
              </div>
              <div className="text-lg font-semibold text-white flex items-center gap-2">
                {intelligence?.employabilityScore || 0}
                <span className="text-xs text-[var(--intelligence-target)]">Top</span>
              </div>
            </div>
            <div className="rounded-lg bg-[var(--intelligence-bg)] border border-[var(--intelligence-border)] p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Globe className="h-4 w-4" />
                <span className="text-xs font-medium uppercase">Intl Support</span>
              </div>
              <div className="text-lg font-semibold text-white">
                {intelligence?.internationalSupportScore || 0}
                <span className="text-xs text-slate-500 ml-1">/100</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Key Strengths
            </h3>
            <div className="flex flex-wrap gap-2">
              {intelligence?.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-[var(--intelligence-glow)]/10 text-[var(--intelligence-glow)] border border-[var(--intelligence-glow)]/20 text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {intelligence?.scholarshipSignal && intelligence.scholarshipSignal !== 'none' && (
            <div className={cn(
              'rounded-lg p-4 border',
              intelligence.scholarshipSignal === 'high' 
                ? 'bg-[var(--intelligence-target)]/10 border-[var(--intelligence-target)]/30'
                : 'bg-[var(--intelligence-glow)]/10 border-[var(--intelligence-glow)]/30'
            )}>
              <div className="flex items-center gap-2 mb-2">
                <Award className={cn(
                  'h-4 w-4',
                  intelligence.scholarshipSignal === 'high' 
                    ? 'text-[var(--intelligence-target)]'
                    : 'text-[var(--intelligence-glow)]'
                )} />
                <span className={cn(
                  'text-sm font-medium',
                  intelligence.scholarshipSignal === 'high' 
                    ? 'text-[var(--intelligence-target)]'
                    : 'text-[var(--intelligence-glow)]'
                )}>
                  Scholarship Opportunity
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {intelligence.scholarshipSignal === 'high' 
                  ? 'Multiple scholarship options available for international students'
                  : 'Some scholarship funding available'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 border-t border-[var(--intelligence-border)] bg-[var(--intelligence-surface)]">
        <div className="flex gap-3">
          <Button className="flex-1 bg-[var(--intelligence-glow)] hover:bg-[var(--intelligence-glow)]/90 text-black font-semibold">
            Apply Now
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
          <Button 
            variant="outline" 
            className="border-[var(--intelligence-border)] text-slate-400 hover:text-white hover:border-[var(--intelligence-glow)]"
            asChild
          >
            <Link href={`/dashboard/universities/${selectedUniversity.slug}`}>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
