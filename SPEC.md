# StartHobby Web Application — V1 Specification

**Document version:** 1.0  
**Date:** 2026-05-21  
**Source thesis:** StartHobby Thesis: Product, Data, Architecture, and Avatar Strategy (v2)  
**Author:** S. Shivashne — CTO, StartHobby

---

## 1. Purpose and Scope

This specification defines the V1 responsive web application for StartHobby — a guided hobby discovery and onboarding platform. The goal is to deliver the core user journey end-to-end with full interactivity, using hardcoded data instead of a live backend.

**V1 constraints:**
- No server-side backend or database.
- All hobby catalog data and user state are hardcoded / held in browser memory (localStorage).
- The full interactive experience must function entirely in the browser.

---

## 2. Technology Stack

| Layer | Choice | Rationale |
|---|---|---|
| Markup | HTML5 | Semantic, accessible structure |
| Styling | Tailwind CSS v3 (CDN) | Utility-first, responsive breakpoints out of the box |
| Interactivity | Alpine.js v3 (CDN) | Lightweight reactive state tied directly to HTML; no build step |
| Icons | Heroicons (inline SVG or CDN) | Matches Tailwind aesthetics |
| Charts / progress | Chart.js (CDN) | Progress rings and bar charts for tracking |
| Fonts | Google Fonts — Inter | Clean, modern, legible |

**No build toolchain, no npm, no bundler.** Every page is a standalone `.html` file that loads dependencies from CDN.

### CDN imports (add to every page `<head>`)

```html
<script src="https://cdn.tailwindcss.com"></script>
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

---

## 3. Application Pages & Navigation

The app is structured as a multi-page HTML application. A persistent top navigation bar links all pages. Mobile navigation collapses into a hamburger menu.

| Page | File | Description |
|---|---|---|
| Landing | `index.html` | Hero + value proposition + CTA |
| Onboarding | `onboarding.html` | Multi-step preference wizard |
| Discovery | `discovery.html` | Filtered & ranked hobby results |
| Hobby Detail | `hobby-detail.html` | Full hobby info, requirements, plan preview |
| My Plan | `my-plan.html` | Active hobby daily/weekly task view |
| Progress | `progress.html` | Milestones, streak, coins earned |
| Avatar | `avatar.html` | Scripted avatar coaching interface |
| About | `about.html` | Mission and platform overview |

Navigation order: **Discover → My Plan → Progress → Avatar**

---

## 4. Responsive Breakpoints

Use Tailwind's default breakpoints consistently across all pages:

| Breakpoint | Width | Layout behaviour |
|---|---|---|
| `sm` | ≥ 640 px | Single column → minor adjustments |
| `md` | ≥ 768 px | Two-column grids begin |
| `lg` | ≥ 1024 px | Full multi-column layouts, side panels |
| `xl` | ≥ 1280 px | Max content width capped at 1280 px |

All pages must be tested and usable at 375 px (iPhone SE) and 1440 px (desktop).

---

## 5. Brand & Design Tokens

Define in a `<style>` block or Tailwind config extension on each page.

```js
// Tailwind config extension (inline script after CDN import)
tailwind.config = {
  theme: {
    extend: {
      colors: {
        brand:   { DEFAULT: '#4F46E5', light: '#818CF8', dark: '#3730A3' },
        accent:  { DEFAULT: '#F59E0B', light: '#FCD34D' },
        surface: { DEFAULT: '#F9FAFB', card: '#FFFFFF' },
        ink:     { DEFAULT: '#111827', muted: '#6B7280' },
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
    }
  }
}
```

**Principle:** Clean, encouraging, minimal. White space is generous. Colour is used to signal progress and action, not decoration.

---

## 6. Page Specifications

### 6.1 Landing Page (`index.html`)

**Purpose:** Convert a first-time visitor into an onboarding participant.

**Sections:**

1. **Hero** — Full-viewport section.
   - Headline: *"Find a hobby that actually fits your life."*
   - Sub-headline: 1–2 sentences from the executive summary.
   - Primary CTA button → `onboarding.html`.
   - Background: subtle gradient (brand → white), an illustration or Lottie animation of hobby icons.

2. **How It Works** — Three-step visual strip (icons + short text):
   - Step 1: Tell us about yourself
   - Step 2: Get matched hobbies
   - Step 3: Follow your personalised plan

3. **Featured Hobbies** — Horizontal scroll card row (6 hobby cards, hardcoded).
   - Each card: hobby image placeholder, name, difficulty badge, cost range.
   - Click → `hobby-detail.html` with hobby ID in query string (`?id=watercolour`).

4. **Testimonial Strip** — 3 hardcoded quote cards with avatar initials, name, hobby.

5. **Footer CTA** — Repeat primary CTA. Links: Discover, About.

**Interactivity (Alpine.js):**
- Hamburger menu toggle on mobile.
- Hobby card hover animation (scale, shadow).
- CTA button loading state (0.5 s delay then navigate).

---

### 6.2 Onboarding Wizard (`onboarding.html`)

**Purpose:** Capture user preferences and constraints to drive the recommendation ranking engine.

**Structure:** Single-page multi-step wizard. Steps live in one file; Alpine.js controls which step is visible. Progress bar shows completion %.

**Steps:**

| Step | Field | Input Type | Options |
|---|---|---|---|
| 1 | Weekly time available | Segmented button | `<2 hrs`, `2–5 hrs`, `5–10 hrs`, `10+ hrs` |
| 2 | Budget range | Segmented button | `Free`, `<$50/mo`, `$50–$150/mo`, `$150+/mo` |
| 3 | Environment preference | Toggle cards with icons | `Indoor`, `Outdoor`, `Both` |
| 4 | Social preference | Toggle cards with icons | `Solo`, `With others`, `Either` |
| 5 | Space available | Toggle cards | `Small (desk/mat)`, `Room`, `Garage/yard`, `Outside space` |
| 6 | Learning style | Multi-select cards | `Watch videos`, `Read guides`, `Step-by-step tasks`, `Try first, learn later` |
| 7 | Goals | Multi-select tags | `Relax`, `Be creative`, `Get fit`, `Meet people`, `Build a skill`, `Have fun` |
| 8 | Name (optional) | Text input | Used to personalise avatar greeting |

**Interactivity:**
- `x-data` object on `<body>` holds `{ step: 1, totalSteps: 8, answers: {} }`.
- "Next" is disabled until a selection is made for required steps (steps 1–7).
- "Back" always enabled from step 2+.
- On step 8 completion: save `answers` to `localStorage` as `hobbyUserProfile`, navigate to `discovery.html`.
- Animated step transition: slide-in from right (CSS transition + Alpine class toggle).
- Progress bar fills smoothly using CSS transition on `width`.

---

### 6.3 Hobby Discovery (`discovery.html`)

**Purpose:** Show ranked, filtered hobby recommendations based on the onboarding answers.

**Layout:**

- **Desktop (lg+):** Left sidebar (filters, 280 px) + right results grid (3 columns).
- **Mobile:** Collapsible filter drawer (slides up from bottom) + single-column card list.

**Filter Panel (sidebar / drawer):**

Filters are interactive but driven by hardcoded hobby data, not a server.

| Filter | Control |
|---|---|
| Category | Checkbox group (Art, Music, Fitness, Outdoor, Tech, Craft, Social) |
| Difficulty | Range slider (Beginner → Advanced) |
| Cost | Range slider ($0 → $200/mo) |
| Time per week | Checkbox (Any, `<2 hrs`, `2–5 hrs`, `5+`) |
| Indoor / Outdoor | Radio |
| Solo / Social | Radio |

**Results Grid:**

- Default sort order: ranking score (derived from onboarding answers against hardcoded hobby attributes — pure JS, no server).
- Sort control: "Best match", "Easiest to start", "Lowest cost", "A–Z".
- Results count badge: *"12 hobbies match your profile"*.
- Each **Hobby Card** contains:
  - Illustration / coloured icon block
  - Hobby name (bold)
  - Category tag pill
  - Difficulty badge (Beginner / Intermediate / Advanced)
  - Cost icon + range (e.g. *"$0 – $20 to start"*)
  - Time icon + range (e.g. *"2–3 hrs/week"*)
  - "Why this fits you" tooltip (1 line, generated from matched preference fields)
  - "View Plan" CTA + "Save" heart icon
- Click card → `hobby-detail.html?id={hobbyId}`
- Click heart → toggles saved state in `localStorage`; saved count badge in nav increments.

**Interactivity (Alpine.js):**
- Reactive filter state: any filter change instantly re-renders the result list (no page reload).
- `x-for` loop renders cards from filtered & sorted JS array.
- Empty state: friendly illustration + suggestion to widen filters.
- Skeleton loader: shown for 600 ms on page load (simulates async fetch).

---

### 6.4 Hobby Detail (`hobby-detail.html`)

**Purpose:** Give users all the information they need to commit to a hobby and start their plan.

**Layout:** Single scrollable page. Desktop: two columns (main content left, sticky sidebar right).

**Sections:**

1. **Header** — Large illustration, hobby name, category, difficulty, and cost badges.

2. **"What this hobby is"** — 2–3 sentence description + quick-stats row:
   - Time to first win
   - Weekly time commitment
   - Starter cost
   - Indoor / Outdoor / Both
   - Solo / Social / Either

3. **What you need to start** — Bulleted equipment list with optional alternatives, sourced from hardcoded hobby data. Strikethrough items the user can skip based on their budget (JS logic comparing `starterCost` against onboarding budget answer).

4. **Your Beginner Plan (preview)** — Week 1 tasks as a visual checklist (7 items max). Each item has a short title and a "Why this matters" tooltip.

5. **Milestones** — Horizontal timeline: Week 1 win → Month 1 goal → 3-month goal.

6. **Safety & Common Pitfalls** — Accordion (Alpine.js `x-show`) with 3–5 items.

7. **Curated Resources** — Tabbed section (Videos / Articles / Communities). Each resource: title, source badge, duration, level tag.

**Sticky Sidebar (desktop):**
- Hobby name + illustration thumbnail
- "Start This Hobby" primary button → saves to `localStorage` as `activeHobby`, navigates to `my-plan.html`
- "Save for Later" secondary button

**Interactivity:**
- Accordion expand/collapse (Alpine `x-show` + transition).
- Tab switching for resources (Alpine `x-data` `{ activeTab: 'videos' }`).
- "Start This Hobby" button: shows a 1-second confirmation animation before navigating.
- Hobby ID is read from `?id=` query string; correct hardcoded data object is loaded via JS.

---

### 6.5 My Plan (`my-plan.html`)

**Purpose:** The user's daily action centre for their active hobby.

**Layout:** Two-panel desktop (left: calendar/week view; right: task detail panel). Mobile: stacked.

**Top Section:**
- Active hobby name + illustration.
- Streak counter: *"🔥 5-day streak"* (stored in localStorage).
- Coins earned today badge (e.g. *"⭐ 30 coins today"*).

**Week View:**
- 7-day horizontal strip. Each day: day label, task icon, completion dot (green = done, grey = pending, red = missed).
- Click a day → right panel shows that day's task detail.

**Today's Task Panel:**
- Task title (e.g. *"Watch a 10-min intro video and sketch your first shape"*).
- Description paragraph.
- Resource link (if any).
- Estimated time badge.
- "Mark Complete" button → marks day green, awards coins, increments streak, records to localStorage.
- "Log a note" expandable text area → saved to localStorage per task.

**Weekly Progress Bar:**
- Shows X / 7 days completed this week.

**Interactivity (Alpine.js):**
- Alpine `x-data` loads active hobby plan from hardcoded data + localStorage progress state.
- Marking a task complete triggers a coin animation (number flies to coin counter).
- Day strip is scrollable on mobile.
- "Skip today" option: marks day as skipped (grey with slash), does not break streak if ≤1 skip per week (JS logic).

---

### 6.6 Progress Page (`progress.html`)

**Purpose:** Show the user how far they have come — milestones, streak, coins, achievements.

**Sections:**

1. **Summary Stats Row** — Four cards:
   - Total days active
   - Current streak / best streak
   - Coins earned (total)
   - Milestones hit

2. **Milestone Timeline** — Vertical timeline. Each node: milestone name, date hit (or "Locked"), icon. Completed nodes are filled brand colour; future nodes are grey.

3. **Activity Chart** — Bar chart (Chart.js): last 4 weeks, bars show days completed per week. 

4. **Achievements** — Grid of badge cards. Each badge: icon, name, description, date earned or "Locked" state. Minimum 8 hardcoded badges (e.g. "Day One", "Week Warrior", "First Win", "Streak Master").

5. **Coins & Rewards** — Coin balance display. Hardcoded reward redemption options:
   - Discount voucher (requires 500 coins)
   - Premium resource access (requires 200 coins)
   - Partner benefit (requires 1000 coins)
   - "Redeem" button checks coin balance; shows success or "not enough coins" toast.

**Interactivity (Alpine.js):**
- All data sourced from localStorage (coins, streak, completed days, unlocked achievements).
- Achievement unlock animation: card flips from locked to unlocked state (CSS 3D flip).
- Chart.js bar chart rendered on `DOMContentLoaded`.
- Redeem button: confirmation modal (Alpine `x-show`) before deducting coins.

---

### 6.7 Avatar Coaching Interface (`avatar.html`)

**Purpose:** Deliver scripted coaching, answer beginner questions, and reinforce daily actions — all through a conversational avatar UI.

**Implementation:** Scripted + state-based (Option A from the thesis). No LLM API calls in V1. Responses are selected from a hardcoded decision tree / keyword-match lookup.

**Layout:**
- Full-height chat panel, avatar illustration top-centre.
- Message bubble thread (user right, avatar left).
- Input bar at bottom with text field + "Send" button.
- Quick-reply chips above input bar (contextual suggestions).

**Avatar Persona:**
- Name: **Havi** (Hobby Advisor).
- Tone: friendly, encouraging, direct, not overwhelming.
- Avatar illustration: abstract character with hobby-themed background.

**Scripted Conversation Flows:**

| Trigger | Avatar Response |
|---|---|
| Page load / first visit | Greeting + asks how they are going with their hobby |
| Keyword: "what do I do" / "next step" | Returns today's task from active plan (localStorage) |
| Keyword: "stuck" / "not sure" / "confused" | Returns "Common Pitfall #1" for the active hobby |
| Keyword: "motivation" / "give up" / "quit" | Returns encouraging message + streak reminder |
| Keyword: "cost" / "expensive" / "buy" | Returns starter equipment list alternatives |
| Keyword: "how long" / "time" / "busy" | Returns time estimate for this week's tasks |
| Keyword: "milestone" / "goal" | Returns next milestone and progress toward it |
| Quick reply: "Show my plan" | Renders a mini plan summary in chat bubble |
| Quick reply: "I completed today" | Marks task complete (same as My Plan), awards coins, celebrates |
| Quick reply: "I need an easier version" | Suggests a simplified version of today's task |
| Unrecognised input | *"I'm not sure I understood that — here are things I can help with:"* + quick replies |

**Interactivity:**
- Alpine `x-data` manages message array; `x-for` renders bubbles.
- Sending a message appends user bubble immediately, then adds a 1-second "typing" indicator before avatar reply appears.
- Input field clears on send.
- Quick-reply chips change based on conversation state (e.g. post-completion chips differ from opening chips).
- Chat thread auto-scrolls to latest message.
- Avatar illustration bobs with a subtle CSS animation when "typing".

---

### 6.8 About Page (`about.html`)

**Purpose:** Explain the mission and build trust.

**Sections:**
1. Mission statement (from thesis conclusion, paraphrased).
2. "How It Works" three-step visual (reused from landing page).
3. Roadmap — Three-phase strip (Phase 1 active, Phases 2 and 3 "Coming Soon").
4. Team placeholder card.

---

## 7. Shared Components

These components appear on multiple pages and should be consistent.

### 7.1 Navigation Bar

- **Desktop:** Logo left, nav links centre, "Start Now" CTA button + coin counter right.
- **Mobile:** Logo left, hamburger icon right. Hamburger opens a full-width slide-down menu.
- Active page link is underlined / brand coloured.
- Coin counter reads from localStorage; updates reactively.

### 7.2 Toast Notifications

Alpine-driven floating toast (top-right, auto-dismiss 3 s). Types: success (green), info (blue), warning (amber). Used for: task completed, coins earned, achievement unlocked, save action.

### 7.3 Loading Skeleton

CSS animated pulse placeholder cards (grey blocks). Shown for 600 ms on pages that simulate data loading (Discovery, My Plan).

### 7.4 Modal / Confirmation Dialog

Alpine `x-show` + backdrop overlay. Used for: redeem confirmation, "Start This Hobby" (if already active hobby exists).

---

## 8. Hardcoded Data Model

All data lives in a shared `data.js` file imported into each page via `<script src="data.js">`.

### 8.1 Hobby Object

```js
{
  id: "watercolour-painting",
  name: "Watercolour Painting",
  category: "Art",
  tags: ["creative", "indoor", "solo", "relaxing"],
  difficulty: "beginner",          // beginner | intermediate | advanced
  timePerWeek: { min: 2, max: 4 }, // hours
  starterCost: { min: 15, max: 40 },
  environment: "indoor",           // indoor | outdoor | both
  social: "solo",                  // solo | social | either
  spaceNeeded: "small",            // small | room | yard | outside
  timeToFirstWin: "1 week",
  description: "...",
  equipment: [
    { item: "Watercolour paint set", required: true,  cost: 15, alternative: "Kids watercolours ($5)" },
    { item: "Watercolour paper (A4 pad)", required: true,  cost: 8,  alternative: "Thick cartridge paper" },
    { item: "3 brushes (sizes 2, 6, 12)", required: true,  cost: 10, alternative: "Any brush pack" },
  ],
  safetyNotes: ["...", "..."],
  commonPitfalls: [
    { issue: "Over-working the paint", fix: "Let each layer dry fully before adding more." },
  ],
  weekOnePlan: [
    { day: 1, title: "Watch a 10-min intro video", description: "...", estimatedTime: "15 min", coins: 10 },
    // ... 7 days
  ],
  milestones: [
    { label: "First Win",    timeframe: "Week 1",   description: "Complete your first full painting." },
    { label: "Month Goal",   timeframe: "Month 1",  description: "Finish 4 paintings." },
    { label: "3-Month Goal", timeframe: "3 Months", description: "Paint from a photo reference." },
  ],
  resources: {
    videos:      [{ title: "...", url: "#", duration: "10 min", level: "beginner", source: "YouTube" }],
    articles:    [{ title: "...", url: "#", duration: "5 min read", level: "beginner", source: "Blog" }],
    communities: [{ title: "...", url: "#", members: "12k", platform: "Reddit" }],
  },
  matchScore: null, // computed at runtime by recommendation engine
}
```

### 8.2 Minimum Hobby Catalog (V1)

Provide at least **12 hobbies** covering a variety of categories:

| # | Hobby | Category | Environment | Social |
|---|---|---|---|---|
| 1 | Watercolour Painting | Art | Indoor | Solo |
| 2 | Sketching / Drawing | Art | Indoor | Solo |
| 3 | Acoustic Guitar | Music | Indoor | Either |
| 4 | Running | Fitness | Outdoor | Either |
| 5 | Yoga | Fitness | Indoor | Solo |
| 6 | Hiking | Outdoor | Outdoor | Either |
| 7 | Photography | Creative | Both | Solo |
| 8 | Knitting / Crochet | Craft | Indoor | Solo |
| 9 | Cooking (New cuisines) | Craft | Indoor | Social |
| 10 | Bouldering / Climbing | Fitness | Indoor | Social |
| 11 | Chess | Strategy | Indoor | Social |
| 12 | Journaling | Wellbeing | Indoor | Solo |

### 8.3 Achievement Definitions

```js
const ACHIEVEMENTS = [
  { id: "day-one",      name: "Day One",       icon: "🌱", description: "Completed your very first task.",  coinThreshold: null, streakThreshold: null, daysThreshold: 1  },
  { id: "week-warrior", name: "Week Warrior",   icon: "🏆", description: "Completed 7 days in a row.",       streakThreshold: 7  },
  { id: "first-win",    name: "First Win",      icon: "⭐", description: "Hit your Week 1 milestone.",       milestoneId: "week-1" },
  { id: "coin-100",     name: "Coin Collector", icon: "💰", description: "Earned 100 coins.",                coinThreshold: 100  },
  { id: "streak-14",    name: "Fortnight",      icon: "🔥", description: "14-day streak.",                   streakThreshold: 14 },
  { id: "planner",      name: "Planner",        icon: "📋", description: "Started a formal plan.",           trigger: "plan-started" },
  { id: "explorer",     name: "Explorer",       icon: "🔍", description: "Saved 3 different hobbies.",       savedThreshold: 3   },
  { id: "consistent",   name: "Consistent",     icon: "📅", description: "Active for 30 total days.",        daysThreshold: 30   },
]
```

### 8.4 localStorage Keys

| Key | Type | Description |
|---|---|---|
| `hobbyUserProfile` | Object | Onboarding answers |
| `savedHobbies` | Array of IDs | Heart-saved hobby IDs |
| `activeHobby` | ID string | Currently active hobby |
| `hobbyProgress` | Object `{ hobbyId: { completedDays: [], notes: {} } }` | Plan progress per hobby |
| `coins` | Number | Total coins earned |
| `streak` | Object `{ current, best, lastActiveDate }` | Streak data |
| `unlockedAchievements` | Array of IDs | Earned achievement IDs |
| `avatarHistory` | Array | Chat message history |

---

## 9. Recommendation Ranking Engine (Client-Side JS)

A pure JavaScript function in `engine.js` scores each hobby against the user profile stored in localStorage.

```js
function scoreHobby(hobby, profile) {
  let score = 0;

  // Hard filters — score stays 0 if constraint violated
  if (profile.budget === 'free'     && hobby.starterCost.min > 0)   return 0;
  if (profile.budget === '<$50'     && hobby.starterCost.min > 50)   return 0;
  if (profile.time   === '<2hrs'    && hobby.timePerWeek.min >= 5)   return 0;
  if (profile.env    !== 'both'     && hobby.environment !== 'both' && hobby.environment !== profile.env) return 0;
  if (profile.social !== 'either'   && hobby.social !== 'either'    && hobby.social !== profile.social)   return 0;

  // Soft scores — weighted sum
  if (hobby.difficulty === 'beginner')                               score += 20;
  if (hobby.tags.some(t => profile.goals.includes(t)))              score += 30;
  if (hobby.environment === profile.env)                             score += 10;
  if (hobby.social      === profile.social)                         score += 10;
  if (hobby.spaceNeeded === profile.space)                          score += 10;
  if (hobby.starterCost.min === 0)                                  score += 10;

  return score;
}

function rankHobbies(hobbies, profile) {
  return hobbies
    .map(h => ({ ...h, matchScore: scoreHobby(h, profile) }))
    .filter(h => h.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}
```

"Why this fits you" label is generated by inspecting which soft-score conditions were met and returning the highest-scoring matched reason as a one-line string.

---

## 10. Coin & Reward System

| Action | Coins Awarded |
|---|---|
| Complete today's task | 30 |
| Maintain a 7-day streak | 50 bonus |
| Hit Week 1 milestone | 100 |
| Save a hobby | 5 |
| Complete onboarding | 20 |
| Write a task note | 10 |

Coins accumulate in localStorage. Redemption deducts from balance in localStorage and shows a confirmation modal. No real payment or backend involved in V1 — redemption is UI-only ("Your code will be emailed shortly" placeholder text).

---

## 11. Avatar Scripted Response Engine (`avatar-engine.js`)

```js
const FLOWS = {
  greeting:     { triggers: [],                    response: (profile, plan) => `Hey ${profile.name || 'there'}! How's your ${plan.hobbyName} going today?`, chips: ['Show my plan', 'I completed today', 'I need help'] },
  nextStep:     { triggers: ['next', 'do', 'step'], response: (p, plan)       => `Today's task: "${plan.todayTask.title}". It takes about ${plan.todayTask.estimatedTime}.`, chips: ['Mark complete', 'Tell me more', 'Too hard?'] },
  stuck:        { triggers: ['stuck', 'confused', 'unsure', 'lost'], response: (p, plan) => `That's totally normal. The most common issue at your stage is: ${plan.hobby.commonPitfalls[0].fix}`, chips: ['Thanks!', 'Still stuck', 'Skip today'] },
  motivation:   { triggers: ['quit', 'give up', 'hard', 'motivation'], response: (p, plan) => `You're on a ${plan.streak}-day streak — that's real progress. Your first milestone is "${plan.hobby.milestones[0].label}" and you're almost there.`, chips: ['Show milestone', 'I need easier version'] },
  fallback:     { triggers: [],                    response: () => `I'm not sure I got that. Here are things I can help with:`, chips: ['Show my plan', 'Next step', 'I completed today', 'I need help'] },
};

function getAvatarResponse(userInput, profile, plan) {
  const input = userInput.toLowerCase();
  for (const [key, flow] of Object.entries(FLOWS)) {
    if (flow.triggers.some(t => input.includes(t))) {
      return { text: flow.response(profile, plan), chips: flow.chips };
    }
  }
  return { text: FLOWS.fallback.response(), chips: FLOWS.fallback.chips };
}
```

---

## 12. Accessibility Requirements

- All interactive elements reachable by keyboard (`Tab`, `Enter`, `Space`).
- ARIA labels on icon-only buttons (hamburger, heart save, send).
- Colour contrast ratio ≥ 4.5:1 for all body text.
- Focus ring visible on all focusable elements (Tailwind `focus:ring-2`).
- `alt` text on all images and illustrations.
- Form inputs have associated `<label>` elements.

---

## 13. File Structure

```
/hobby/
├── index.html
├── onboarding.html
├── discovery.html
├── hobby-detail.html
├── my-plan.html
├── progress.html
├── avatar.html
├── about.html
├── data.js          ← hardcoded hobby catalog + achievement definitions
├── engine.js        ← ranking + recommendation logic
├── avatar-engine.js ← scripted avatar response logic
├── utils.js         ← localStorage helpers, toast, coin logic
└── assets/
    ├── logo.svg
    └── illustrations/   ← hobby icon SVGs or PNG placeholders
```

---

## 14. V1 Delivery Checklist

- [ ] All 8 pages render correctly at 375 px and 1440 px
- [ ] Onboarding wizard: all 8 steps navigate, validation works, data saved to localStorage
- [ ] Discovery: filters reactively narrow results; skeleton loader shown; empty state handled
- [ ] Hobby Detail: accordion, tabs, and "Start This Hobby" function correctly
- [ ] My Plan: task completion marks day, awards coins, updates streak
- [ ] Progress: chart renders, achievements unlock, redeem modal works
- [ ] Avatar: keyword matching returns correct scripted responses; quick replies work
- [ ] Nav coin counter updates reactively across pages
- [ ] Hamburger menu functional on mobile
- [ ] No console errors on any page

---

## 15. Out of Scope for V1

The following features from the thesis are deferred to Phase 2 / Phase 3:

- Backend API or database
- User authentication
- Real push notifications
- AI-augmented avatar (LLM API)
- Multi-hobby concurrent plans
- Partner integrations / actual reward redemption
- Voice or video guidance
- Community features
