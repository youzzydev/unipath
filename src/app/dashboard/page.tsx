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
import { universityIntelligenceData } from '@/data/university-mock';
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
        .order('ranking_uk', { ascending: true });

      if (!error && data) {
        const universitiesWithIntelligence: UniversityWithCoordsAndIntelligence[] = data.map((uni) => ({
          ...uni,
          latitude: null,
          longitude: null,
          intelligence: universityIntelligenceData[uni.slug] || null,
        }));

        const topUniversities = universitiesWithIntelligence
          .filter((uni) => uni.intelligence)
          .sort((a, b) => (b.intelligence?.fitScore || 0) - (a.intelligence?.fitScore || 0))
          .slice(0, 15);

        setUniversities(topUniversities);
      }
      setLoading(false);
    }

    if (user && profileCompleted) {
      fetchUniversities();
    }
  }, [user, profileCompleted]);

  if (authLoading || (!profileCompleted && user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Radar className="h-12 w-12 text-[var(--intelligence-glow)] animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-[var(--intelligence-glow)]" />
            </div>
          </div>
          <p className="text-slate-400">Loading intelligence systems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col min-h-0">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-1 w-8 rounded-full bg-[var(--intelligence-glow)]" />
            <h1 className="text-2xl font-bold text-white">
              University Discovery
            </h1>
          </div>
          <p className="text-sm text-slate-400 ml-11">
            Select a university to view intelligence analysis and application options
          </p>
        </div>

        <RecommendationCarousel universities={universities} />

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 min-h-0">
          <div className="lg:col-span-2 min-h-[400px] lg:min-h-0">
            {loading ? (
              <div className="h-full flex items-center justify-center rounded-xl bg-[var(--intelligence-surface)] intelligence-border-glow">
                <Loader2 className="h-8 w-8 animate-spin text-[var(--intelligence-glow)]" />
              </div>
            ) : (
              <UKIntelligenceMap universities={universities} />
            )}
          </div>

          <div className="lg:col-span-1 min-h-[500px] lg:min-h-0 rounded-xl bg-[var(--intelligence-surface)] intelligence-border-glow overflow-hidden">
            <div className="p-4 border-b border-[var(--intelligence-border)] bg-[var(--intelligence-bg)]">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-[var(--intelligence-glow)]" />
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Intelligence Panel
                </h2>
              </div>
            </div>
            <UniversityIntelligencePanel />
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-[var(--intelligence-surface)]/50 border border-[var(--intelligence-border)]">
          <div className="flex items-center gap-4 text-xs text-slate-500">
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
