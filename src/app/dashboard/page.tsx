'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { supabase, University } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, GraduationCap, MapPin, Crown } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, profileCompleted } = useAuth();
  const [universities, setUniversities] = useState<University[]>([]);
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
        .order('ranking_uk', { ascending: true })
        .limit(6);

      if (!error && data) {
        setUniversities(data);
      }
      setLoading(false);
    }

    if (user && profileCompleted) {
      fetchUniversities();
    }
  }, [user, profileCompleted]);

  if (authLoading || !profileCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">UniPath</span>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/dashboard/recommendations">
              <Button variant="ghost">Find Universities</Button>
            </Link>
            <Link href="/dashboard/applications">
              <Button variant="ghost">My Applications</Button>
            </Link>
            <Link href="/dashboard/credits">
              <Button variant="ghost">Buy Credits</Button>
            </Link>
            <Button variant="outline">Sign Out</Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-gray-600">
            Discover UK universities and start your application journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Credits</CardTitle>
              <GraduationCap className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-gray-500">
                <Link href="/dashboard/credits" className="text-blue-600 hover:underline">
                  Buy more credits
                </Link>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <Plus className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-gray-500">
                <Link href="/dashboard/recommendations" className="text-blue-600 hover:underline">
                  Start an application
                </Link>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile</CardTitle>
              <Crown className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Complete</div>
              <p className="text-xs text-gray-500">
                <Link href="/dashboard/profile" className="text-blue-600 hover:underline">
                  Edit profile
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Top Universities</h2>
          <Link href="/dashboard/recommendations">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.map((uni) => (
              <Card key={uni.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{uni.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {uni.city}, {uni.location}
                      </CardDescription>
                    </div>
                    {uni.is_russell_group && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        Russell Group
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      UK Rank: #{uni.ranking_uk}
                    </span>
                    <Link href={`/dashboard/university/${uni.slug}`}>
                      <Button size="sm">View Programs</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
