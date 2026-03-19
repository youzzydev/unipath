'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleCallback() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session?.user) {
          console.error('Auth callback error:', sessionError);
          setError('Authentication failed');
          return;
        }

        const userId = session.user.id;

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('profile_completed')
          .eq('id', userId)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Profile fetch error:', profileError);
        }

        const profileCompleted = profile?.profile_completed ?? false;

        if (profileCompleted) {
          router.push('/dashboard');
        } else {
          router.push('/onboarding');
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      }
    }

    handleCallback();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--intelligence-bg)]">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Authentication Failed</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <a 
            href="/sign-in" 
            className="inline-flex items-center justify-center px-6 py-3 bg-[var(--intelligence-glow)] text-black font-semibold rounded-lg hover:bg-[var(--intelligence-glow)]/90 transition-colors"
          >
            Back to Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--intelligence-bg)]">
      <div className="text-center">
        <div className="relative mb-6">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-[var(--intelligence-glow)]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-3 w-3 rounded-full bg-[var(--intelligence-glow)]" />
          </div>
        </div>
        <p className="text-slate-400">Authenticating...</p>
      </div>
    </div>
  );
}
