'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Clock, CheckCircle2, AlertCircle, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Application {
  id: string;
  university: string;
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
    program: 'MSc Computer Science',
    status: 'ai_drafting',
    progress: 65,
  },
  {
    id: '2',
    university: 'Imperial College London',
    program: 'MSc Artificial Intelligence',
    status: 'submitted',
    submittedAt: '2026-03-15',
    progress: 100,
  },
  {
    id: '3',
    university: 'University of Manchester',
    program: 'MSc Data Science',
    status: 'ready',
    progress: 90,
  },
];

const statusConfig: Record<Application['status'], { label: string; color: string; icon: typeof Clock }> = {
  drafting: { label: 'Drafting', color: 'text-slate-400 bg-slate-400/10', icon: FileText },
  ai_drafting: { label: 'AI Drafting', color: 'text-[var(--intelligence-glow)] bg-[var(--intelligence-glow)]/10', icon: Loader2 },
  ready: { label: 'Ready to Submit', color: 'text-[var(--intelligence-target)] bg-[var(--intelligence-target)]/10', icon: CheckCircle2 },
  submitted: { label: 'Submitted', color: 'text-blue-400 bg-blue-400/10', icon: CheckCircle2 },
  under_review: { label: 'Under Review', color: 'text-yellow-400 bg-yellow-400/10', icon: Clock },
  offered: { label: 'Offer Received', color: 'text-[var(--intelligence-target)] bg-[var(--intelligence-target)]/10', icon: CheckCircle2 },
  rejected: { label: 'Rejected', color: 'text-red-400 bg-red-400/10', icon: AlertCircle },
};

export function ApplicationsDrawer({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const applications = mockApplications;

  const inProgress = applications.filter((a) => ['drafting', 'ai_drafting', 'ready'].includes(a.status));
  const submitted = applications.filter((a) => ['submitted', 'under_review', 'offered', 'rejected'].includes(a.status));

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[480px] bg-[var(--intelligence-surface)] border-l border-[var(--intelligence-border)]">
        <SheetHeader className="border-b border-[var(--intelligence-border)] pb-4">
          <SheetTitle className="text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-[var(--intelligence-glow)]" />
            Application Tracker
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 h-[calc(100%-80px)] overflow-y-auto">
          <Tabs defaultValue="in-progress" className="w-full">
            <TabsList className="w-full grid grid-cols-2 bg-[var(--intelligence-bg)]">
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
            </TabsList>

            <TabsContent value="in-progress" className="mt-4 space-y-4">
              {inProgress.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p className="text-sm">No applications in progress</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Start your journey from the Discovery page
                  </p>
                </div>
              ) : (
                inProgress.map((app) => {
                  const config = statusConfig[app.status];
                  const StatusIcon = config.icon;
                  
                  return (
                    <Link 
                      key={app.id} 
                      href={`/dashboard/applications/${app.id}`}
                      onClick={() => setOpen(false)}
                    >
                      <div className="rounded-lg border border-[var(--intelligence-border)] bg-[var(--intelligence-bg)] p-4 hover:border-[var(--intelligence-glow)]/50 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-medium text-white">{app.university}</h3>
                            <p className="text-sm text-slate-400">{app.program}</p>
                          </div>
                          <Badge className={cn('text-xs', config.color)}>
                            <StatusIcon className={cn('h-3 w-3 mr-1', app.status === 'ai_drafting' && 'animate-spin')} />
                            {config.label}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">Progress</span>
                            <span className="text-[var(--intelligence-glow)]">{app.progress}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-[var(--intelligence-surface)] overflow-hidden">
                            <div 
                              className="h-full rounded-full bg-[var(--intelligence-glow)] transition-all"
                              style={{ width: `${app.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </TabsContent>

            <TabsContent value="submitted" className="mt-4 space-y-4">
              {submitted.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p className="text-sm">No submitted applications</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Track your submissions here
                  </p>
                </div>
              ) : (
                submitted.map((app) => {
                  const config = statusConfig[app.status];
                  const StatusIcon = config.icon;
                  
                  return (
                    <div 
                      key={app.id}
                      className="rounded-lg border border-[var(--intelligence-border)] bg-[var(--intelligence-bg)] p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium text-white">{app.university}</h3>
                          <p className="text-sm text-slate-400">{app.program}</p>
                        </div>
                        <Badge className={cn('text-xs', config.color)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {config.label}
                        </Badge>
                      </div>
                      
                      {app.submittedAt && (
                        <p className="text-xs text-slate-500">
                          Submitted: {new Date(app.submittedAt).toLocaleDateString('en-GB', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-4 pt-4 border-t border-[var(--intelligence-border)]">
          <Button 
            variant="outline" 
            className="w-full border-[var(--intelligence-border)] text-slate-400 hover:text-white"
            asChild
          >
            <Link href="/dashboard/applications" onClick={() => setOpen(false)}>
              View All Applications
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
