'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { UniversityProvider } from '@/context/university-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Plus,
  GraduationCap,
  Calendar,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Application {
  id: string;
  university: string;
  universitySlug: string;
  program: string;
  status: 'drafting' | 'ai_drafting' | 'ready' | 'submitted' | 'under_review' | 'offered' | 'rejected';
  submittedAt?: string;
  deadline?: string;
  progress: number;
}

const mockApplications: Application[] = [
  {
    id: '1',
    university: 'University of Edinburgh',
    universitySlug: 'university-of-edinburgh',
    program: 'MSc Computer Science',
    status: 'ai_drafting',
    progress: 65,
  },
  {
    id: '2',
    university: 'Imperial College London',
    universitySlug: 'imperial-college-london',
    program: 'MSc Artificial Intelligence',
    status: 'submitted',
    submittedAt: '2026-03-15',
    progress: 100,
  },
  {
    id: '3',
    university: 'University of Manchester',
    universitySlug: 'university-of-manchester',
    program: 'MSc Data Science',
    status: 'ready',
    progress: 90,
  },
  {
    id: '4',
    university: 'University of Bristol',
    universitySlug: 'university-of-bristol',
    program: 'MSc Software Engineering',
    status: 'under_review',
    submittedAt: '2026-02-20',
    progress: 100,
  },
  {
    id: '5',
    university: 'University of Glasgow',
    universitySlug: 'university-of-glasgow',
    program: 'MSc Data Science',
    status: 'offered',
    submittedAt: '2026-01-10',
    progress: 100,
  },
];

const statusConfig: Record<Application['status'], { label: string; color: string; icon: typeof Clock; description: string }> = {
  drafting: { 
    label: 'Drafting', 
    color: 'text-slate-400 bg-slate-400/10 border-slate-400/30', 
    icon: FileText,
    description: 'Filling in application details'
  },
  ai_drafting: { 
    label: 'AI Drafting', 
    color: 'text-[var(--intelligence-glow)] bg-[var(--intelligence-glow)]/10 border-[var(--intelligence-glow)]/30', 
    icon: Loader2,
    description: 'Generating personal statement'
  },
  ready: { 
    label: 'Ready', 
    color: 'text-[var(--intelligence-target)] bg-[var(--intelligence-target)]/10 border-[var(--intelligence-target)]/30', 
    icon: CheckCircle2,
    description: 'Ready to submit'
  },
  submitted: { 
    label: 'Submitted', 
    color: 'text-blue-400 bg-blue-400/10 border-blue-400/30', 
    icon: CheckCircle2,
    description: 'Application submitted'
  },
  under_review: { 
    label: 'Under Review', 
    color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30', 
    icon: Clock,
    description: 'University reviewing your application'
  },
  offered: { 
    label: 'Offer Received', 
    color: 'text-[var(--intelligence-target)] bg-[var(--intelligence-target)]/10 border-[var(--intelligence-target)]/30', 
    icon: CheckCircle2,
    description: 'Congratulations!'
  },
  rejected: { 
    label: 'Rejected', 
    color: 'text-red-400 bg-red-400/10 border-red-400/30', 
    icon: AlertCircle,
    description: 'Application not successful'
  },
};

function ApplicationsContent() {
  const { user, loading: authLoading, profileCompleted } = useAuth();
  const router = useRouter();
  const [applications] = useState<Application[]>(mockApplications);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/sign-in');
    } else if (!authLoading && user && !profileCompleted) {
      router.push('/onboarding');
    }
  }, [authLoading, user, profileCompleted, router]);

  if (authLoading || (!profileCompleted && user)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--intelligence-glow)]" />
      </div>
    );
  }

  const inProgress = applications.filter((a) => ['drafting', 'ai_drafting', 'ready'].includes(a.status));
  const submitted = applications.filter((a) => ['submitted', 'under_review'].includes(a.status));
  const completed = applications.filter((a) => ['offered', 'rejected'].includes(a.status));

  return (
    <div className="min-h-[calc(100vh-64px)]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-1 w-8 rounded-full bg-[var(--intelligence-glow)]" />
              <h1 className="text-2xl font-bold text-white">Applications</h1>
            </div>
            <p className="text-sm text-slate-400 ml-11">
              Track and manage your university applications
            </p>
          </div>
          <Button className="bg-[var(--intelligence-glow)] hover:bg-[var(--intelligence-glow)]/90 text-black font-semibold">
            <Plus className="h-4 w-4 mr-2" />
            New Application
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-[var(--intelligence-surface)] border-[var(--intelligence-border)]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">In Progress</p>
                  <p className="text-3xl font-bold text-white">{inProgress.length}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-[var(--intelligence-glow)]/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-[var(--intelligence-glow)]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[var(--intelligence-surface)] border-[var(--intelligence-border)]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Submitted</p>
                  <p className="text-3xl font-bold text-white">{submitted.length}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-blue-400/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[var(--intelligence-surface)] border-[var(--intelligence-border)]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Offers</p>
                  <p className="text-3xl font-bold text-[var(--intelligence-target)]">{completed.filter(c => c.status === 'offered').length}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-[var(--intelligence-target)]/10 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-[var(--intelligence-target)]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-[var(--intelligence-surface)] border border-[var(--intelligence-border)]">
            <TabsTrigger 
              value="all"
              className="data-[state=active]:bg-[var(--intelligence-glow)]/10 data-[state=active]:text-[var(--intelligence-glow)]"
            >
              All ({applications.length})
            </TabsTrigger>
            <TabsTrigger 
              value="in-progress"
              className="data-[state=active]:bg-[var(--intelligence-glow)]/10 data-[state=active]:text-[var(--intelligence-glow)]"
            >
              In Progress ({inProgress.length})
            </TabsTrigger>
            <TabsTrigger 
              value="submitted"
              className="data-[state=active]:bg-[var(--intelligence-glow)]/10 data-[state=active]:text-[var(--intelligence-glow)]"
            >
              Submitted ({submitted.length})
            </TabsTrigger>
            <TabsTrigger 
              value="completed"
              className="data-[state=active]:bg-[var(--intelligence-glow)]/10 data-[state=active]:text-[var(--intelligence-glow)]"
            >
              Completed ({completed.length})
            </TabsTrigger>
          </TabsList>

          {(['all', 'in-progress', 'submitted', 'completed'] as const).map((tab) => {
            const apps = tab === 'all' 
              ? applications 
              : tab === 'in-progress' 
                ? inProgress 
                : tab === 'submitted' 
                  ? submitted 
                  : completed;

            return (
              <TabsContent key={tab} value={tab} className="space-y-4">
                {apps.length === 0 ? (
                  <div className="text-center py-16 text-slate-400 rounded-xl border border-dashed border-[var(--intelligence-border)] bg-[var(--intelligence-surface)]/30">
                    <FileText className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-medium mb-2">No applications yet</p>
                    <p className="text-sm text-slate-500 mb-6">
                      Start your journey by exploring universities
                    </p>
                    <Button asChild>
                      <Link href="/dashboard">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Discover Universities
                      </Link>
                    </Button>
                  </div>
                ) : (
                  apps.map((app) => {
                    const config = statusConfig[app.status];
                    const StatusIcon = config.icon;
                    
                    return (
                      <Link 
                        key={app.id} 
                        href={`/dashboard/applications/${app.id}`}
                        className="block"
                      >
                        <Card className="bg-[var(--intelligence-surface)] border-[var(--intelligence-border)] hover:border-[var(--intelligence-glow)]/50 transition-all cursor-pointer group">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-semibold text-white group-hover:text-[var(--intelligence-glow)] transition-colors">
                                    {app.university}
                                  </h3>
                                  <Badge variant="outline" className={cn('text-xs', config.color)}>
                                    <StatusIcon className={cn('h-3 w-3 mr-1', app.status === 'ai_drafting' && 'animate-spin')} />
                                    {config.label}
                                  </Badge>
                                </div>
                                <p className="text-sm text-slate-400 mb-4">{app.program}</p>
                                
                                <div className="flex items-center gap-6 text-xs text-slate-500">
                                  {app.submittedAt && (
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      Submitted {new Date(app.submittedAt).toLocaleDateString('en-GB', { 
                                        day: 'numeric', 
                                        month: 'short', 
                                        year: 'numeric' 
                                      })}
                                    </div>
                                  )}
                                  <div className={cn(
                                    'text-xs',
                                    app.status === 'ai_drafting' ? 'text-[var(--intelligence-glow)]' :
                                    app.status === 'ready' ? 'text-[var(--intelligence-target)]' :
                                    'text-slate-500'
                                  )}>
                                    {config.description}
                                  </div>
                                </div>

                                {['drafting', 'ai_drafting', 'ready'].includes(app.status) && (
                                  <div className="mt-4">
                                    <div className="flex items-center justify-between text-xs mb-2">
                                      <span className="text-slate-500">Progress</span>
                                      <span className="text-[var(--intelligence-glow)]">{app.progress}%</span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-[var(--intelligence-bg)] overflow-hidden max-w-md">
                                      <div 
                                        className="h-full rounded-full bg-[var(--intelligence-glow)] transition-all"
                                        style={{ width: `${app.progress}%` }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>

                              <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-[var(--intelligence-glow)] transition-colors" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <DashboardShell>
      <UniversityProvider>
        <ApplicationsContent />
      </UniversityProvider>
    </DashboardShell>
  );
}
