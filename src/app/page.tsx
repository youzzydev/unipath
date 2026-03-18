'use client';

import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { ArrowRight, GraduationCap, Target, Rocket, Shield, Globe } from 'lucide-react';

export default function LandingPage() {
  const { user, profileCompleted, loading } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">UniPath</span>
          </div>
          <nav className="flex items-center space-x-4">
            {!loading && !user && (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/sign-in">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
            {!loading && user && (
              <Link href={profileCompleted ? '/dashboard' : '/onboarding'}>
                <Button>Go to Dashboard</Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main>
        <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">
              Your Path to UK Universities
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover and apply to the best UK universities with AI-powered recommendations. 
              Free matching, paid application assistance.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/sign-in">
                <Button size="lg" className="text-lg px-8">
                  Start Free Matching
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              No credit card required
            </p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">1. Complete Your Profile</h3>
                <p className="text-gray-600">
                  Answer a few questions about your education, preferences, and goals.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">2. Get Matched</h3>
                <p className="text-gray-600">
                  Our AI recommends the best UK universities and programs for you - free.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Rocket className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">3. Apply with AI</h3>
                <p className="text-gray-600">
                  Use credits to get AI-assisted application drafting and submission.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why UniPath?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Shield className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Transparent Pricing</h3>
                <p className="text-gray-600">
                  No hidden fees. See exactly what you&apos;re paying for.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Globe className="h-10 w-10 text-green-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">GCC Focus</h3>
                <p className="text-gray-600">
                  Built specifically for students from Saudi Arabia and the Gulf.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Rocket className="h-10 w-10 text-purple-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
                <p className="text-gray-600">
                  Advanced AI helps craft your applications for maximum impact.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Find Your Perfect University?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of GCC students who found their path to the UK.
            </p>
            <Link href="/sign-in">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <GraduationCap className="h-6 w-6 text-white" />
              <span className="text-white font-bold">UniPath</span>
            </div>
            <p className="text-sm">
              © 2026 UniPath. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
