'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/sign-in');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--intelligence-bg)] px-4">
      <Card className="w-full max-w-md bg-[var(--intelligence-surface)] border-[var(--intelligence-border)]">
        <CardContent className="pt-6 space-y-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-[var(--intelligence-glow)]/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-[var(--intelligence-glow)]" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Magic Links Disabled
            </h2>
            <p className="text-slate-400 mb-6">
              We&apos;ve updated to a more secure verification code system.
            </p>
          </div>

          <Link href="/sign-in">
            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[var(--intelligence-glow)] text-black font-semibold rounded-lg hover:bg-[var(--intelligence-glow)]/90 transition-colors">
              Go to Sign In
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>

          <p className="text-xs text-slate-500 text-center">
            You&apos;ll receive a 6-digit code via email instead of a magic link.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
