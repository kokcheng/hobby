# Implementation Plan: StartHobby V1

## Overview

This plan implements the StartHobby V1 multi-page HTML application in dependency order: shared JavaScript modules first, then pages from foundational (landing) through interactive (avatar). Each task builds on prior work, ensuring no orphaned code. Property-based tests validate the pure logic modules (engine, avatar-engine, utils) while example-based tests cover UI behavior.

## Tasks

- [x] 1. Set up project foundation and shared utilities
  - [x] 1.1 Create `utils.js` with localStorage helpers, coin logic, streak logic, toast, and achievement checking
    - Implement `getFromStorage(key, defaultValue)` with JSON parse and error handling
    - Implement `saveToStorage(key, value)` with JSON serialization
    - Implement `addCoins(amount)` that reads current balance, adds amount, persists, and returns new total
    - Implement `deductCoins(amount)` that checks sufficiency, deducts if possible, returns boolean
    - Implement `getStreak()` and `updateStreak(completed)` with skip logic (≤1 skip/week allowed)
    - Implement `showToast(message, type)` that dispatches a `show-toast` CustomEvent
    - Implement `checkAchievements()` that evaluates all thresholds against current state
    - Implement `getActiveHobbyPlan()` that returns active hobby data + today's task
    - Implement `toggleSavedHobby(hobbyId)` that adds/removes from savedHobbies array
    - _Requirements: 10.1–10.8, 13.1–13.4, 8.5–8.6, 5.6–5.7, 6.5_

  - [x] 1.2 Create `data.js` with hardcoded hobby catalog, achievements, and rewards
    - Define `HOBBIES` array with 12 hobby objects covering all categories (Art, Music, Fitness, Outdoor, Creative, Craft, Strategy, Wellbeing)
    - Each hobby must include: id, name, category, tags, difficulty, timePerWeek, starterCost, environment, social, spaceNeeded, timeToFirstWin, description, equipment, safetyNotes, commonPitfalls, weekOnePlan (7 days), milestones (3), resources (videos, articles, communities)
    - Define `ACHIEVEMENTS` array with 8 achievement definitions
    - Define `REWARDS` array with 3 redeemable reward options (500, 200, 1000 coins)
    - _Requirements: 3.2, 4.1–4.9, 6.4, 6.6_

  - [x] 1.3 Create `engine.js` with recommendation scoring and ranking
    - Implement `scoreHobby(hobby, profile)` with hard filters (budget, time, environment, social) returning 0 on violation
    - Implement soft scoring: +20 beginner, +30 tag match, +10 each for env/social/space/zero-cost
    - Implement `rankHobbies(hobbies, profile)` that maps scores, filters zeros, sorts descending
    - Implement `getMatchReason(hobby, profile)` that returns highest-scoring matched reason as a string
    - _Requirements: 9.1–9.9, 3.2, 3.3_

  - [x] 1.4 Create `avatar-engine.js` with keyword-match response engine
    - Define `FLOWS` object with trigger keywords and response generators for: greeting, nextStep, stuck, motivation, cost, time, milestone, showPlan, completedToday, easierVersion, fallback
    - Implement `getAvatarResponse(userInput, profile, plan)` that lowercases input, iterates flows, returns first match or fallback
    - Implement `getGreeting(profile, plan)` that returns personalized greeting with name and hobby
    - _Requirements: 7.1, 7.4–7.8_

- [ ] 2. Property-based tests for shared modules
  - [-] 2.1 Set up test infrastructure with Vitest and fast-check
    - Create `package.json` with vitest and fast-check as dev dependencies
    - Create `vitest.config.js` configured for jsdom environment
    - Create `tests/` directory structure matching design (engine, avatar, coins, state, achievements)
    - Create shared generators: `arbitraryHobby()`, `arbitraryProfile()`, `arbitraryCoinBalance()`, `arbitraryReward()`, `arbitraryChatMessage()`, `arbitraryWeekState()`

  - [x] 2.2 Write property test: Hard filter exclusion (Property 1)
    - **Property 1: Hard filter exclusion**
    - For any hobby violating a hard filter, scoreHobby returns 0
    - **Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5, 3.3**

  - [x] 2.3 Write property test: Soft score composition (Property 2)
    - **Property 2: Soft score composition**
    - For any hobby passing all hard filters, score equals sum of applicable soft bonuses
    - **Validates: Requirements 9.6, 9.7, 9.8**

  - [x] 2.4 Write property test: Ranking output invariants (Property 3)
    - **Property 3: Ranking output invariants**
    - rankHobbies output is sorted descending, contains no zeros, and only original hobbies
    - **Validates: Requirements 3.2, 9.9**

  - [x] 2.5 Write property test: Avatar keyword matching (Property 4)
    - **Property 4: Avatar keyword matching**
    - Input with trigger keyword returns matching flow; input without triggers returns fallback
    - **Validates: Requirements 7.4, 7.5, 7.6, 7.7, 7.8**

  - [x] 2.6 Write property test: Coin award additivity (Property 5)
    - **Property 5: Coin award additivity**
    - addCoins(amount) results in balance = previous + amount, persisted to localStorage
    - **Validates: Requirements 10.1, 10.4, 10.6, 10.7**

  - [x] 2.7 Write property test: Coin redemption correctness (Property 6)
    - **Property 6: Coin redemption correctness**
    - deductCoins succeeds when balance >= cost, fails when balance < cost, balance unchanged on failure
    - **Validates: Requirements 6.7, 6.8, 10.8**

  - [x] 2.8 Write property test: Save toggle idempotence (Property 7)
    - **Property 7: Save toggle idempotence**
    - Toggling save twice returns savedHobbies to original state
    - **Validates: Requirements 3.7**

  - [x] 2.9 Write property test: Streak skip logic (Property 8)
    - **Property 8: Streak skip logic**
    - Skip with ≤1 prior skips preserves streak; skip with ≥2 prior skips resets to 0
    - **Validates: Requirements 5.6, 5.7**

  - [x] 2.10 Write property test: Onboarding persistence round-trip (Property 9)
    - **Property 9: Onboarding persistence round-trip**
    - Save then read of valid profile produces equivalent object
    - **Validates: Requirements 2.7, 13.3**

  - [x] 2.11 Write property test: Achievement unlock threshold (Property 10)
    - **Property 10: Achievement unlock threshold**
    - If user state meets threshold, achievement ID appears in unlocked list
    - **Validates: Requirements 6.5**

  - [x] 2.12 Write property test: localStorage corruption resilience (Property 11)
    - **Property 11: localStorage corruption resilience**
    - Missing, null, or invalid JSON returns default value without throwing
    - **Validates: Requirements 13.4**

  - [x] 2.13 Write property test: Chat history persistence round-trip (Property 12)
    - **Property 12: Chat history persistence round-trip**
    - Save then read of chat messages preserves all messages in order
    - **Validates: Requirements 7.10**

- [x] 3. Checkpoint — Shared modules and property tests
  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Implement Landing Page (`index.html`)
  - [x] 4.1 Create `index.html` with full page structure
    - Add CDN imports (Tailwind, Alpine.js, Chart.js, Google Fonts) and Tailwind config extension with brand tokens
    - Implement navigation bar with logo, links, "Start Now" CTA, coin counter, and mobile hamburger menu
    - Implement hero section with headline, sub-headline, and primary CTA button with 0.5s loading state
    - Implement "How It Works" three-step section
    - Implement horizontally scrollable featured hobby cards row (6 cards from data.js) with name, difficulty badge, cost range
    - Implement click handler on hobby cards navigating to `hobby-detail.html?id={hobbyId}`
    - Implement 3 hardcoded testimonial cards with avatar initials, name, and hobby
    - Implement footer with repeated CTA and links to Discover and About
    - Include toast notification component
    - _Requirements: 1.1–1.7, 8.1–8.6, 11.1–11.4, 12.1–12.6_

- [x] 5. Implement Onboarding Wizard (`onboarding.html`)
  - [x] 5.1 Create `onboarding.html` with multi-step wizard
    - Add CDN imports, Tailwind config, navigation bar, and toast component
    - Implement Alpine.js `x-data` with `{ step: 1, totalSteps: 8, answers: {} }` state
    - Implement progress bar with CSS transition on width (step/totalSteps * 100%)
    - Implement all 8 steps: time (segmented buttons), budget (segmented buttons), environment (toggle cards), social (toggle cards), space (toggle cards), learning style (multi-select cards), goals (multi-select tags), name (text input)
    - Implement "Next" button disabled until required selection made (steps 1–7)
    - Implement "Back" button from step 2+ preserving all prior selections
    - Implement slide-in CSS transition between steps
    - On step 8 completion: save answers to localStorage as `hobbyUserProfile`, award 20 coins via `addCoins(20)`, navigate to discovery.html
    - _Requirements: 2.1–2.8, 8.1–8.4, 11.1–11.2, 12.1–12.6_

- [x] 6. Implement Discovery Page (`discovery.html`)
  - [x] 6.1 Create `discovery.html` with filtered and ranked hobby results
    - Add CDN imports, Tailwind config, navigation bar, and toast component
    - Implement skeleton loader shown for 600ms on page load
    - Read `hobbyUserProfile` from localStorage; redirect to onboarding.html if missing
    - Call `rankHobbies(HOBBIES, profile)` to get scored results
    - Implement Filter Panel: category checkboxes, difficulty slider, cost slider, time checkboxes, indoor/outdoor radio, solo/social radio
    - Desktop layout: left sidebar (280px) + right results grid (3 columns)
    - Mobile layout: collapsible filter drawer sliding up from bottom
    - Implement reactive filtering: any filter change instantly re-renders results via Alpine.js
    - Implement sort controls: "Best match", "Easiest to start", "Lowest cost", "A–Z"
    - Implement hobby cards with: name, category tag, difficulty badge, cost range, time range, "Why this fits you" tooltip, "View Plan" CTA, heart save icon
    - Implement heart toggle calling `toggleSavedHobby(id)` and updating nav saved count
    - Implement empty state with illustration and suggestion to widen filters
    - Implement card click navigating to `hobby-detail.html?id={hobbyId}`
    - _Requirements: 3.1–3.10, 8.1–8.7, 9.1–9.9, 11.1–11.5, 12.1–12.6_

- [x] 7. Implement Hobby Detail Page (`hobby-detail.html`)
  - [x] 7.1 Create `hobby-detail.html` with full hobby information
    - Add CDN imports, Tailwind config, navigation bar, and toast component
    - Read hobby ID from `?id=` query parameter; redirect to discovery.html if missing/invalid
    - Implement header with hobby illustration, name, category, difficulty badge, cost badge
    - Implement quick-stats row: time to first win, weekly time, starter cost, environment, social
    - Implement equipment list with required items, costs, alternatives; strikethrough items exceeding user budget
    - Implement Week 1 plan preview as visual checklist (7 items) with titles and "Why this matters" tooltips
    - Implement milestones horizontal timeline: Week 1 win, Month 1 goal, 3-month goal
    - Implement safety notes and common pitfalls in Alpine.js accordion (x-show + transition)
    - Implement curated resources in tabbed interface (Videos, Articles, Communities) with Alpine tab switching
    - Implement sticky sidebar (desktop) with "Start This Hobby" and "Save for Later" buttons
    - "Start This Hobby": save hobby ID to localStorage as `activeHobby`, show 1s confirmation animation, navigate to my-plan.html
    - "Save for Later": add hobby ID to savedHobbies via `toggleSavedHobby(id)`
    - _Requirements: 4.1–4.11, 8.1–8.6, 11.1–11.4, 12.1–12.6_

- [x] 8. Checkpoint — Core pages complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Implement My Plan Page (`my-plan.html`)
  - [x] 9.1 Create `my-plan.html` with daily action centre
    - Add CDN imports, Tailwind config, navigation bar, and toast component
    - Read `activeHobby` from localStorage; show "Choose a hobby first" with CTA to discovery if missing
    - Implement skeleton loader for 600ms on page load
    - Implement top section: active hobby name, illustration, streak counter, coins earned today
    - Implement 7-day horizontal strip with day labels, task icons, completion status (green/grey/red)
    - Implement day click handler showing task detail panel (title, description, resource link, estimated time badge)
    - Implement "Mark Complete" button: mark day green, call `addCoins(30)`, call `updateStreak(true)`, persist to `hobbyProgress`, trigger coin animation, show success toast
    - Implement coin animation (number flies to coin counter)
    - Implement "Skip today" with logic: if ≤1 skip this week, mark skipped without breaking streak; if >1 skip, mark missed and reset streak
    - Implement weekly progress bar (X of 7 days completed)
    - Implement "Log a note" expandable textarea saving to localStorage per task, awarding 10 coins on first save
    - Implement 7-day streak bonus: call `addCoins(50)` when streak reaches 7
    - Call `checkAchievements()` after any state change
    - Desktop: two-panel layout (left: week view, right: task detail). Mobile: stacked
    - _Requirements: 5.1–5.10, 8.1–8.7, 10.1–10.3, 10.6, 11.1–11.4, 12.1–12.6, 13.1–13.3_

- [x] 10. Implement Progress Page (`progress.html`)
  - [x] 10.1 Create `progress.html` with milestones, achievements, and rewards
    - Add CDN imports, Tailwind config, navigation bar, and toast component
    - Implement summary stats row: total days active, current/best streak, total coins, milestones hit
    - Implement vertical milestone timeline with completed (brand colour) and locked (grey) states
    - Implement Chart.js bar chart showing days completed per week for last 4 weeks
    - Implement achievements grid (8 badge cards) with icon, name, description, date earned or "Locked" state
    - Implement achievement unlock animation (CSS 3D card flip from locked to unlocked)
    - Implement coin balance display and reward redemption options (3 rewards with coin costs)
    - Implement "Redeem" button: check balance via `deductCoins(cost)`, show confirmation modal, display success toast or "not enough coins" toast
    - Implement modal/confirmation dialog with Alpine.js x-show + backdrop
    - All data sourced from localStorage via utils.js helpers
    - _Requirements: 6.1–6.8, 8.1–8.6, 10.7–10.8, 11.1–11.4, 12.1–12.6, 13.1–13.2_

- [x] 11. Implement Avatar Coaching Interface (`avatar.html`)
  - [x] 11.1 Create `avatar.html` with scripted chat interface
    - Add CDN imports, Tailwind config, navigation bar, and toast component
    - Implement chat layout: avatar illustration top-centre, message bubbles (user right, avatar left), input bar at bottom
    - On page load: call `getGreeting(profile, plan)` and display greeting message using user's name
    - Implement message sending: append user bubble immediately, show 1s typing indicator, then display avatar response
    - Implement `getAvatarResponse` integration for all keyword flows (next/step, stuck/confused, quit/motivation, cost, time, milestone)
    - Implement quick-reply chips above input bar that change based on conversation state
    - Implement "I completed today" quick reply: mark today's task complete, award coins, display celebration message
    - Implement chat history persistence: save to localStorage under `avatarHistory`, restore on page reload
    - Implement auto-scroll to latest message after each new message
    - Implement avatar typing animation (subtle CSS bob on illustration)
    - Clear input field on send; ignore empty submissions
    - _Requirements: 7.1–7.11, 8.1–8.6, 11.1–11.2, 12.1–12.6, 13.1–13.3_

- [x] 12. Implement About Page (`about.html`)
  - [x] 12.1 Create `about.html` with mission and roadmap
    - Add CDN imports, Tailwind config, navigation bar, and toast component
    - Implement mission statement section
    - Implement "How It Works" three-step visual section (consistent with landing page)
    - Implement roadmap strip: Phase 1 active, Phases 2 and 3 "Coming Soon"
    - Implement team placeholder card section
    - _Requirements: 14.1–14.4, 8.1–8.4, 11.1–11.4, 12.1–12.6_

- [x] 13. Final integration and polish
  - [x] 13.1 Verify cross-page navigation and state consistency
    - Test full user flow: landing → onboarding → discovery → hobby-detail → my-plan → progress → avatar
    - Verify coin counter updates reactively across all pages
    - Verify saved hobbies badge updates in navigation
    - Verify active page link highlighting in navigation bar
    - Verify hamburger menu works on all pages at mobile viewport
    - _Requirements: 8.1–8.4, 13.1–13.3_

  - [x] 13.2 Verify responsive layouts at 375px and 1440px
    - Check single-column layouts below 768px on all pages
    - Check multi-column layouts at 1024px+ on all pages
    - Check max content width cap at 1280px
    - Check filter drawer on mobile Discovery page
    - _Requirements: 11.1–11.5_

  - [x] 13.3 Verify accessibility compliance
    - Check all interactive elements reachable by keyboard (Tab, Enter, Space)
    - Check ARIA labels on icon-only buttons (hamburger, heart, send)
    - Check colour contrast ratio ≥ 4.5:1 for body text
    - Check visible focus rings on all focusable elements
    - Check alt text on all images and illustrations
    - Check form inputs have associated labels
    - _Requirements: 12.1–12.6_

- [x] 14. Final checkpoint — All pages complete and integrated
  - Ensure all tests pass, ask the user if questions arise.

## Task Dependency Graph

```json
{
  "waves": [
    {
      "name": "Foundation",
      "tasks": ["1.1", "1.2", "1.3", "1.4"],
      "description": "Shared JS modules: utils.js, data.js, engine.js, avatar-engine.js"
    },
    {
      "name": "Testing Infrastructure",
      "tasks": ["2.1", "2.2", "2.3", "2.4", "2.5", "2.6", "2.7", "2.8", "2.9", "2.10", "2.11", "2.12", "2.13"],
      "description": "Property-based tests for shared modules",
      "dependsOn": ["Foundation"]
    },
    {
      "name": "Core Pages",
      "tasks": ["4.1", "5.1", "6.1", "7.1"],
      "description": "Landing, Onboarding, Discovery, and Hobby Detail pages",
      "dependsOn": ["Foundation"]
    },
    {
      "name": "Interactive Pages",
      "tasks": ["9.1", "10.1", "11.1", "12.1"],
      "description": "My Plan, Progress, Avatar, and About pages",
      "dependsOn": ["Core Pages"]
    },
    {
      "name": "Integration",
      "tasks": ["13.1", "13.2", "13.3"],
      "description": "Cross-page navigation, responsive layouts, and accessibility verification",
      "dependsOn": ["Interactive Pages"]
    }
  ]
}
```

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- The application uses no build toolchain — all files are standalone HTML with CDN dependencies
- Shared modules (data.js, engine.js, avatar-engine.js, utils.js) must be completed before any page implementation
- Pages are ordered by dependency: landing (standalone) → onboarding (writes profile) → discovery (reads profile) → hobby-detail (reads hobby ID) → my-plan (reads active hobby) → progress (reads all state) → avatar (reads active hobby + progress) → about (standalone)
