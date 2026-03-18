# Project Plan: UK University Application Service for GCC Students

## 1. Executive Summary

**Project Name:** UniPath (placeholder)  
**Mission:** Disrupt the manual university placement industry by providing GCC students an AI-powered platform to discover, apply, and secure placements at UK universities.

**Value Proposition:**
- Free university/program recommendations based on student profile
- Paid credits for AI-assisted application drafting and submission
- Revenue through credit purchases + university partnership commissions

---

## 2. Target Market

| Segment | Details |
|---------|---------|
| **Primary Users** | GCC students (KSA-first, then UAE, Qatar, Bahrain, Oman, Kuwait) seeking undergraduate/postgraduate UK placements |
| **Age Range** | 17-25 (undergrad), 22-35 (postgrad) |
| **Pain Points** | High fees from placement agencies, lack of transparency, confusing application processes |
| **Market Size** | ~500K+ GCC students annually considering international education |

---

## 3. Core Features

### 3.1 Student Assessment Engine
- Multi-step questionnaire (academic history, GPA, preferred field, budget, location preferences, career goals)
- Profile scoring algorithm
- Saved profile functionality

### 3.2 University & Program Database
- Comprehensive UK university database (Russell Group, red brick, modern universities)
- Program catalog with entry requirements, tuition fees, deadlines
- Filter/search by: subject, ranking, location, tuition, entry requirements

### 3.3 Smart Matching System
- Algorithm matches student profiles to suitable programs
- Acceptance probability calculator
- Personalized recommendation list with rationale

### 3.4 AI Application Assistant (Credit-Based)
- **Credit System:** Users purchase credits (e.g., 1 credit = 1 application draft)
- Personal statement generator based on profile + program requirements
- Essay/review drafting for specific questions
- Document optimization suggestions

### 3.5 Application Management
- Dashboard to track all applications
- Deadline reminders
- Document upload (transcripts, recommendations, passport)
- Application status tracking

### 3.6 Human Oversight Layer
- AI drafts applications
- User reviews and edits before submission
- Optional add-on: Human review service (paid)

### 3.7 Admin Portal
- University partner management
- Commission tracking
- Student analytics
- Content management (program data updates)

---

## 4. User Flow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Landing    │────▶│  Assessment  │────▶│  Recommendations│
│  Page       │     │  (Quiz)      │     │  (Free)         │
└─────────────┘     └──────────────┘     └────────┬────────┘
                                                  │
                    ┌──────────────┐              │
                    │  Purchase    │◀─────────────┘
                    │  Credits     │
                    └──────┬───────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  AI Draft     │  │  Essay        │  │  Application  │
│  Personal     │  │  Generator     │  │  Submit       │
│  Statement    │  │               │  │  (with review)│
└───────┬───────┘  └───────┬───────┘  └───────┬───────┘
        │                 │                  │
        └─────────────────┼──────────────────┘
                          ▼
                  ┌───────────────┐
                  │  Dashboard    │
                  │  Tracking     │
                  └───────────────┘
```

---

## 5. Technical Architecture

### 5.1 Tech Stack
| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14+, TypeScript, Tailwind CSS |
| **Backend** | Next.js API Routes / Server Actions |
| **Database** | PostgreSQL (via Supabase or Neon) |
| **Authentication** | NextAuth.js / Clerk |
| **AI** | OpenAI API (GPT-4) for application drafting |
| **File Storage** | AWS S3 / Supabase Storage |
| **Payments** | Stripe (credit purchases) |
| **Email** | Resend / SendGrid |
| **Hosting** | Vercel |

### 5.2 Data Models

```
User
├── id, email, name, phone
├── profile (JSON: academic, preferences)
├── credits_balance
├── created_at

University
├── id, name, slug, logo_url
├── ranking, location, description
├── website, contact_email

Program
├── id, university_id
├── name, degree_type (bachelor/master/PhD)
├── subject, tuition_fees
├── entry_requirements (JSON)
├── deadlines, application_url

Application
├── id, user_id, program_id
├── status (drafting/submitted/under_review/offered/rejected)
├── documents (JSON)
├── ai_draft (JSON)
├── submitted_at

CreditTransaction
├── id, user_id, amount, type (purchase/use)
├── stripe_payment_id
├── created_at

Partner
├── id, university_id
├── commission_rate, payment_terms
├── tracking_code
```

---

## 6. AI Implementation

### 6.1 Personal Statement Generator
- **Input:** User profile, selected program requirements, essay prompts
- **Process:** 
  1. Retrieve program-specific requirements
  2. Pull relevant achievements from user profile
  3. Generate tailored draft using GPT-4
  4. Return editable draft to user
- **Output:** Multiple paragraph draft (500-1000 words)

### 6.2 Application Review Assistant
- Analyze draft applications
- Suggest improvements for clarity, impact, fit
- Check against program requirements

### 6.3 Prompt Engineering Requirements
- Persona: Expert UK university admissions consultant
- Context: GCC student cultural background awareness
- Templates for different degree types and subjects

---

## 7. Development Phases

### Phase 1: Foundation (Weeks 1-4)
| Task | Deliverable |
|------|-------------|
| Setup Next.js project + CI/CD | Repo ready |
| Database schema design + migration | PostgreSQL live |
| Authentication system | Users can sign up/login |
| University data seeding | 100+ UK universities |
| Basic landing page | Public site live |

### Phase 2: Core Features (Weeks 5-10)
| Task | Deliverable |
|------|-------------|
| Student assessment questionnaire | Profile creation flow |
| University/program catalog with search | Browse page functional |
| Matching algorithm | Recommendations engine |
| User dashboard | Track saved programs |

### Phase 3: AI & Payments (Weeks 11-16)
| Task | Deliverable |
|------|-------------|
| Credit system (Stripe integration) | Purchase credits |
| AI personal statement generator | Draft generation |
| Application review AI | Feedback tool |
| Document management | Upload transcripts, docs |

### Phase 4: Submission & Admin (Weeks 17-20)
| Task | Deliverable |
|------|-------------|
| Application submission flow | Submit to university portals |
| Admin dashboard | Manage universities, view analytics |
| Partner/commission tracking | University partnership portal |
| Email notifications | Deadline reminders, status updates |

### Phase 5: Polish & Launch (Weeks 21-24)
| Task | Deliverable |
|------|-------------|
| Testing + QA | Bug fixes |
| Performance optimization | Load testing |
| User acceptance testing | Beta feedback |
| Launch | Public release |

---

## 8. Team Requirements

| Role | Responsibilities | Phase |
|------|------------------|-------|
| **Full-Stack Developer** | End-to-end development | All |
| **AI/ML Engineer** | Prompt engineering, AI integration | Phase 3+ |
| **UI/UX Designer** | User research, design system | Phase 1-2 |
| **DevOps** | Infrastructure, CI/CD, monitoring | Phase 1 |
| **Content Manager** | University data, program updates | Ongoing |

**Estimated Team:** 2-3 developers + 1 designer (or 3-4 full-stack)

---

## 9. Timeline Summary

| Phase | Duration | Key Milestone |
|-------|----------|---------------|
| Phase 1 | 4 weeks | Foundation ready |
| Phase 2 | 6 weeks | Core matching live |
| Phase 3 | 6 weeks | AI + payments live |
| Phase 4 | 4 weeks | Submission + admin |
| Phase 5 | 4 weeks | Launch |

**Total MVP:** ~24 weeks (6 months)

---

## 10. Monetization Model

### Revenue Streams
1. **Credit Purchases**
   - Pack A: 3 credits = $49
   - Pack B: 5 credits = $79
   - Pack C: 10 credits = $149
   - Price per application draft: ~$15-20

2. **University Partnerships**
   - Commission per successful enrollment: £500-2000
   - Revenue share on tuition (0.5-2%)

3. **Optional Upsells**
   - Human review service: $29/application
   - Visa assistance add-on: $99

---

## 11. Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| University data accuracy | High | Automated feeds + manual review process |
| AI quality/accuracy | Medium | Human oversight required, feedback loops |
| Competition from established agencies | Medium | Superior UX, transparency, pricing |
| University anti-automation policies | High | "AI with oversight" model, manual submission option |
| Data privacy (GCC regulations) | High | GDPR + Saudi data residency compliance |
| Payment processing in KSA | Medium | Stripe, local payment methods (Mada, STC Pay) |

---

## 12. Success Metrics (KPIs)

| Metric | Target (Year 1) |
|--------|-----------------|
| Users registered | 10,000+ |
| Applications submitted | 5,000+ |
| Conversion (free → paid) | 5% |
| Revenue | $100K+ |
| University partnerships | 20+ |
| User satisfaction | 4.5/5 |

---

## 13. Next Steps

1. **Immediate:**
   - Finalize branding/name
   - Set up development environment
   - Begin Phase 1 development

2. **Before Launch:**
   - Secure 5-10 university partnership LOIs
   - Prepare Arabic language support (Phase 2)
   - Legal consultation (data privacy, terms)

---

## 14. Future Enhancements

- Arabic language support
- Mobile app (iOS/Android)
- More UK universities + expand to US/Canada/Australia
- Scholarship finder
- Visa guidance AI assistant
- Alumni network / peer reviews

---

*Document Version: 1.0*  
*Created: February 2026*
