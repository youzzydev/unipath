import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          date_of_birth: string | null;
          nationality: string | null;
          current_country: string | null;
          education_level: string | null;
          gpa: string | null;
          preferred_subject: string | null;
          preferred_degree: string | null;
          budget_min: number | null;
          budget_max: number | null;
          preferred_locations: string[] | null;
          has_passport: boolean | null;
          profile_completed: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          date_of_birth?: string | null;
          nationality?: string | null;
          current_country?: string | null;
          education_level?: string | null;
          gpa?: string | null;
          preferred_subject?: string | null;
          preferred_degree?: string | null;
          budget_min?: number | null;
          budget_max?: number | null;
          preferred_locations?: string[] | null;
          has_passport?: boolean | null;
          profile_completed?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          date_of_birth?: string | null;
          nationality?: string | null;
          current_country?: string | null;
          education_level?: string | null;
          gpa?: string | null;
          preferred_subject?: string | null;
          preferred_degree?: string | null;
          budget_min?: number | null;
          budget_max?: number | null;
          preferred_locations?: string[] | null;
          has_passport?: boolean | null;
          profile_completed?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      universities: {
        Row: {
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
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          logo_url?: string | null;
          ranking_uk?: number | null;
          ranking_global?: number | null;
          location?: string | null;
          city?: string | null;
          description?: string | null;
          website?: string | null;
          is_russell_group?: boolean | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          logo_url?: string | null;
          ranking_uk?: number | null;
          ranking_global?: number | null;
          location?: string | null;
          city?: string | null;
          description?: string | null;
          website?: string | null;
          is_russell_group?: boolean | null;
          created_at?: string;
        };
      };
      programs: {
        Row: {
          id: string;
          university_id: string | null;
          name: string;
          slug: string | null;
          degree_type: string;
          subject: string | null;
          subject_category: string | null;
          tuition_fees_uk: number | null;
          tuition_fees_intl: number | null;
          duration_years: number | null;
          entry_requirements: Record<string, unknown> | null;
          application_deadline: string | null;
          start_month: string | null;
          application_url: string | null;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          university_id?: string | null;
          name: string;
          slug?: string | null;
          degree_type: string;
          subject?: string | null;
          subject_category?: string | null;
          tuition_fees_uk?: number | null;
          tuition_fees_intl?: number | null;
          duration_years?: number | null;
          entry_requirements?: Record<string, unknown> | null;
          application_deadline?: string | null;
          start_month?: string | null;
          application_url?: string | null;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          university_id?: string | null;
          name?: string;
          slug?: string | null;
          degree_type?: string;
          subject?: string | null;
          subject_category?: string | null;
          tuition_fees_uk?: number | null;
          tuition_fees_intl?: number | null;
          duration_years?: number | null;
          entry_requirements?: Record<string, unknown> | null;
          application_deadline?: string | null;
          start_month?: string | null;
          application_url?: string | null;
          description?: string | null;
          created_at?: string;
        };
      };
      applications: {
        Row: {
          id: string;
          user_id: string | null;
          program_id: string | null;
          status: string | null;
          ai_draft: Record<string, unknown> | null;
          personal_statement: string | null;
          documents: Record<string, unknown> | null;
          notes: string | null;
          submitted_at: string | null;
          offer_received_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          program_id?: string | null;
          status?: string | null;
          ai_draft?: Record<string, unknown> | null;
          personal_statement?: string | null;
          documents?: Record<string, unknown> | null;
          notes?: string | null;
          submitted_at?: string | null;
          offer_received_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          program_id?: string | null;
          status?: string | null;
          ai_draft?: Record<string, unknown> | null;
          personal_statement?: string | null;
          documents?: Record<string, unknown> | null;
          notes?: string | null;
          submitted_at?: string | null;
          offer_received_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      credits: {
        Row: {
          id: string;
          user_id: string;
          balance: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          balance?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          balance?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      credit_transactions: {
        Row: {
          id: string;
          user_id: string | null;
          amount: number;
          type: string;
          description: string | null;
          stripe_payment_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          amount: number;
          type: string;
          description?: string | null;
          stripe_payment_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          amount?: number;
          type?: string;
          description?: string | null;
          stripe_payment_id?: string | null;
          created_at?: string;
        };
      };
    };
  };
};

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type University = Database['public']['Tables']['universities']['Row'];
export type Program = Database['public']['Tables']['programs']['Row'];
export type Application = Database['public']['Tables']['applications']['Row'];
export type Credit = Database['public']['Tables']['credits']['Row'];
