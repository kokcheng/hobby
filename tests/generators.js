import fc from 'fast-check';

/**
 * Shared generators for property-based tests.
 * These produce valid hobby and profile objects matching the data models.
 */

const CATEGORIES = ['Art', 'Music', 'Fitness', 'Outdoor', 'Creative', 'Craft', 'Strategy', 'Wellbeing'];
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];
const ENVIRONMENTS = ['indoor', 'outdoor', 'both'];
const SOCIAL_TYPES = ['solo', 'social', 'either'];
const SPACE_TYPES = ['small', 'room', 'yard', 'outside'];
const TIME_OPTIONS = ['<2hrs', '2-5hrs', '5-10hrs', '10+hrs'];
const BUDGET_OPTIONS = ['free', '<$50', '$50-$150', '$150+'];
const USER_SOCIAL_OPTIONS = ['solo', 'with-others', 'either'];
const GOALS = ['relax', 'creative', 'fit', 'meet-people', 'build-skill', 'fun'];
const LEARNING_STYLES = ['videos', 'guides', 'tasks', 'try-first'];

/**
 * Generates a valid hobby object with random attributes.
 */
export function arbitraryHobby() {
  return fc.record({
    id: fc.string({ minLength: 1, maxLength: 30 }).map(s => s.replace(/\s/g, '-').toLowerCase() || 'hobby'),
    name: fc.string({ minLength: 1, maxLength: 50 }).map(s => s || 'Hobby'),
    category: fc.constantFrom(...CATEGORIES),
    tags: fc.array(fc.constantFrom(...GOALS), { minLength: 0, maxLength: 4 }),
    difficulty: fc.constantFrom(...DIFFICULTIES),
    timePerWeek: fc.record({
      min: fc.integer({ min: 1, max: 20 }),
      max: fc.integer({ min: 1, max: 40 })
    }).map(({ min, max }) => ({ min, max: Math.max(min, max) })),
    starterCost: fc.record({
      min: fc.integer({ min: 0, max: 500 }),
      max: fc.integer({ min: 0, max: 1000 })
    }).map(({ min, max }) => ({ min, max: Math.max(min, max) })),
    environment: fc.constantFrom(...ENVIRONMENTS),
    social: fc.constantFrom(...SOCIAL_TYPES),
    spaceNeeded: fc.constantFrom(...SPACE_TYPES),
    timeToFirstWin: fc.constant('1 week'),
    description: fc.constant('A test hobby description.'),
    equipment: fc.constant([]),
    safetyNotes: fc.constant([]),
    commonPitfalls: fc.constant([]),
    weekOnePlan: fc.constant([]),
    milestones: fc.constant([]),
    resources: fc.constant({ videos: [], articles: [], communities: [] })
  });
}

/**
 * Generates a valid user profile with random preferences.
 */
export function arbitraryProfile() {
  return fc.record({
    time: fc.constantFrom(...TIME_OPTIONS),
    budget: fc.constantFrom(...BUDGET_OPTIONS),
    env: fc.constantFrom(...ENVIRONMENTS),
    social: fc.constantFrom(...USER_SOCIAL_OPTIONS),
    space: fc.constantFrom(...SPACE_TYPES),
    learning: fc.array(fc.constantFrom(...LEARNING_STYLES), { minLength: 1, maxLength: 4 }),
    goals: fc.array(fc.constantFrom(...GOALS), { minLength: 0, maxLength: 6 }),
    name: fc.string({ minLength: 0, maxLength: 20 })
  });
}

/**
 * Generates a non-negative coin balance.
 */
export function arbitraryCoinBalance() {
  return fc.integer({ min: 0, max: 10000 });
}

/**
 * Generates a reward object with a random coin cost.
 */
export function arbitraryReward() {
  return fc.record({
    id: fc.string({ minLength: 1, maxLength: 20 }).map(s => s || 'reward'),
    name: fc.string({ minLength: 1, maxLength: 30 }).map(s => s || 'Reward'),
    description: fc.constant('A test reward.'),
    coinCost: fc.integer({ min: 1, max: 5000 }),
    icon: fc.constant('🎁')
  });
}

/**
 * Generates a chat message object.
 */
export function arbitraryChatMessage() {
  return fc.record({
    role: fc.constantFrom('user', 'avatar'),
    text: fc.string({ minLength: 1, maxLength: 200 }).map(s => s || 'Hello'),
    timestamp: fc.integer({ min: 1600000000000, max: 1800000000000 })
  });
}

/**
 * Generates a week state with random completed/skipped days.
 */
export function arbitraryWeekState() {
  return fc.record({
    completedDays: fc.subarray([1, 2, 3, 4, 5, 6, 7]),
    skippedDays: fc.subarray([1, 2, 3, 4, 5, 6, 7]),
    notes: fc.constant({}),
    startDate: fc.constant('2026-01-01'),
    weekNumber: fc.integer({ min: 1, max: 4 })
  });
}

// Re-export constants for use in tests
export {
  CATEGORIES,
  DIFFICULTIES,
  ENVIRONMENTS,
  SOCIAL_TYPES,
  SPACE_TYPES,
  TIME_OPTIONS,
  BUDGET_OPTIONS,
  USER_SOCIAL_OPTIONS,
  GOALS,
  LEARNING_STYLES
};
