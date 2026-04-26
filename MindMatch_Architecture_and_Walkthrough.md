# MindMatch: Architecture & User Walkthrough

## 1. Introduction
MindMatch is an intelligent, Next.js-based career assessment platform, specifically tailored for students in Pakistan (O/A Levels or University students). It dynamically connects psychometric properties (like the RIASEC model, Big Five personality traits, motivations, and strengths) to career data powered by an adaptive algorithmic engine and O*NET standards.

---

## 2. Technical Architecture & Component Analysis

### UI Construction (Frontend)
The user interface is built leveraging modern tools:
*   **Next.js (App Router, v14):** Serves as the application framework, taking advantage of both SSR and client components. The main assessment logic is orchestrated via state variables in a unified `app/page.tsx` to emulate a seamless Single Page Application (SPA) experience.
*   **Styling & Theming:** Styling is managed out-of-the-box by **Tailwind CSS**, configured to deliver a dark, premium aesthetic (`bg-[#0B0C10]`, vibrant blue/indigo gradients, UI backdrops) and glassmorphic designs.
*   **Components:** Leverages the **shadcn/ui** or **Radix UI** primitives (`@radix-ui/react-slider`, `progress`, `label`, `select`, etc.) alongside `lucide-react` for slick iconography.
*   **Data Visualization:** Incorporates **Recharts** for visualizing score distributions, strength maps, and personality breakdowns once the student completes the assessment.

### Backend Infrastructure
The backend logic utilizes Next.js API Routes (`app/api/...`), deeply integrated with the Vercel AI SDK:
*   **API Routes:** Folders like `app/api/clarifier` and `app/api/coach` expose server-side endpoints.
*   **AI Integration:** The platform relies heavily on the `@ai-sdk/openai` module. If the standard algorithmic engine (`lib/adaptive_engine.ts`) runs into a tie while trying to narrow down personality/dimension traits, it dynamically reaches out to the `/api/clarifier` route to generate AI-driven tiebreaker questions.
*   **Scoring Logic:** Core scoring algorithms are natively handled inside `lib/scoring.ts`, `lib/adaptive_engine.ts`, and `lib/onet_questions.ts`, minimizing arbitrary roundtrips during normal question answering.

### Database Operations
The database layer is managed through **Supabase (PostgreSQL)**, adhering to strict Row Level Security (RLS) definitions to maintain privacy:
*   **`profiles`**: Extends the `auth.users` behavior, storing information taken during onboarding (age, gender, school, goals).
*   **`assessments`** & **`responses`**: Record timing, completion status, current question depth, and historical Likert choices. Contains automatic triggers (`update_assessment_progress`, `complete_assessment`) for real-time aggregation.
*   **`score_profiles`** & **`career_matches`**: Final psychometric outputs (RIASEC arrays, Big 5 models).
*   **`coach_conversations`** & **`coach_messages`**: Specifically dedicated tables storing AI interaction logs when the user engages in post-assessment career counseling.

### Authentication
Authentication relies squarely on **Supabase SSR**:
*   The `middleware.ts` forces a strict barrier on protected routes holding the user state locally through synchronised cookies across Server & Client components.
*   Uses **Google OAuth** as its primary sign-in bridge (invoked via `supabase.auth.signInWithOAuth`).
*   It protects internal paths such as `/dashboard` and checks for "institution" roles to govern external route access. Furthermore, it imposes a 30-day session preservation and a strict 6-month cooldown between fresh assessments.

### How Everything is Connected
The platform unites all these sub-systems through state-driven mechanics:
1. Client components read the authentication state from Supabase, rendering either the Landing Screen or routing to the `assessment` view.
2. The `lib/adaptive_engine.ts` retrieves the next contextual question. Each state-change triggers local storage autosaves inside the browser (`mind_match_session`), ensuring progress is preserved.
3. Once completed (driven by confidence thresholds or a definitive question count limits), the engine aggregates the answers and saves psychometric results mapping to O*NET databases directly into Supabase.

---

## 3. Detailed User Walkthrough

The platform structures the entire user lifecycle into sequential phases:

### Phase 1: Landing & Authentication (`step: 'landing'`)
*   **What they do:** The user navigates to the application, presented with a vibrant dark-themed hero section stating "Find your best-fit path in 20 minutes".
*   **The Action:** The user clicks **Continue with Google**, triggering standard OAuth.

### Phase 2: User Onboarding (`step: 'onboarding'`)
*   **What they do:** The user is redirected back to the `/?start=1` flow. Since this is their first time, they get redirected to a form to collect personalization metrics.
*   **Information collected:** First Name, Stage (O/A Levels vs. University), Age, Gender, School/University Name, and unstructured Goals.
*   **Result:** Data gets pushed automatically into their `profiles` row using Supabase updates.

### Phase 3: Adaptive Assessment (`step: 'assessment'`)
*   **What they do:** The user interacts with 10-25 adaptive questions, choosing answers on a 5-point Likert scale (Strongly Disagree to Strongly Agree).
*   **Under the hood:** The `adaptive_engine.ts` continuously calculates the 'confidence' scores of user traits. 
    *   If it falls into an uncertain zone, it will fetch questions specifically targeting traits they haven't clarified.
    *   If traits tie out, the engine pings the `/api/clarifier` route directly, asking an AI to synthesize a tie-breaker question.
*   **Result:** It progresses until it reaches stability or hits the absolute maximum cap. 

### Phase 4: Stage Transition (`step: 'transition'` -> `step: 'bridge'`)
*   **What they do:** After finishing, the page locks. For 3.8 seconds, they are shown a teaser/reveal screen (the archetypical persona calculation e.g. "The Innovator").
*   **Result:** The entire user session context deletes from `localStorage`, finalizing the assessment.

### Phase 5: Post-Assessment or Further O*NET Integration
*   The system prompts them with further O*NET based questions if their standard heuristic scores requires deeper validation. This is managed inside a unified loop scaling between custom traits and the 60-question RIASEC O*NET structure (`step: 'onet_assessment'`).
*   Each 10 questions present a "dimension reveal".

### Phase 6: Results Dashboard (`step: 'results'`)
*   **What they do:** The user lands effectively on the final insight dashboard. 
*   **Result:** 
    *   Presentations of Archetype ("The Analytical Leader").
    *   Displays their Top 10 career matches evaluated dynamically via confidence ratings mapped tightly against the `lib/careers` module database.
    *   Displays Big Five graphs and RIASEC breakdown tables.
    *   **The Coach Interaction:** An isolated chat panel connecting them to an AI assistant hooked contextually to their psychometric footprint via `/api/coach`. Users can question the rationale of their career matches immediately inside the UI.
