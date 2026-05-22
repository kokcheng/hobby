# Requirements Document

## Introduction

StartHobby V1 is a multi-page responsive web application for guided hobby discovery and onboarding. The application helps users find hobbies that fit their lifestyle through a preference wizard, provides personalized recommendations, and guides users through structured beginner plans with progress tracking and a scripted coaching avatar. All data is hardcoded or stored in localStorage — no backend is required.

## Glossary

- **Application**: The StartHobby V1 multi-page HTML web application
- **Onboarding_Wizard**: The multi-step preference capture form on onboarding.html
- **Recommendation_Engine**: The client-side JavaScript scoring function that ranks hobbies against user preferences
- **Avatar_Engine**: The scripted keyword-matching response system powering the coaching chat interface
- **Hobby_Catalog**: The hardcoded collection of at least 12 hobby objects stored in data.js
- **User_Profile**: The object containing onboarding answers stored in localStorage under key `hobbyUserProfile`
- **Active_Hobby**: The hobby the user has committed to and is following a plan for
- **Coin_System**: The virtual reward mechanism that awards coins for completing actions
- **Streak**: A count of consecutive days the user has completed tasks without missing more than one day per week
- **Achievement**: A badge unlocked when the user meets specific thresholds (days, streaks, coins, milestones)
- **Navigation_Bar**: The persistent top navigation component present on all pages
- **Toast**: A floating notification that auto-dismisses after 3 seconds
- **Filter_Panel**: The sidebar (desktop) or drawer (mobile) on the Discovery page for narrowing hobby results
- **Plan_View**: The daily/weekly task interface on my-plan.html showing the active hobby's schedule

## Requirements

### Requirement 1: Landing Page

**User Story:** As a first-time visitor, I want to understand what StartHobby offers and begin onboarding, so that I can start discovering hobbies that fit my life.

#### Acceptance Criteria

1. WHEN a visitor loads index.html, THE Application SHALL display a hero section with the headline "Find a hobby that actually fits your life.", a sub-headline, and a primary CTA button linking to onboarding.html
2. THE Application SHALL display a "How It Works" section with three steps: "Tell us about yourself", "Get matched hobbies", and "Follow your personalised plan"
3. THE Application SHALL display a horizontally scrollable row of 6 featured hobby cards, each showing hobby name, difficulty badge, and cost range
4. WHEN a user clicks a featured hobby card, THE Application SHALL navigate to hobby-detail.html with the hobby ID in the query string
5. THE Application SHALL display 3 hardcoded testimonial cards with avatar initials, name, and hobby
6. WHEN a user clicks the primary CTA button, THE Application SHALL show a loading state for 0.5 seconds then navigate to onboarding.html
7. THE Application SHALL display a footer section with a repeated CTA and links to Discover and About pages

### Requirement 2: Onboarding Wizard

**User Story:** As a new user, I want to provide my preferences and constraints through a guided wizard, so that the system can recommend hobbies tailored to my situation.

#### Acceptance Criteria

1. WHEN a user loads onboarding.html, THE Onboarding_Wizard SHALL display step 1 of 8 with a progress bar showing completion percentage
2. THE Onboarding_Wizard SHALL present the following steps in order: weekly time available (step 1), budget range (step 2), environment preference (step 3), social preference (step 4), space available (step 5), learning style (step 6), goals (step 7), and name (step 8)
3. WHILE a required step (steps 1–7) has no selection made, THE Onboarding_Wizard SHALL disable the "Next" button
4. WHEN a user clicks "Next" after making a selection, THE Onboarding_Wizard SHALL animate a slide-in transition and display the next step
5. WHEN a user clicks "Back" from step 2 or later, THE Onboarding_Wizard SHALL return to the previous step preserving all prior selections
6. THE Onboarding_Wizard SHALL update the progress bar width smoothly using CSS transitions as the user advances through steps
7. WHEN the user completes step 8, THE Onboarding_Wizard SHALL save all answers to localStorage under the key `hobbyUserProfile` and navigate to discovery.html
8. THE Onboarding_Wizard SHALL award 20 coins upon completion and store the updated coin total in localStorage

### Requirement 3: Hobby Discovery and Filtering

**User Story:** As a user who has completed onboarding, I want to see ranked hobby recommendations with filtering options, so that I can find the best hobby match for my lifestyle.

#### Acceptance Criteria

1. WHEN a user loads discovery.html, THE Application SHALL display a skeleton loader for 600 milliseconds before showing results
2. THE Recommendation_Engine SHALL score each hobby in the Hobby_Catalog against the User_Profile and return only hobbies with a score greater than zero, sorted by descending score
3. WHEN a hard filter constraint is violated (budget exceeds hobby cost, time insufficient, environment mismatch, or social mismatch), THE Recommendation_Engine SHALL assign a score of zero to that hobby
4. THE Application SHALL display a Filter_Panel with controls for: category (checkbox group), difficulty (range slider), cost (range slider), time per week (checkbox), indoor/outdoor (radio), and solo/social (radio)
5. WHEN any filter value changes, THE Application SHALL instantly re-render the results list without a page reload
6. THE Application SHALL display each hobby result as a card containing: hobby name, category tag, difficulty badge, cost range, time range, a "Why this fits you" tooltip, a "View Plan" CTA, and a "Save" heart icon
7. WHEN a user clicks the heart icon on a hobby card, THE Application SHALL toggle the saved state in localStorage under `savedHobbies` and update the saved count badge in the navigation
8. THE Application SHALL provide sort controls with options: "Best match", "Easiest to start", "Lowest cost", and "A–Z"
9. WHEN no hobbies match the active filters, THE Application SHALL display an empty state with a friendly illustration and a suggestion to widen filters
10. WHEN a user clicks a hobby card, THE Application SHALL navigate to hobby-detail.html with the hobby ID in the query string

### Requirement 4: Hobby Detail Page

**User Story:** As a user interested in a specific hobby, I want to see comprehensive information about it, so that I can decide whether to commit and start a plan.

#### Acceptance Criteria

1. WHEN hobby-detail.html loads with a valid `?id=` query parameter, THE Application SHALL display the corresponding hobby's full information from the Hobby_Catalog
2. THE Application SHALL display a header with the hobby illustration, name, category, difficulty badge, and cost badge
3. THE Application SHALL display quick-stats showing: time to first win, weekly time commitment, starter cost, environment type, and social type
4. THE Application SHALL display an equipment list with required items, costs, and alternative options
5. WHEN the user's onboarding budget is lower than an equipment item's cost, THE Application SHALL visually indicate that item can be skipped with a strikethrough style
6. THE Application SHALL display a Week 1 plan preview as a visual checklist of up to 7 task items, each with a title and a "Why this matters" tooltip
7. THE Application SHALL display milestones as a horizontal timeline showing Week 1 win, Month 1 goal, and 3-month goal
8. THE Application SHALL display safety notes and common pitfalls in an accordion that expands and collapses on click
9. THE Application SHALL display curated resources in a tabbed interface with tabs for Videos, Articles, and Communities
10. WHEN a user clicks "Start This Hobby", THE Application SHALL save the hobby ID to localStorage as `activeHobby`, show a 1-second confirmation animation, and navigate to my-plan.html
11. WHEN a user clicks "Save for Later", THE Application SHALL add the hobby ID to the `savedHobbies` array in localStorage

### Requirement 5: My Plan Daily Action Centre

**User Story:** As a user with an active hobby, I want to see my daily tasks and track completion, so that I can follow my beginner plan consistently.

#### Acceptance Criteria

1. WHEN my-plan.html loads with an active hobby set in localStorage, THE Plan_View SHALL display the hobby name, illustration, current streak counter, and coins earned today
2. THE Plan_View SHALL display a 7-day horizontal strip where each day shows a day label, task icon, and completion status (green for done, grey for pending, red for missed)
3. WHEN a user clicks a day in the week strip, THE Plan_View SHALL display that day's task detail including title, description, resource link, and estimated time badge
4. WHEN a user clicks "Mark Complete", THE Application SHALL mark the day as green, award 30 coins, increment the streak, and persist all changes to localStorage
5. WHEN a user marks a task complete, THE Application SHALL display a coin animation where the number flies to the coin counter
6. WHEN a user clicks "Skip today", THE Application SHALL mark the day as skipped without breaking the streak if the user has skipped one or fewer days that week
7. IF a user has already skipped more than one day in the current week and clicks "Skip today", THEN THE Application SHALL mark the day as missed and reset the streak
8. THE Plan_View SHALL display a weekly progress bar showing X of 7 days completed this week
9. WHEN a user expands the "Log a note" area and saves text, THE Application SHALL persist the note to localStorage under the task's entry in `hobbyProgress`
10. WHEN a 7-day streak is achieved, THE Coin_System SHALL award a 50-coin bonus

### Requirement 6: Progress Tracking

**User Story:** As an active user, I want to see my milestones, streaks, achievements, and coin balance, so that I can feel motivated by my progress.

#### Acceptance Criteria

1. THE Application SHALL display a summary stats row with four cards: total days active, current streak and best streak, total coins earned, and milestones hit
2. THE Application SHALL display a vertical milestone timeline where completed milestones are filled with brand colour and future milestones are grey with a "Locked" label
3. THE Application SHALL render a Chart.js bar chart showing days completed per week for the last 4 weeks
4. THE Application SHALL display an achievements grid with at least 8 badge cards, each showing icon, name, description, and either the date earned or a "Locked" state
5. WHEN an achievement's threshold condition is met (days, streak, coins, milestones, or saved hobbies), THE Application SHALL unlock the achievement, add it to `unlockedAchievements` in localStorage, and display an unlock animation
6. THE Application SHALL display the current coin balance and hardcoded reward redemption options with required coin amounts
7. WHEN a user clicks "Redeem" on a reward and has sufficient coins, THE Application SHALL show a confirmation modal, deduct coins from the balance, and display a success toast
8. IF a user clicks "Redeem" on a reward and has insufficient coins, THEN THE Application SHALL display a "not enough coins" toast without deducting any coins

### Requirement 7: Avatar Coaching Interface

**User Story:** As a user following a hobby plan, I want to interact with a scripted coaching avatar, so that I can get guidance, motivation, and quick answers without leaving the app.

#### Acceptance Criteria

1. WHEN avatar.html loads, THE Avatar_Engine SHALL display a greeting message using the user's name (if available) and ask how their hobby is going
2. THE Application SHALL display a chat interface with user messages on the right, avatar messages on the left, and an input bar with a text field and "Send" button at the bottom
3. WHEN a user sends a message, THE Application SHALL append the user's bubble immediately, show a 1-second typing indicator, then display the avatar's response
4. THE Avatar_Engine SHALL match user input against keyword triggers and return the corresponding scripted response with contextual quick-reply chips
5. WHEN user input contains keywords "next", "do", or "step", THE Avatar_Engine SHALL return today's task title and estimated time from the active plan
6. WHEN user input contains keywords "stuck", "confused", "unsure", or "lost", THE Avatar_Engine SHALL return the first common pitfall fix for the active hobby
7. WHEN user input contains keywords "quit", "give up", "hard", or "motivation", THE Avatar_Engine SHALL return an encouraging message including the current streak count
8. WHEN user input does not match any keyword triggers, THE Avatar_Engine SHALL return a fallback message with available quick-reply options
9. WHEN a user clicks the "I completed today" quick reply, THE Application SHALL mark today's task as complete, award coins, and display a celebration message
10. THE Application SHALL persist chat history to localStorage under `avatarHistory` and restore it on page reload
11. THE Application SHALL auto-scroll the chat thread to the latest message after each new message is added

### Requirement 8: Navigation and Shared Components

**User Story:** As a user navigating the application, I want consistent navigation and feedback components across all pages, so that I can move between sections easily and receive timely notifications.

#### Acceptance Criteria

1. THE Navigation_Bar SHALL display on all pages with: logo on the left, navigation links in the centre, and a "Start Now" CTA button with a coin counter on the right
2. WHEN the viewport width is below 768px, THE Navigation_Bar SHALL collapse navigation links into a hamburger menu that opens a full-width slide-down menu on click
3. THE Navigation_Bar SHALL highlight the active page link with brand colour and underline styling
4. THE Navigation_Bar SHALL read the coin count from localStorage and update it reactively when coins change
5. WHEN an action triggers a toast notification (task completed, coins earned, achievement unlocked, save action), THE Application SHALL display a floating toast in the top-right corner that auto-dismisses after 3 seconds
6. THE Application SHALL support toast types: success (green), info (blue), and warning (amber)
7. WHEN a page simulates data loading (Discovery, My Plan), THE Application SHALL display CSS-animated skeleton placeholder cards for 600 milliseconds

### Requirement 9: Recommendation Engine Scoring

**User Story:** As a user who has completed onboarding, I want the system to accurately score and rank hobbies based on my preferences, so that I see the most relevant hobbies first.

#### Acceptance Criteria

1. THE Recommendation_Engine SHALL assign a score of zero to any hobby where the user selected "Free" budget and the hobby's minimum starter cost is greater than zero
2. THE Recommendation_Engine SHALL assign a score of zero to any hobby where the user selected "<$50" budget and the hobby's minimum starter cost exceeds $50
3. THE Recommendation_Engine SHALL assign a score of zero to any hobby where the user selected "<2hrs" time and the hobby's minimum time per week is 5 or more hours
4. THE Recommendation_Engine SHALL assign a score of zero to any hobby whose environment does not match the user's preference (unless either is "both")
5. THE Recommendation_Engine SHALL assign a score of zero to any hobby whose social type does not match the user's preference (unless either is "either")
6. THE Recommendation_Engine SHALL add 20 points for beginner difficulty hobbies
7. THE Recommendation_Engine SHALL add 30 points when any hobby tag matches any of the user's selected goals
8. THE Recommendation_Engine SHALL add 10 points each for exact environment match, exact social match, exact space match, and zero starter cost
9. THE Recommendation_Engine SHALL return hobbies sorted by descending score with all zero-score hobbies excluded

### Requirement 10: Coin and Reward System

**User Story:** As an active user, I want to earn coins for completing actions and redeem them for rewards, so that I feel incentivized to maintain my hobby practice.

#### Acceptance Criteria

1. WHEN a user completes today's task, THE Coin_System SHALL award 30 coins
2. WHEN a user achieves a 7-day streak, THE Coin_System SHALL award a 50-coin bonus
3. WHEN a user hits the Week 1 milestone, THE Coin_System SHALL award 100 coins
4. WHEN a user saves a hobby, THE Coin_System SHALL award 5 coins
5. WHEN a user completes onboarding, THE Coin_System SHALL award 20 coins
6. WHEN a user writes a task note, THE Coin_System SHALL award 10 coins
7. THE Coin_System SHALL persist the total coin balance in localStorage under the key `coins`
8. WHEN a user redeems a reward, THE Coin_System SHALL deduct the reward's coin cost from the balance and persist the updated total

### Requirement 11: Responsive Design

**User Story:** As a user on any device, I want the application to be fully usable from 375px mobile to 1440px desktop, so that I can access StartHobby regardless of my screen size.

#### Acceptance Criteria

1. THE Application SHALL render all pages correctly at viewport widths of 375px (mobile) and 1440px (desktop)
2. WHILE the viewport width is below 768px, THE Application SHALL display single-column layouts with stacked content
3. WHILE the viewport width is 1024px or above, THE Application SHALL display multi-column layouts with side panels where specified
4. THE Application SHALL cap maximum content width at 1280px on viewports wider than 1280px
5. WHILE the viewport width is below 768px on the Discovery page, THE Filter_Panel SHALL display as a collapsible drawer that slides up from the bottom

### Requirement 12: Accessibility

**User Story:** As a user with accessibility needs, I want the application to be keyboard navigable and screen-reader friendly, so that I can use all features without barriers.

#### Acceptance Criteria

1. THE Application SHALL make all interactive elements reachable by keyboard using Tab, Enter, and Space keys
2. THE Application SHALL provide ARIA labels on all icon-only buttons including hamburger menu, heart save, and send buttons
3. THE Application SHALL maintain a colour contrast ratio of at least 4.5:1 for all body text against its background
4. THE Application SHALL display a visible focus ring on all focusable elements
5. THE Application SHALL provide alt text on all images and illustrations
6. THE Application SHALL associate all form inputs with corresponding label elements

### Requirement 13: Data Persistence and State Management

**User Story:** As a returning user, I want my progress, preferences, and history to be preserved between sessions, so that I can continue where I left off.

#### Acceptance Criteria

1. THE Application SHALL store all user state in localStorage using the defined keys: `hobbyUserProfile`, `savedHobbies`, `activeHobby`, `hobbyProgress`, `coins`, `streak`, `unlockedAchievements`, and `avatarHistory`
2. WHEN a page loads, THE Application SHALL read relevant state from localStorage and render the UI accordingly
3. WHEN any user action modifies state (completing tasks, earning coins, saving hobbies, updating streaks), THE Application SHALL immediately persist the change to localStorage
4. IF localStorage data is missing or corrupted on page load, THEN THE Application SHALL initialize default values without crashing

### Requirement 14: About Page

**User Story:** As a visitor, I want to learn about StartHobby's mission and roadmap, so that I can understand the platform's purpose and future direction.

#### Acceptance Criteria

1. THE Application SHALL display a mission statement section on about.html
2. THE Application SHALL display a "How It Works" three-step visual section consistent with the landing page
3. THE Application SHALL display a roadmap strip showing Phase 1 as active and Phases 2 and 3 as "Coming Soon"
4. THE Application SHALL display a team placeholder card section
