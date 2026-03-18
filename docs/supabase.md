# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in details:
   - **Name:** uni-path (or your preferred name)
   - **Database Password:** Create a strong password (save this!)
   - **Region:** `EU (Frankfurt)` or `Asia (Singapore)` - closest to GCC
4. Wait for project to provision (~2 minutes)

---

## 2. SQL Setup

Go to **SQL Editor** in your Supabase dashboard and run the following queries:

### 2.1 Create Tables

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  nationality TEXT,
  current_country TEXT,
  education_level TEXT,
  gpa TEXT,
  preferred_subject TEXT,
  preferred_degree TEXT,
  budget_min INTEGER,
  budget_max INTEGER,
  preferred_locations TEXT[],
  has_passport BOOLEAN DEFAULT false,
  profile_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Universities
CREATE TABLE universities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  ranking_uk INTEGER,
  ranking_global INTEGER,
  location TEXT,
  city TEXT,
  description TEXT,
  website TEXT,
  is_russell_group BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Programs
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT,
  degree_type TEXT NOT NULL, -- bachelor, master, phd
  subject TEXT,
  subject_category TEXT,
  tuition_fees_uk INTEGER,
  tuition_fees_intl INTEGER,
  duration_years DECIMAL(2,1),
  entry_requirements JSONB,
  application_deadline DATE,
  start_month TEXT,
  application_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User applications
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'drafting', -- drafting,ai_drafting,ai_review,ready,submitted,under_review,offered,rejected
  ai_draft JSONB,
  personal_statement TEXT,
  documents JSONB,
  notes TEXT,
  submitted_at TIMESTAMPTZ,
  offer_received_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Credits
CREATE TABLE credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Credit transactions
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL, -- purchase, grant, use, refund
  description TEXT,
  stripe_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.2 Enable Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
```

### 2.3 RLS Policies

```sql
-- PROFILES: Users can only read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- UNIVERSITIES: Public read access
CREATE POLICY "Anyone can view universities" ON universities
  FOR SELECT USING (true);

-- PROGRAMS: Public read access
CREATE POLICY "Anyone can view programs" ON programs
  FOR SELECT USING (true);

-- APPLICATIONS: Users can only see their own
CREATE POLICY "Users can view own applications" ON applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own applications" ON applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications" ON applications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications" ON applications
  FOR DELETE USING (auth.uid() = user_id);

-- CREDITS: Users can only see their own
CREATE POLICY "Users can view own credits" ON credits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own credits" ON credits
  FOR UPDATE USING (auth.uid() = user_id);

-- CREDIT TRANSACTIONS: Users can only see their own
CREATE POLICY "Users can view own credit transactions" ON credit_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own credit transactions" ON credit_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 2.4 Auth Hook (Auto-create profile on signup)

```sql
-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email);
  
  INSERT INTO public.credits (user_id, balance)
  VALUES (NEW.id, 0);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 2.5 Create Indexes (Performance)

```sql
CREATE INDEX idx_programs_university ON programs(university_id);
CREATE INDEX idx_programs_degree_type ON programs(degree_type);
CREATE INDEX idx_programs_subject ON programs(subject);
CREATE INDEX idx_applications_user ON applications(user_id);
CREATE INDEX idx_applications_program ON applications(program_id);
CREATE INDEX idx_universities_location ON universities(location);
```

---

## 3. Auth Configuration

1. Go to **Authentication → Providers → Email**
2. Enable **Email Magic Link**
3. Under **Redirect URLs**, add:
   - `http://localhost:3000/auth/callback`
   - `https://yourdomain.com/auth/callback` (for production)

---

## 4. Get API Keys

1. Go to **Project Settings → API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

---

## 5. Seed Universities

Run the seed script to populate universities:

```bash
# This will be run via Supabase dashboard SQL or CLI
# See seed/universities.sql for the data
```

---

## 6. Verification

After setup, verify:
- [ ] Tables created (check Table Editor)
- [ ] RLS policies active
- [ ] Email magic link enabled
- [ ] API keys copied to .env.local

---

*Document Version: 1.0*  
*Created: February 2026*
