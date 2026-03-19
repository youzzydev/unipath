import type { University } from '@/lib/supabase';

export type DegreeType = 'bachelor' | 'master' | 'phd';

export type ApplicationStatus = 
  | 'drafting'
  | 'ai_drafting'
  | 'ai_review'
  | 'ready'
  | 'submitted'
  | 'under_review'
  | 'offered'
  | 'rejected';

export type EducationLevel = 
  | 'high_school'
  | 'diploma'
  | 'bachelor'
  | 'master'
  | 'phd'
  | 'other';

export type SubjectCategory = 
  | 'business'
  | 'engineering'
  | 'computer_science'
  | 'medicine'
  | 'law'
  | 'arts'
  | 'sciences'
  | 'humanities'
  | 'social_sciences'
  | 'other';

export interface UniversityWithPrograms {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  ranking_uk: number | null;
  ranking_global: number | null;
  location: string | null;
  city: string | null;
  description: string | null;
  website: string | null;
  is_russell_group: boolean | null;
  programs?: {
    id: string;
    name: string;
    degree_type: string;
    subject: string | null;
    tuition_fees_intl: number | null;
  }[];
}

export interface ProfileFormData {
  full_name: string;
  phone: string;
  date_of_birth: string;
  nationality: string;
  current_country: string;
  education_level: EducationLevel;
  gpa: string;
  preferred_subject: string;
  preferred_degree: DegreeType;
  budget_min: number;
  budget_max: number;
  preferred_locations: string[];
  has_passport: boolean;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular?: boolean;
}

export interface UniversityWithCoords extends University {
  latitude: number | null;
  longitude: number | null;
}

export interface UniversityWithCoordsAndIntelligence extends UniversityWithCoords {
  intelligence: import('@/data/university-mock').UniversityIntelligence | null;
}
