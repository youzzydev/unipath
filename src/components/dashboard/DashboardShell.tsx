'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { signOut } from '@/lib/auth';
import { 
  Map, 
  GraduationCap, 
  FileText, 
  Bookmark, 
  Menu, 
  LogOut,
  User,
  Bell
} from 'lucide-react';

interface DashboardShellProps {
  children: React.ReactNode;
}

const navItems = [
  { href: '/dashboard', label: 'Discovery', icon: Map },
  { href: '/dashboard/applications', label: 'Applications', icon: FileText },
  { href: '/dashboard/saved', label: 'Saved', icon: Bookmark },
];

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/sign-in');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--intelligence-bg)] intelligence-gradient">
      <header className="sticky top-0 z-50 w-full border-b border-[var(--intelligence-border)] bg-[var(--intelligence-surface)]/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="relative">
                <GraduationCap className="h-8 w-8 text-[var(--intelligence-glow)]" />
                <div className="absolute inset-0 h-8 w-8 pulse-glow rounded-full" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Uni<span className="text-[var(--intelligence-glow)]">Path</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || 
                  (item.href !== '/dashboard' && pathname.startsWith(item.href));
                
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        'gap-2 transition-all duration-200',
                        isActive 
                          ? 'bg-[var(--intelligence-glow)]/10 text-[var(--intelligence-glow)] hover:bg-[var(--intelligence-glow)]/20' 
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-slate-400 hover:text-white"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[var(--intelligence-glow)] text-[10px] font-bold text-black flex items-center justify-center">
                2
              </span>
            </Button>

            <div className="hidden sm:flex items-center gap-3">
              <div className="flex items-center gap-3 rounded-lg border border-[var(--intelligence-border)] bg-[var(--intelligence-bg)] px-3 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--intelligence-glow)]/20">
                  <User className="h-4 w-4 text-[var(--intelligence-glow)]" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-white">
                    {loading ? 'Loading...' : profile?.full_name || 'User'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {profile?.nationality || 'GCC Applicant'}
                  </p>
                </div>
              </div>
            </div>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-slate-400">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-[var(--intelligence-surface)] border-l border-[var(--intelligence-border)]">
                <div className="flex flex-col gap-6 mt-6">
                  <div className="flex items-center gap-3 px-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--intelligence-glow)]/20">
                      <User className="h-5 w-5 text-[var(--intelligence-glow)]" />
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {profile?.full_name || 'User'}
                      </p>
                      <p className="text-sm text-slate-500">
                        {profile?.nationality || 'GCC Applicant'}
                      </p>
                    </div>
                  </div>

                  <nav className="flex flex-col gap-1">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      
                      return (
                        <Link 
                          key={item.href} 
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Button
                            variant="ghost"
                            className={cn(
                              'w-full justify-start gap-3',
                              isActive 
                                ? 'bg-[var(--intelligence-glow)]/10 text-[varelligence-glow)]' 
                                : 'text-slate-400'
                            )}
                          >
                            <Icon className="h-5 w-5" />
                            {item.label}
                          </Button>
                        </Link>
                      );
                    })}
                  </nav>

                  <div className="mt-auto">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-5 w-5" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
