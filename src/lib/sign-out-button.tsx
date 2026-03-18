'use client';

import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth';
import { Button } from '@/components/ui/button';

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push('/sign-in');
    router.refresh();
  }

  return (
    <Button variant="ghost" onClick={handleSignOut}>
      Sign out
    </Button>
  );
}
