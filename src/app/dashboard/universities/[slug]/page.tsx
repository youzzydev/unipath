'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { supabase } from '@/lib/supabase';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { UniversityProvider } from '@/context/university-context';
import { getUniversityIntelligence } from '@/data/university-mock';
import type { UniversityWithCoordsAndIntelligence } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft,
  MapPin, 
  Award, 
  Globe, 
  DollarSign, 
  TrendingUp, 
  Users,
  Calendar,
  Clock,
  ExternalLink,
  CheckCircle2,
  ChevronRight,
  Loader2,
  GraduationCap,
  BookOpen,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Program {
  id: string;
  name: string;
  degree_type: string;
  subject: string;
  tuition_fees_intl: number;
  duration_years: number;
  application_deadline: string;
  start_month: string;
}

const mockPrograms: Program[] = [
  {
    id: '1',
    name: 'MSc Computer Science',
    degree_type: 'master',
    subject: 'Computer Science',
    tuition_fees_intl: 28000,
    duration_years: 1,
    application_deadline: '2026-06-30',
    start_month: 'September',
  },
  {
    id: '2',
    name: 'MSc Artificial Intelligence',
    degree_type: 'master',
    subject: 'AI & Machine Learning',
    tuition_fees_intl: 32000,
    duration_years: 1,
    application_deadline: '2026-06-30',
    start_month: 'September',
  },
  {
    id: '3',
    name: 'MSc Data Science',
    degree_type: 'master',
    subject: 'Data Science',
    tuition_fees_intl: 26500,
    duration_years: 1,
    application_deadline: '2026-07-15',
    start_month: 'September',
  },
];

const fitCategories = [
  { key: 'academic', label: 'Academic', icon: Award },
  { key: 'budget', label: 'Budget', icon: DollarSign },
  { key: 'location', label: 'Location', icon: MapPin },
  { key: 'career', label: 'Career', icon: TrendingUp },
  { key: 'lifestyle', label: 'Lifestyle', icon: Users },
] as const;

function UniversityDetailContent() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const { user, loading: authLoading, profileCompleted } = useAuth();
  const [university, setUniversity] = useState<UniversityWithCoordsAndIntelligence | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/sign-in');
    } else if (!authLoading && user && !profileCompleted) {
      router.push('/onboarding');
    }
  }, [authLoading, user, profileCompleted, router]);

  useEffect(() => {
    async function fetchUniversity() {
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && data) {
        const intelligence = getUniversityIntelligence(slug);
        setUniversity({
          ...data,
          latitude: null,
          longitude: null,
          intelligence,
        });
      }
      setLoading(false);
    }

    if (slug && user && profileCompleted) {
      fetchUniversity();
    }
  }, [slug, user, profileCompleted]);

  if (authLoading || loading || !profileCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--intelligence-glow)]" />
      </div>
    );
  }

  if (!university) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">University not found</h2>
          <p className="text-slate-400 mb-4">The university you&apos;re looking for doesn&apos;t exist.</p>
          <Button asChild>
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const intelligence = university.intelligence;
  const fitScore = intelligence?.fitScore || 0;
  const fitBreakdown = intelligence?.fitBreakdown || {
    academic: 0,
    budget: 0,
    location: 0,
    career: 0,
    lifestyle: 0,
  };

  return (
    <div className="min-h-[calc(100vh-64px)]">
      <div className="relative h-[300px] bg-[var(--intelligence-surface)]">
        {intelligence?.heroImageUrl ? (
          <Image
            src={intelligence.heroImageUrl}
            alt={university.name}
            fill
            className="object-cover opacity-30"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--intelligence-surface)] to-[var(--intelligence-bg)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--intelligence-bg)] via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8 relative z-10">
          <Button
            variant="ghost"
            className="absolute top-8 left-4 text-white hover:text-[var(--intelligence-glow)]"
            asChild
          >
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Discovery
            </Link>
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                {university.is_russell_group && (
                  <Badge className="border-[var(--intelligence-accent)] text-[var(--intelligence-accent)] bg-[var(--intelligence-accent)]/10">
                    Russell Group
                  </Badge>
                )}
                <Badge variant="outline" className="border-slate-500 text-slate-400">
                  #{university.ranking_uk} in UK
                </Badge>
                <Badge variant="outline" className="border-slate-500 text-slate-400">
                  #{university.ranking_global} Globally
                </Badge>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {university.name}
              </h1>
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="h-4 w-4" />
                <span>{university.city}, {university.location}</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-5xl font-bold text-[var(--intelligence-target)] mb-1">
                {fitScore}
              </div>
              <div className="text-sm text-slate-400">Fit Score</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {intelligence?.rationale && (
              <Card className="bg-[var(--intelligence-surface)] border-[var(--intelligence-border)]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="h-5 w-5 text-[var(--intelligence-glow)]" />
                    Why This University?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 leading-relaxed">
                    {intelligence.rationale}
                  </p>
                </CardContent>
              </Card>
            )}

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-[var(--intelligence-surface)] border border-[var(--intelligence-border)]">
                <TabsTrigger 
                  value="overview"
                  className="data-[state=active]:bg-[var(--intelligence-glow)]/10 data-[state=active]:text-[var(--intelligence-glow)]"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="programs"
                  className="data-[state=active]:bg-[var(--intelligence-glow)]/10 data-[state=active]:text-[var(--intelligence-glow)]"
                >
                  Programs
                </TabsTrigger>
                <TabsTrigger 
                  value="requirements"
                  className="data-[state=active]:bg-[var(--intelligence-glow)]/10 data-[state=active]:text-[var(--intelligence-glow)]"
                >
                  Requirements
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card className="bg-[var(--intelligence-surface)] border-[var(--intelligence-border)]">
                  <CardHeader>
                    <CardTitle className="text-white">About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300 leading-relaxed">
                      {university.description}
                    </p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-[var(--intelligence-surface)] border-[var(--intelligence-border)]">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-[var(--intelligence-glow)]/10 flex items-center justify-center">
                          <Globe className="h-5 w-5 text-[var(--intelligence-glow)]" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">International Students</p>
                          <p className="text-lg font-semibold text-white">
                            {intelligence?.internationalSupportScore || 85}%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[var(--intelligence-surface)] border-[var(--intelligence-border)]">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-[var(--intelligence-target)]/10 flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-[var(--intelligence-target)]" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Graduate Employability</p>
                          <p className="text-lg font-semibold text-white">
                            {intelligence?.employabilityScore || 90}%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="programs" className="space-y-4">
                {mockPrograms.map((program) => (
                  <Card 
                    key={program.id}
                    className="bg-[var(--intelligence-surface)] border-[var(--intelligence-border)] hover:border-[var(--intelligence-glow)]/50 transition-colors"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <BookOpen className="h-5 w-5 text-[var(--intelligence-glow)]" />
                            <h3 className="text-lg font-semibold text-white">{program.name}</h3>
                          </div>
                          <p className="text-sm text-slate-400 mb-4">{program.subject}</p>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {program.duration_years} year{program.duration_years > 1 ? 's' : ''}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              £{program.tuition_fees_intl.toLocaleString()}/year
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Deadline: {new Date(program.application_deadline).toLocaleDateString('en-GB', { 
                                day: 'numeric', 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </div>
                          </div>
                        </div>

                        <Button className="bg-[var(--intelligence-glow)] hover:bg-[var(--intelligence-glow)]/90 text-black font-semibold">
                          Apply
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="requirements" className="space-y-4">
                <Card className="bg-[var(--intelligence-surface)] border-[var(--intelligence-border)]">
                  <CardHeader>
                    <CardTitle className="text-white">Entry Requirements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[var(--intelligence-target)] mt-0.5" />
                      <div>
                        <p className="font-medium text-white">Academic Requirements</p>
                        <p className="text-sm text-slate-400">UK 2:1 or equivalent for postgraduate programs</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[var(--intelligence-target)] mt-0.5" />
                      <div>
                        <p className="font-medium text-white">English Language</p>
                        <p className="text-sm text-slate-400">IELTS 6.5 (6.0 in all bands) or equivalent</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[var(--intelligence-target)] mt-0.5" />
                      <div>
                        <p className="font-medium text-white">Supporting Documents</p>
                        <p className="text-sm text-slate-400">Personal statement, academic references, CV</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="bg-[var(--intelligence-surface)] border-[var(--intelligence-border)] sticky top-24">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-[var(--intelligence-glow)]" />
                  Your Fit Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {fitCategories.map(({ key, label, icon: Icon }) => {
                    const value = fitBreakdown[key];
                    return (
                      <div key={key} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-slate-400">
                            <Icon className="h-4 w-4" />
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
                        <div className="h-2 rounded-full bg-[var(--intelligence-bg)] overflow-hidden">
                          <div 
                            className={cn(
                              'h-full rounded-full transition-all',
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

                <div className="pt-4 border-t border-[var(--intelligence-border)] space-y-3">
                  <Button className="w-full bg-[var(--intelligence-glow)] hover:bg-[var(--intelligence-glow)]/90 text-black font-semibold">
                    Apply Now
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-[var(--intelligence-border)] text-slate-400 hover:text-white"
                  >
                    Save for Later
                  </Button>
                  {university.website && (
                    <Button 
                      variant="ghost" 
                      className="w-full text-slate-400 hover:text-[var(--intelligence-glow)]"
                      asChild
                    >
                      <a href={university.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Official Website
                      </a>
                    </Button>
                  )}
                </div>

                {intelligence?.scholarshipSignal && intelligence.scholarshipSignal !== 'none' && (
                  <div className="pt-4 border-t border-[var(--intelligence-border)]">
                    <div className={cn(
                      'rounded-lg p-3 border',
                      intelligence.scholarshipSignal === 'high' 
                        ? 'bg-[var(--intelligence-target)]/10 border-[var(--intelligence-target)]/30'
                        : 'bg-[var(--intelligence-glow)]/10 border-[var(--intelligence-glow)]/30'
                    )}>
                      <p className={cn(
                        'text-sm font-medium',
                        intelligence.scholarshipSignal === 'high' 
                          ? 'text-[var(--intelligence-target)]'
                          : 'text-[var(--intelligence-glow)]'
                      )}>
                        {intelligence.scholarshipSignal === 'high' ? 'High Scholarship Potential' : 'Scholarships Available'}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UniversityDetailPage() {
  return (
    <DashboardShell>
      <UniversityProvider>
        <UniversityDetailContent />
      </UniversityProvider>
    </DashboardShell>
  );
}
