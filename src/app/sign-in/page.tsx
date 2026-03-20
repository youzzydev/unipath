'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { sendOtp, verifyOtp } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail, ArrowLeft, RefreshCw } from 'lucide-react';

type SignInStep = 'email' | 'otp';

export default function SignInPage() {
  const router = useRouter();
  const [step, setStep] = useState<SignInStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await sendOtp(email);
      setStep('otp');
      setResendCooldown(60);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err: unknown) {
      console.error('Send OTP error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to send verification code. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    const token = otp.join('');
    if (token.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await verifyOtp(email, token);
      
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('profile_completed')
          .eq('id', data.user.id)
          .single();

        const profileCompleted = profile?.profile_completed ?? false;

        if (profileCompleted) {
          router.push('/dashboard');
        } else {
          router.push('/onboarding');
        }
      } else {
        setError('Verification failed. Please try again.');
      }
    } catch (err: unknown) {
      console.error('Verify OTP error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Invalid verification code. Please try again.';
      setError(errorMessage);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  async function handleResendCode() {
    if (resendCooldown > 0) return;
    
    setLoading(true);
    setError(null);
    setOtp(['', '', '', '', '', '']);

    try {
      await sendOtp(email);
      setResendCooldown(60);
    } catch (err: unknown) {
      console.error('Resend OTP error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to resend code. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every(digit => digit) && newOtp.join('').length === 6) {
      const form = inputRefs.current[0]?.closest('form');
      if (form) {
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        form.dispatchEvent(submitEvent);
      }
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    
    if (pastedData) {
      const newOtp = [...otp];
      pastedData.split('').forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      setOtp(newOtp);
      
      const lastFilledIndex = Math.min(pastedData.length - 1, 5);
      inputRefs.current[lastFilledIndex]?.focus();
      
      if (newOtp.join('').length === 6) {
        const form = inputRefs.current[0]?.closest('form');
        if (form) {
          const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
          form.dispatchEvent(submitEvent);
        }
      }
    }
  }

  function goBackToEmail() {
    setStep('email');
    setOtp(['', '', '', '', '', '']);
    setError(null);
  }

  if (step === 'otp') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--intelligence-bg)] px-4">
        <Card className="w-full max-w-md bg-[var(--intelligence-surface)] border-[var(--intelligence-border)] shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-16 h-16 bg-[var(--intelligence-glow)]/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-[var(--intelligence-glow)]" />
            </div>
            <CardTitle className="text-2xl text-foreground">Enter Verification Code</CardTitle>
            <CardDescription className="text-muted-foreground">
              We sent a 6-digit code to <span className="text-foreground font-medium">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div 
                className="flex justify-center gap-2"
                onPaste={handleOtpPaste}
              >
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-bold bg-[var(--intelligence-bg)] border-[var(--intelligence-border)] text-foreground placeholder:text-muted-foreground focus:border-[var(--intelligence-glow)] focus:ring-1 focus:ring-[var(--intelligence-glow)] focus:outline-none"
                    disabled={loading}
                  />
                ))}
              </div>

              {error && (
                <p className="text-sm text-[var(--intelligence-danger)] text-center">{error}</p>
              )}

              <Button 
                type="submit" 
                className="w-full bg-[var(--intelligence-glow)] hover:bg-[var(--intelligence-glow)]/90 text-white font-semibold"
                disabled={loading || otp.join('').length !== 6}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Code'
                )}
              </Button>
            </form>

            <div className="flex flex-col items-center gap-3">
              <Button
                variant="ghost"
                onClick={handleResendCode}
                disabled={resendCooldown > 0 || loading}
                className="text-muted-foreground hover:text-[var(--intelligence-glow)]"
              >
                {resendCooldown > 0 ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resend code ({resendCooldown}s)
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Resend code
                  </>
                )}
              </Button>

              <Button
                variant="ghost"
                onClick={goBackToEmail}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Use different email
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Code expires in 15 minutes. Check your spam folder if you don&apos;t see it.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--intelligence-bg)] px-4">
      <Card className="w-full max-w-md bg-[var(--intelligence-surface)] border-[var(--intelligence-border)] shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-[var(--intelligence-glow)]/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-[var(--intelligence-glow)]" />
          </div>
          <CardTitle className="text-2xl text-foreground">Welcome to UniPath</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your email to receive a verification code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendCode} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="bg-[var(--intelligence-bg)] border-[var(--intelligence-border)] text-foreground placeholder:text-muted-foreground focus:border-[var(--intelligence-glow)] focus:ring-1 focus:ring-[var(--intelligence-glow)] focus:outline-none"
              />
            </div>

            {error && (
              <p className="text-sm text-[var(--intelligence-danger)]">{error}</p>
            )}

            <Button 
              type="submit" 
              className="w-full bg-[var(--intelligence-glow)] hover:bg-[var(--intelligence-glow)]/90 text-white font-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending code...
                </>
              ) : (
                'Send Verification Code'
              )}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            No password needed. We&apos;ll send you a secure code.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
