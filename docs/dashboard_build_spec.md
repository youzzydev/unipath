# Dashboard Build Specification: Intelligence-Driven University Discovery

## 1. Overview

This document defines the desired logged-in dashboard experience for the UK university application platform targeted at applicants in the KSA and wider GCC.

The dashboard should feel like a premium intelligence and decision-support system rather than a traditional student portal. The homepage should help users discover recommended universities, understand where they are geographically in the UK, evaluate fit based on onboarding data, and take action with a clear application path.

## 2. Product Goal

Create a dashboard that answers three core user questions:

1. What universities are best for me?
2. Where are they located and what is the surrounding city like?
3. What should I do next to apply?

The primary interaction model should connect university recommendations with a central interactive map and a contextual intelligence panel.

## 3. Core Dashboard Concept

### Primary layout

The homepage after login should have three dominant areas:

1. **Top recommendation carousel**
2. **Large central UK intelligence map**
3. **Right-side university intelligence panel**

This replaces the earlier idea of placing applied universities directly on the homepage. Application tracking should instead live on a dedicated screen or in a slide-out drawer.

## 4. Homepage Information Architecture

### 4.1 Top recommendation carousel

The top of the page should feature a horizontally scrollable carousel of recommended universities.

#### Purpose
- Surface personalized matches immediately
- Encourage exploration
- Drive selection of a university that updates the map and intelligence panel

#### Card content
Each university card in the carousel should include:
- university name
- university logo
- campus or city image
- city name
- fit score badge
- short rationale tags such as:
  - Budget Match
  - Strong for Engineering
  - Good International Support
  - Russell Group

#### Interaction
- When a user clicks a university card, it becomes the active selection
- The map should animate or jump to that university’s geographic location
- The intelligence panel should update with details for the selected university
- The selected carousel item should be visually highlighted

### 4.2 Central intelligence map

The center of the homepage should be dominated by a large map of the UK.

#### Purpose
- Make geographic discovery a core part of the experience
- Help users understand regional context
- Create a distinctive and memorable UX

#### Style direction
The visual language should feel like a **military intelligence system / strategic command interface** combined with a premium modern SaaS product.

#### Design characteristics
- dark navy / charcoal background
- glowing cyan / teal accents
- subtle grid overlays
- radar-like visuals
- highlighted target markers for selected universities
- tactical information overlays
- subtle topographic or regional boundary detail
- cinematic but still practical and readable

#### Functional behavior
- Plot universities as clickable markers
- Selecting a university in the carousel centers the map on that university
- Selecting a marker on the map also updates the selected university in the carousel and intelligence panel
- Support zooming and panning
- The map should feel responsive and alive, but not cluttered

#### MVP implementation guidance
For the first version, build this as a polished interactive 2D map with animated pan/zoom behavior rather than a true 3D globe.

Possible MVP behaviors:
- animated fly-to transition when a university is selected
- pulsing selected marker
- map tooltip or hover details
- region-level visual emphasis

### 4.3 Right-side intelligence panel

A persistent right-side panel should show intelligence for the currently selected university.

#### Purpose
- Convert discovery into understanding and action
- Provide a high-information summary without making the user open a new page immediately

#### Panel contents
The intelligence panel should contain:
- university name
- city and region
- overall fit score
- short personalized explanation of fit
- ratings or scores across key metrics
- estimated tuition band
- estimated living cost band
- employability / reputation signal
- international student friendliness
- scholarship or affordability signal if available
- a prominent Apply button
- secondary actions such as Save or View Details

#### Key metrics to visualize
Suggested categories:
- Academic Fit
- Budget Fit
- Location Fit
- Career Fit
- Lifestyle / Community Fit

### 4.4 Application tracking placement

The “universities applied for” section should not sit on the main homepage.

Instead, application tracking should move to either:
- a dedicated Applications page, or
- a slide-out drawer from the side navigation

This keeps the homepage focused on discovery and decision support.

## 5. Recommended User Flow

### Discovery flow
1. User logs in
2. User sees recommended universities in the top carousel
3. User selects a university card
4. The map animates to that university’s location
5. The right-side intelligence panel updates with fit and context
6. User clicks Apply or View Details

### Alternate map-first flow
1. User clicks a university marker on the map
2. The carousel updates to show that university as selected
3. The intelligence panel updates
4. User continues to application

## 6. Required Pages and Surfaces

### 6.1 Dashboard Home
Contains:
- welcome / summary header
- recommended university carousel
- central UK intelligence map
- right-side intelligence panel

### 6.2 University Detail / Intelligence Page
A full page for a selected university, containing:
- extended fit explanation
- city intelligence
- key metrics
- available programs
- deadlines
- entry requirements
- application readiness state
- prominent Apply CTA

### 6.3 Applications Page
Contains:
- in-progress applications
- submitted applications
- status tracking
- deadlines
- missing documents
- AI drafting progress if relevant

### 6.4 Saved / Compare
Optional later pages:
- saved universities
- side-by-side comparison

## 7. UX Principles

### Primary design principle
The dashboard should feel like:
**Discover, assess, and apply from one command center.**

### UX priorities
- make recommendations immediately visible
- make the map the emotional and visual centerpiece
- make selection state obvious
- make the Apply action always easy to find
- keep the experience premium, fast, and focused
- avoid clutter and generic student portal styling

### Visual tone
- premium
- strategic
- intelligent
- confident
- data-rich
- cinematic but usable

## 8. Functional Requirements

### Recommendation carousel
- horizontal scroll or snap carousel
- cards populated from recommendation engine
- selected state
- click interaction updates global selection

### Map view
- UK map with university markers
- animated focus on selected university
- bidirectional sync with carousel and panel
- hover/click state for markers
- scalable for future clustering

### Intelligence panel
- driven by selected university record
- updates in real time when selection changes
- includes fit summary and action buttons

### Global selection state
The selected university should be a shared piece of state used by:
- the carousel
- the map
- the intelligence panel

This is critical for the core UX.

## 9. Suggested Frontend Architecture

Assuming Next.js + TypeScript + Tailwind CSS.

### Suggested route structure
- `/dashboard` → main homepage
- `/dashboard/universities/[slug]` → full intelligence view
- `/dashboard/applications` → application tracking
- `/dashboard/saved` → saved universities
- `/dashboard/compare` → compare view

### Suggested component structure
- `DashboardShell`
- `DashboardHeader`
- `RecommendationCarousel`
- `UniversityRecommendationCard`
- `UKIntelligenceMap`
- `UniversityMarker`
- `UniversityIntelligencePanel`
- `FitScoreBadge`
- `FitMetricsGrid`
- `ApplyButton`
- `ApplicationsDrawer` or separate Applications page

### State management suggestion
Use shared client-side state for selected university.
Possible options:
- React context
- Zustand
- server-provided initial selection with client interactivity

## 10. Data Requirements

Each university record used on the dashboard should ideally include:
- id
- name
- slug
- logo_url
- hero_image_url
- city
- region
- latitude
- longitude
- ranking
- tuition_band or tuition_fee
- living_cost_band
- fit_score
- fit_breakdown
- tags
- summary rationale
- international_support_score
- employability_score
- scholarship_signal

### Fit breakdown example
The fit model should support categories like:
- academic_fit
- budget_fit
- location_fit
- career_fit
- lifestyle_fit

## 11. AI / Matching Logic Expectations

The system should use onboarding answers to drive recommendations and fit explanations.

### The intelligence panel should answer:
- Why is this university recommended?
- How good a fit is it for this specific user?
- Is the city compatible with their preferences and budget?
- Should they apply now?

### Example output style
- “Strong fit for your engineering goals”
- “Within your preferred tuition range”
- “Located in a student-friendly city with moderate living costs”

## 12. MVP Scope

### Must-have for MVP
- dashboard homepage layout
- recommendation carousel
- interactive UK map with animated focus
- synced selected university state
- intelligence panel with fit and CTA
- separate applications page or drawer

### Nice-to-have later
- 3D map effects
- deeper city intelligence
- compare mode
- scholarship fit
- acceptance likelihood prediction
- Arabic localization

## 13. Build Guidance for AI Code Builder

The system should be built with the following priorities:

1. Build the dashboard layout first
2. Implement shared selected-university state
3. Connect carousel selection to map fly-to behavior
4. Connect map marker selection back to carousel and panel
5. Build the intelligence panel with realistic mock data
6. Move applications into a separate screen or drawer
7. Refine styling into the intelligence / command-center aesthetic

### Important implementation note
The homepage should **not** feel like a generic admin dashboard.
It should feel like a high-trust, high-clarity mission control interface for choosing universities.

## 14. Prompt Summary for Builder

Build a logged-in dashboard homepage for a UK university application platform aimed at KSA/GCC students. The page should feature a top horizontal carousel of recommended universities, a large central interactive UK map styled like a military intelligence / command center interface, and a right-side intelligence panel showing the selected university’s fit score, city insights, key metrics, and a prominent Apply button. Selecting a university in the carousel should animate the map to that university’s location and update the intelligence panel. Application tracking should be moved off the homepage into a dedicated Applications page or slide-out drawer. Use Next.js, TypeScript, and Tailwind CSS with a premium dark navy / charcoal visual system and cyan/teal accents.
