# UniPath - Agent Development Guidelines

## Project Overview
- **Name:** UniPath
- **Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Location:** `/unipath` directory
- **Package Manager:** npm
- **Database:** Supabase (PostgreSQL)

---

## Build Commands

### Development
```bash
cd unipath
npm run dev              # Start dev server at http://localhost:3000
```

### Build & Production
```bash
npm run build             # Production build
npm run start            # Start production server
```

### Linting
```bash
npm run lint             # Run ESLint
```

### Testing (if configured)
```bash
# Vitest (if installed)
npx vitest run
npx vitest run --testNamePattern="test name"

# Jest (if installed)
npx jest
npx jest --testNamePattern="test name"
```

---

## Code Style Guidelines

### TypeScript
- **Strict mode enabled** in `tsconfig.json` - do not disable
- Always use explicit types for function parameters and return types
- Use `interface` for object shapes, `type` for unions/aliases
- Avoid `any` - use `unknown` when type is truly unknown

### React/Next.js
- Use **App Router** (not Pages Router)
- Use Server Components by default; add `'use client'` only when needed
- Use `.tsx` extension for all React components
- Prefer composition over abstraction
- Use `next/image` for images, `next/link` for navigation

### Imports
Order imports in groups (separate with blank line):
1. Node built-ins
2. External libraries (React, Next.js, etc.)
3. UI components (shadcn/ui)
4. Internal modules (lib, components)
5. Relative imports

```typescript
// Example import order
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { createUser, getUniversities } from '@/lib/actions';
import { cn } from '@/lib/utils';
import type { User, University } from '@/types';
```

### Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Files (pages) | kebab-case | `user-profile.tsx`, `sign-in.tsx` |
| Files (components) | PascalCase | `UserProfile.tsx`, `UniversityCard.tsx` |
| Components | PascalCase | `UserProfile`, `UniversityCard` |
| Functions | camelCase | `getUserData`, `createApplication` |
| Constants | SCREAMING_SNAKE | `MAX_RETRY_COUNT`, `DEFAULT_PAGE_SIZE` |
| Interfaces | PascalCase | `UniversityProgram`, `ApplicationDraft` |
| Enums | PascalCase | `ApplicationStatus`, `DegreeType` |

### CSS/Tailwind
- Use Tailwind utility classes exclusively
- Follow existing patterns in `globals.css`
- Use `dark:` prefix for dark mode variants
- Use CSS variables for theming (defined in `globals.css`)
- Prefer semantic className order: layout → spacing → visual → state

```typescript
// Good
className="flex items-center justify-between px-4 py-2 bg-white rounded-lg border border-gray-200"

// Avoid
className="py-2 px-4 bg-white flex items-center justify-between border gray-200 rounded-lg"
```

### Error Handling
- Always use try/catch for async operations
- Throw descriptive errors: `throw new Error('Failed to fetch universities')`
- Log errors with context (never log sensitive data)
- Return typed error responses from API routes
- Never expose stack traces to end users

```typescript
// Good error handling
try {
  const { data, error } = await supabase.from('users').select('*');
  if (error) throw new Error(`Failed to fetch users: ${error.message}`);
  return data;
} catch (err) {
  console.error('User fetch failed:', { userId, error: err });
  throw err;
}
```

### Database (Supabase)
- Use Supabase client from `@/lib/supabase` (to be created)
- Never expose `SUPABASE_SERVICE_ROLE_KEY` on client side
- Always use RLS policies for security
- Handle null values appropriately with nullish coalescing

---

## Project Structure

```
unipath/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth-related routes
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   ├── (dashboard)/        # Protected routes
│   │   │   └── dashboard/
│   │   ├── api/                # API routes
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── ui/                 # Shadcn UI components
│   │   └── *.tsx               # Custom components
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client
│   │   └── utils.ts            # Utility functions
│   └── types/
│       └── index.ts            # Shared type definitions
├── public/                     # Static assets
├── .env.local                  # Environment variables
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── eslint.config.mjs
```

---

## Key Patterns

### Client Component
```typescript
'use client';

import { useState } from 'react';

interface Props {
  userId: string;
  onComplete: () => void;
}

export function UserProfileForm({ userId, onComplete }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    try {
      await updateProfile(userId, data);
      onComplete();
    } finally {
      setLoading(false);
    }
  }

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Server Action
```typescript
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createApplication(programId: string) {
  const { data, error } = await supabase
    .from('applications')
    .insert({ program_id: programId, status: 'drafting' })
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath('/dashboard');
  redirect(`/dashboard/applications/${data.id}`);
}
```

### Database Query
```typescript
const { data, error } = await supabase
  .from('universities')
  .select('*, programs(*)')
  .eq('is_russell_group', true)
  .order('ranking_uk', { ascending: true })
  .range(offset, offset + limit - 1);

if (error) throw new Error(error.message);
```

---

## Environment Variables

Required in `unipath/.env.local`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI (Phase 3)
OPENAI_API_KEY=sk-...

# Stripe (Phase 3)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Notes

- **No existing tests** - Install Vitest or Jest if tests are needed
- **No Copilot/Cursor rules** - Add rules to `.cursor/rules/` or `.github/copilot-instructions.md` as needed
- **Tailwind v4** uses CSS-based configuration (no `tailwind.config.js`)
- **ESLint** uses flat config in `eslint.config.mjs`
- **Strict mode** is enabled - all code must pass TypeScript strict checks

---

## Recommended Additions

1. Install testing framework: `npm install -D vitest @vitejs/plugin-react`
2. Add shadcn/ui: `npx shadcn@latest init`
3. Create Supabase client in `src/lib/supabase.ts`
4. Add database types in `src/types/index.ts`

### Shadcn UI Notes
- **Toast is deprecated** - Use `sonner` instead for toast notifications
- Install sonner: `npx shadcn@latest add sonner`
- Example usage:
```typescript
import { Toaster } from "@/components/ui/sonner"

<Toaster position="top-right" />
```

---

*Last Updated: February 2026*
