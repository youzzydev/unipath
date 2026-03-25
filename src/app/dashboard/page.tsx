'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';
import { UniversityProvider } from '@/context/university-context';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { RecommendationCarousel } from '@/components/dashboard/RecommendationCarousel';
import { UKIntelligenceMap } from '@/components/dashboard/UKIntelligenceMap';
import { UniversityIntelligencePanel } from '@/components/dashboard/UniversityIntelligencePanel';
import type { UniversityWithCoordsAndIntelligence } from '@/types';
import { Loader2, Radar, Info } from 'lucide-react';

function DashboardContent() {
  const { user, loading: authLoading, profileCompleted } = useAuth();
  const router = useRouter();
  const [universities, setUniversities] = useState<UniversityWithCoordsAndIntelligence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/sign-in');
    } else if (!authLoading && user && !profileCompleted) {
      router.push('/onboarding');
    }
  }, [authLoading, user, profileCompleted, router]);

  useEffect(() => {
    async function fetchUniversities() {
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .order('fit_score', { ascending: false })
        .limit(20);

      if (!error && data) {
        const universitiesWithIntelligence: UniversityWithCoordsAndIntelligence[] = data
          .filter((uni) => uni.fit_score !== null)
          .map((uni) => ({
            ...uni,
            intelligence: uni.fit_score !== null ? {
              fitScore: uni.fit_score,
              fitBreakdown: uni.fit_breakdown || { academic: 0, budget: 0, location: 0, career: 0, lifestyle: 0 },
              tags: uni.tags || [],
              rationale: uni.rationale || '',
              tuitionBand: (uni.tuition_band || 2) as 1 | 2 | 3 | 4,
              livingCostBand: (uni.living_cost_band || 2) as 1 | 2 | 3 | 4,
              employabilityScore: uni.employability_score || 0,
              internationalSupportScore: uni.international_support_score || 0,
              scholarshipSignal: uni.scholarship_signal || 'medium',
              heroImageUrl: uni.hero_image_url,
            } : null,
          }));

        setUniversities(universitiesWithIntelligence);
      }
      setLoading(false);
    }

    if (user && profileCompleted) {
      fetchUniversities();
    }
  }, [user, profileCompleted]);

  if (authLoading || (!profileCompleted && user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--intelligence-bg)]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Radar className="h-12 w-12 text-[var(--intelligence-glow)] animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-[var(--intelligence-glow)]" />
            </div>
          </div>
          <p className="text-muted-foreground">Loading intelligence systems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col min-h-0">
        <div className="mb-4 flex-shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-1 w-8 rounded-full bg-[var(--intelligence-glow)]" />
            <h1 className="text-2xl font-bold text-foreground">
              University Discovery
            </h1>
          </div>
          <p className="text-sm text-muted-foreground ml-11">
            Select a university to view intelligence analysis and application options
          </p>
        </div>

        <RecommendationCarousel universities={universities} />

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4 min-h-0">
          <div className="lg:col-span-2 h-full min-h-[300px]">
            {loading ? (
              <div className="h-full flex items-center justify-center rounded-xl bg-[var(--intelligence-surface)] intelligence-border-glow">
                <Loader2 className="h-8 w-8 animate-spin text-[var(--intelligence-glow)]" />
              </div>
            ) : (
              <UKIntelligenceMap universities={universities} />
            )}
          </div>

          <div className="lg:col-span-1 h-full min-h-[300px] rounded-xl bg-[var(--intelligence-surface)] intelligence-border-glow overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[var(--intelligence-border)] bg-[var(--intelligence-bg)] flex-shrink-0">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-[var(--intelligence-glow)]" />
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Intelligence Panel
                </h2>
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <UniversityIntelligencePanel />
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-[var(--intelligence-surface)]/50 border border-[var(--intelligence-border)]">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[var(--intelligence-glow)]" />
              <span>Data updated daily</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[var(--intelligence-target)]" />
              <span>Fit scores personalized to your profile</span>
            </div>
            <div className="flex-1" />
            <span>UniPath Intelligence System v1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <DashboardShell>
      <UniversityProvider>
        <DashboardContent />
      </UniversityProvider>
    </DashboardShell>
  );
}
