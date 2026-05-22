/**
 * Property-based tests for utils.js — State Management
 *
 * Feature: starthobby-v1
 * Property 7: Save toggle idempotence
 * Property 8: Streak skip logic
 * Property 9: Onboarding persistence round-trip
 *
 * **Validates: Requirements 3.7, 5.6, 5.7, 2.7, 13.3**
 */

import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { arbitraryProfile, arbitraryChatMessage } from './generators.js';

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

// Set up the mock localStorage on globalThis before evaluating utils.js
const mockStorage = createLocalStorageMock();
globalThis.localStorage = mockStorage;

// Provide a minimal window.dispatchEvent for showToast (called by toggleSavedHobby)
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

// utils.js uses global function declarations (no module exports).
// Evaluate it so toggleSavedHobby and related functions use our mock localStorage.
const utilsCode = readFileSync(resolve(__dirname, '..', 'utils.js'), 'utf-8');
const utilsModule = new Function(utilsCode + '\nreturn { toggleSavedHobby, getFromStorage, saveToStorage, addCoins, updateStreak, getStreak, getSkipsThisWeek };');
const { toggleSavedHobby, getFromStorage, saveToStorage, updateStreak, getStreak } = utilsModule();

/**
 * Generator for a hobby ID (non-empty string without whitespace).
 */
function arbitraryHobbyId() {
  return fc.string({ minLength: 1, maxLength: 30 })
    .map(s => s.replace(/\s/g, '-').toLowerCase() || 'hobby-id');
}

/**
 * Generator for an initial savedHobbies array (unique hobby IDs).
 */
function arbitrarySavedHobbies() {
  return fc.uniqueArray(arbitraryHobbyId(), { minLength: 0, maxLength: 20 });
}

describe('Feature: starthobby-v1, Property 7: Save toggle idempotence', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  it('toggling save twice returns savedHobbies to its original state', () => {
    fc.assert(
      fc.property(
        arbitrarySavedHobbies(),
        arbitraryHobbyId(),
        (initialSaved, hobbyId) => {
          // Set up localStorage with the initial savedHobbies state
          mockStorage.setItem('savedHobbies', JSON.stringify(initialSaved));
          // Reset coins to avoid side-effect accumulation affecting assertions
          mockStorage.setItem('coins', JSON.stringify(0));

          // Toggle once (add or remove)
          toggleSavedHobby(hobbyId);

          // Toggle again (reverse the first toggle)
          toggleSavedHobby(hobbyId);

          // Read the final savedHobbies state
          const finalSaved = JSON.parse(mockStorage.getItem('savedHobbies'));

          // The savedHobbies array should have the same elements as the original
          expect(finalSaved.length).toBe(initialSaved.length);
          expect(finalSaved.sort()).toEqual(initialSaved.sort());
        }
      ),
      { numRuns: 100 }
    );
  });
});


/**
 * Feature: starthobby-v1, Property 8: Streak skip logic
 *
 * Skip with ≤1 prior skips preserves streak; skip with ≥2 prior skips resets to 0.
 *
 * **Validates: Requirements 5.6, 5.7**
 */
describe('Feature: starthobby-v1, Property 8: Streak skip logic', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  /**
   * Generator for a number of prior skips this week (0 to 6).
   */
  function arbitrarySkipCount() {
    return fc.integer({ min: 0, max: 6 });
  }

  /**
   * Generator for a positive streak value.
   */
  function arbitraryStreakValue() {
    return fc.integer({ min: 1, max: 100 });
  }

  it('skip with ≤1 prior skips preserves the current streak', () => {
    fc.assert(
      fc.property(
        arbitraryStreakValue(),
        fc.integer({ min: 0, max: 1 }),
        (currentStreak, priorSkips) => {
          // Set up an active hobby
          const hobbyId = 'test-hobby';
          mockStorage.setItem('activeHobby', JSON.stringify(hobbyId));

          // Set up streak state with a positive current streak
          const streakState = {
            current: currentStreak,
            best: currentStreak,
            lastActiveDate: '2026-05-20'
          };
          mockStorage.setItem('streak', JSON.stringify(streakState));

          // Set up hobby progress with the specified number of prior skips
          const skippedDays = Array.from({ length: priorSkips }, (_, i) => i + 1);
          const progress = {
            [hobbyId]: {
              completedDays: [],
              skippedDays: skippedDays,
              notes: {},
              startDate: '2026-05-19',
              weekNumber: 1
            }
          };
          mockStorage.setItem('hobbyProgress', JSON.stringify(progress));

          // Call updateStreak(false) to simulate a skip
          const result = updateStreak(false);

          // With ≤1 prior skips, streak should be preserved
          expect(result.current).toBe(currentStreak);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('skip with ≥2 prior skips resets the current streak to 0', () => {
    fc.assert(
      fc.property(
        arbitraryStreakValue(),
        fc.integer({ min: 2, max: 6 }),
        (currentStreak, priorSkips) => {
          // Set up an active hobby
          const hobbyId = 'test-hobby';
          mockStorage.setItem('activeHobby', JSON.stringify(hobbyId));

          // Set up streak state with a positive current streak
          const streakState = {
            current: currentStreak,
            best: currentStreak,
            lastActiveDate: '2026-05-20'
          };
          mockStorage.setItem('streak', JSON.stringify(streakState));

          // Set up hobby progress with the specified number of prior skips (≥2)
          const skippedDays = Array.from({ length: priorSkips }, (_, i) => i + 1);
          const progress = {
            [hobbyId]: {
              completedDays: [],
              skippedDays: skippedDays,
              notes: {},
              startDate: '2026-05-19',
              weekNumber: 1
            }
          };
          mockStorage.setItem('hobbyProgress', JSON.stringify(progress));

          // Call updateStreak(false) to simulate a skip
          const result = updateStreak(false);

          // With ≥2 prior skips, streak should reset to 0
          expect(result.current).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});



/**
 * Feature: starthobby-v1, Property 9: Onboarding persistence round-trip
 *
 * Save then read of valid profile produces equivalent object.
 *
 * **Validates: Requirements 2.7, 13.3**
 */
describe('Feature: starthobby-v1, Property 9: Onboarding persistence round-trip', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  it('saving a valid profile to localStorage and reading it back produces an equivalent object', () => {
    fc.assert(
      fc.property(
        arbitraryProfile(),
        (profile) => {
          // Save the profile to localStorage under the onboarding key
          saveToStorage('hobbyUserProfile', profile);

          // Read it back using getFromStorage
          const retrieved = getFromStorage('hobbyUserProfile', null);

          // The retrieved profile should be deeply equal to the original
          expect(retrieved).toEqual(profile);
        }
      ),
      { numRuns: 100 }
    );
  });
});


/**
 * Feature: starthobby-v1, Property 11: localStorage corruption resilience
 *
 * For any localStorage key, if the stored value is missing, null, or contains
 * invalid JSON, then getFromStorage(key, defaultValue) SHALL return the specified
 * default value without throwing an exception.
 *
 * **Validates: Requirements 13.4**
 */
describe('Feature: starthobby-v1, Property 11: localStorage corruption resilience', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  /**
   * Generator for arbitrary invalid JSON strings that cannot be parsed.
   * Produces strings that are syntactically invalid JSON.
   */
  function arbitraryInvalidJson() {
    return fc.oneof(
      // Truncated JSON structures
      fc.constant('{'),
      fc.constant('{"key":'),
      fc.constant('[1, 2,'),
      fc.constant('"unterminated string'),
      // Invalid syntax
      fc.constant('{key: value}'),
      fc.constant("{'single': 'quotes'}"),
      fc.constant('undefined'),
      fc.constant('NaN'),
      fc.constant('Infinity'),
      // Random non-JSON strings
      fc.string({ minLength: 1, maxLength: 100 }).filter(s => {
        try { JSON.parse(s); return false; } catch { return true; }
      })
    );
  }

  /**
   * Generator for arbitrary default values of various types.
   */
  function arbitraryDefaultValue() {
    return fc.oneof(
      fc.constant(null),
      fc.constant(0),
      fc.constant(''),
      fc.constant([]),
      fc.constant({}),
      fc.integer(),
      fc.string(),
      fc.array(fc.integer()),
      fc.dictionary(fc.string({ minLength: 1, maxLength: 10 }), fc.integer())
    );
  }

  /**
   * Generator for localStorage key names.
   */
  function arbitraryStorageKey() {
    return fc.string({ minLength: 1, maxLength: 30 }).map(s => s.replace(/\s/g, '_') || 'key');
  }

  it('missing key (not in localStorage) returns default value without throwing', () => {
    fc.assert(
      fc.property(
        arbitraryStorageKey(),
        arbitraryDefaultValue(),
        (key, defaultValue) => {
          // Ensure the key does not exist in localStorage
          mockStorage.clear();

          // getFromStorage should return the default value
          const result = getFromStorage(key, defaultValue);
          expect(result).toEqual(defaultValue);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('invalid JSON in localStorage returns default value without throwing', () => {
    fc.assert(
      fc.property(
        arbitraryStorageKey(),
        arbitraryInvalidJson(),
        arbitraryDefaultValue(),
        (key, invalidJson, defaultValue) => {
          // Store invalid JSON directly in localStorage
          mockStorage.setItem(key, invalidJson);

          // getFromStorage should return the default value without throwing
          const result = getFromStorage(key, defaultValue);
          expect(result).toEqual(defaultValue);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('null stored as raw string returns default value without throwing', () => {
    fc.assert(
      fc.property(
        arbitraryStorageKey(),
        arbitraryDefaultValue(),
        (key, defaultValue) => {
          // Simulate a corrupted null-like value (the string "null" is valid JSON,
          // but a raw null from getItem means the key is missing)
          // Here we test that when localStorage.getItem returns null (key missing),
          // the function returns the default
          mockStorage.clear();
          // Key does not exist, so getItem returns null
          const result = getFromStorage(key, defaultValue);
          expect(result).toEqual(defaultValue);
        }
      ),
      { numRuns: 100 }
    );
  });
});


/**
 * Feature: starthobby-v1, Property 12: Chat history persistence round-trip
 *
 * For any array of chat message objects, saving to localStorage under
 * `avatarHistory` and reading back SHALL produce an equivalent array
 * with all messages preserved in order.
 *
 * **Validates: Requirements 7.10**
 */
describe('Feature: starthobby-v1, Property 12: Chat history persistence round-trip', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  it('save then read of chat messages preserves all messages in order', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryChatMessage(), { minLength: 0, maxLength: 50 }),
        (messages) => {
          // Save the chat messages to localStorage under avatarHistory
          saveToStorage('avatarHistory', messages);

          // Read them back using getFromStorage
          const retrieved = getFromStorage('avatarHistory', []);

          // The retrieved messages should be deeply equal to the original array
          expect(retrieved).toEqual(messages);
          expect(retrieved.length).toBe(messages.length);
        }
      ),
      { numRuns: 100 }
    );
  });
});
