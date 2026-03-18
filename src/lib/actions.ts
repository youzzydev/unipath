'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { updateProfile } from '@/lib/auth';

interface ProfileData {
  full_name: string;
  phone: string;
  date_of_birth: string;
  nationality: string;
  current_country: string;
  education_level: string;
  gpa: string;
  preferred_subject: string;
  preferred_degree: string;
  budget_min: number;
  budget_max: number;
  preferred_locations: string[];
  has_passport: boolean;
}

export async function saveProfile(userId: string, data: ProfileData) {
  const updates = {
    ...data,
    profile_completed: true,
    updated_at: new Date().toISOString(),
  };

  await updateProfile(userId, updates);
  revalidatePath('/dashboard');
  redirect('/dashboard');
}

export async function saveProfileStep(userId: string, step: number, data: Partial<ProfileData>) {
  const { updateProfile } = await import('@/lib/auth');
  
  await updateProfile(userId, {
    ...data,
    updated_at: new Date().toISOString(),
  });
  
  return { success: true };
}
