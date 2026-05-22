/**
 * Property-based tests for utils.js — Achievement Checking
 *
 * Feature: starthobby-v1
 * Property 10: Achievement unlock threshold
 *
 * If user state meets threshold, achievement ID appears in unlocked list.
 *
 * **Validates: Requirements 6.5**
 */

import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Create a proper localStorage mock with standard Web Storage API
function createLocalStorageMock() {
  let store = {};
  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    setItem(key, value) {
      store[key] = String(value);
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key(index) {
      return Object.keys(store)[index] || null;
    }
  };
}

// Set up the mock localStorage on globalThis before evaluating source files
const mockStorage = createLocalStorageMock();
globalThis.localStorage = mockStorage;

// Provide a minimal window.dispatchEvent for showToast
if (!globalThis.window) {
  globalThis.window = globalThis;
}
if (!globalThis.window.dispatchEvent) {
  globalThis.window.dispatchEvent = () => {};
}
if (!globalThis.CustomEvent) {
  globalThis.CustomEvent = class CustomEvent {
    constructor(type, options) {
      this.type = type;
      this.detail = options ? options.detail : null;
    }
  };
}

// Load data.js to get ACHIEVEMENTS constant
const dataCode = readFileSync(resolve(__dirname, '..', 'data.js'), 'utf-8');
const dataModule = new Function(dataCode + '\nreturn { ACHIEVEMENTS, HOBBIES };');
const { ACHIEVEMENTS, HOBBIES } = dataModule();

// Make ACHIEVEMENTS available globally for checkAchievements()
globalThis.ACHIEVEMENTS = ACHIEVEMENTS;
globalThis.HOBBIES = HOBBIES;

// Load utils.js to get checkAchievements and helpers
const utilsCode = readFileSync(resolve(__dirname, '..', 'utils.js'), 'utf-8');
const utilsModule = new Function(utilsCode + '\nreturn { checkAchievements, getFromStorage, saveToStorage };');
const { checkAchievements, getFromStorage, saveToStorage } = utilsModule();

describe('Feature: starthobby-v1, Property 10: Achievement unlock threshold', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  it('if user state meets daysThreshold, achievement ID appears in unlocked list', () => {
    // Filter achievements that have a daysThreshold
    const daysAchievements = ACHIEVEMENTS.filter(a => a.daysThreshold != null);

    fc.assert(
      fc.property(
        fc.constantFrom(...daysAchievements),
        fc.integer({ min: 0, max: 50 }),
        (achievement, extraDays) => {
          mockStorage.clear();

          // Generate a totalDays value that meets or exceeds the threshold
          const totalDays = achievement.daysThreshold + extraDays;

          // Set up localStorage state: hobbyProgress with enough completed days
          const hobbyId = 'test-hobby';
          const completedDays = Array.from({ length: totalDays }, (_, i) => i + 1);
          const progress = {
            [hobbyId]: {
              completedDays: completedDays,
              skippedDays: [],
              notes: {},
              startDate: '2026-01-01',
              weekNumber: 1
            }
          };
          mockStorage.setItem('hobbyProgress', JSON.stringify(progress));
          mockStorage.setItem('unlockedAchievements', JSON.stringify([]));
          mockStorage.setItem('coins', JSON.stringify(0));
          mockStorage.setItem('streak', JSON.stringify({ current: 0, best: 0, lastActiveDate: null }));
          mockStorage.setItem('savedHobbies', JSON.stringify([]));
          mockStorage.setItem('activeHobby', JSON.stringify(null));

          // Call checkAchievements
          const newlyUnlocked = checkAchievements();

          // The achievement ID should appear in the newly unlocked list
          expect(newlyUnlocked).toContain(achievement.id);

          // Also verify it was persisted to localStorage
          const persisted = JSON.parse(mockStorage.getItem('unlockedAchievements'));
          expect(persisted).toContain(achievement.id);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('if user state meets streakThreshold, achievement ID appears in unlocked list', () => {
    // Filter achievements that have a streakThreshold
    const streakAchievements = ACHIEVEMENTS.filter(a => a.streakThreshold != null);

    fc.assert(
      fc.property(
        fc.constantFrom(...streakAchievements),
        fc.integer({ min: 0, max: 50 }),
        (achievement, extraStreak) => {
          mockStorage.clear();

          // Generate a streak value that meets or exceeds the threshold
          const currentStreak = achievement.streakThreshold + extraStreak;

          // Set up localStorage state
          mockStorage.setItem('streak', JSON.stringify({
            current: currentStreak,
            best: currentStreak,
            lastActiveDate: '2026-05-20'
          }));
          mockStorage.setItem('unlockedAchievements', JSON.stringify([]));
          mockStorage.setItem('coins', JSON.stringify(0));
          mockStorage.setItem('hobbyProgress', JSON.stringify({}));
          mockStorage.setItem('savedHobbies', JSON.stringify([]));
          mockStorage.setItem('activeHobby', JSON.stringify(null));

          // Call checkAchievements
          const newlyUnlocked = checkAchievements();

          // The achievement ID should appear in the newly unlocked list
          expect(newlyUnlocked).toContain(achievement.id);

          // Also verify it was persisted
          const persisted = JSON.parse(mockStorage.getItem('unlockedAchievements'));
          expect(persisted).toContain(achievement.id);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('if user state meets coinThreshold, achievement ID appears in unlocked list', () => {
    // Filter achievements that have a coinThreshold
    const coinAchievements = ACHIEVEMENTS.filter(a => a.coinThreshold != null);

    fc.assert(
      fc.property(
        fc.constantFrom(...coinAchievements),
        fc.integer({ min: 0, max: 1000 }),
        (achievement, extraCoins) => {
          mockStorage.clear();

          // Generate a coin balance that meets or exceeds the threshold
          const coins = achievement.coinThreshold + extraCoins;

          // Set up localStorage state
          mockStorage.setItem('coins', JSON.stringify(coins));
          mockStorage.setItem('unlockedAchievements', JSON.stringify([]));
          mockStorage.setItem('streak', JSON.stringify({ current: 0, best: 0, lastActiveDate: null }));
          mockStorage.setItem('hobbyProgress', JSON.stringify({}));
          mockStorage.setItem('savedHobbies', JSON.stringify([]));
          mockStorage.setItem('activeHobby', JSON.stringify(null));

          // Call checkAchievements
          const newlyUnlocked = checkAchievements();

          // The achievement ID should appear in the newly unlocked list
          expect(newlyUnlocked).toContain(achievement.id);

          // Also verify it was persisted
          const persisted = JSON.parse(mockStorage.getItem('unlockedAchievements'));
          expect(persisted).toContain(achievement.id);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('if user state meets savedThreshold, achievement ID appears in unlocked list', () => {
    // Filter achievements that have a savedThreshold
    const savedAchievements = ACHIEVEMENTS.filter(a => a.savedThreshold != null);

    fc.assert(
      fc.property(
        fc.constantFrom(...savedAchievements),
        fc.integer({ min: 0, max: 10 }),
        (achievement, extraSaved) => {
          mockStorage.clear();

          // Generate a savedHobbies array that meets or exceeds the threshold
          const savedCount = achievement.savedThreshold + extraSaved;
          const savedHobbies = Array.from({ length: savedCount }, (_, i) => `hobby-${i}`);

          // Set up localStorage state
          mockStorage.setItem('savedHobbies', JSON.stringify(savedHobbies));
          mockStorage.setItem('unlockedAchievements', JSON.stringify([]));
          mockStorage.setItem('coins', JSON.stringify(0));
          mockStorage.setItem('streak', JSON.stringify({ current: 0, best: 0, lastActiveDate: null }));
          mockStorage.setItem('hobbyProgress', JSON.stringify({}));
          mockStorage.setItem('activeHobby', JSON.stringify(null));

          // Call checkAchievements
          const newlyUnlocked = checkAchievements();

          // The achievement ID should appear in the newly unlocked list
          expect(newlyUnlocked).toContain(achievement.id);

          // Also verify it was persisted
          const persisted = JSON.parse(mockStorage.getItem('unlockedAchievements'));
          expect(persisted).toContain(achievement.id);
        }
      ),
      { numRuns: 100 }
    );
  });
});
