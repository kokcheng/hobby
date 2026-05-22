/**
 * Property-based tests for engine.js — Recommendation Engine
 *
 * Feature: starthobby-v1
 * Property 1: Hard filter exclusion
 * Property 2: Soft score composition
 *
 * **Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 3.3**
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { arbitraryHobby, arbitraryProfile, GOALS } from './generators.js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// engine.js uses global function declarations (no module exports).
// Evaluate it to make scoreHobby available in the global scope.
const engineCode = readFileSync(resolve(__dirname, '..', 'engine.js'), 'utf-8');
const engineModule = new Function(engineCode + '\nreturn { scoreHobby, rankHobbies, getMatchReason };');
const { scoreHobby, rankHobbies } = engineModule();

describe('Feature: starthobby-v1, Property 1: Hard filter exclusion', () => {
  it('scoreHobby returns 0 when budget is "free" and hobby starterCost.min > 0', () => {
    fc.assert(
      fc.property(
        arbitraryHobby().filter(h => h.starterCost.min > 0),
        arbitraryProfile().map(p => ({ ...p, budget: 'free' })),
        (hobby, profile) => {
          const score = scoreHobby(hobby, profile);
          expect(score).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('scoreHobby returns 0 when budget is "<$50" and hobby starterCost.min > 50', () => {
    fc.assert(
      fc.property(
        arbitraryHobby().filter(h => h.starterCost.min > 50),
        arbitraryProfile().map(p => ({ ...p, budget: '<$50' })),
        (hobby, profile) => {
          const score = scoreHobby(hobby, profile);
          expect(score).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('scoreHobby returns 0 when time is "<2hrs" and hobby timePerWeek.min >= 5', () => {
    fc.assert(
      fc.property(
        arbitraryHobby().filter(h => h.timePerWeek.min >= 5),
        arbitraryProfile().map(p => ({ ...p, time: '<2hrs' })),
        (hobby, profile) => {
          const score = scoreHobby(hobby, profile);
          expect(score).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('scoreHobby returns 0 when environment mismatches (neither is "both")', () => {
    fc.assert(
      fc.property(
        arbitraryHobby().filter(h => h.environment !== 'both'),
        arbitraryProfile().filter(p => p.env !== 'both'),
        (hobby, profile) => {
          // Force a mismatch: set profile env to something different from hobby
          const mismatchedProfile = {
            ...profile,
            env: hobby.environment === 'indoor' ? 'outdoor' : 'indoor'
          };
          const score = scoreHobby(hobby, mismatchedProfile);
          expect(score).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('scoreHobby returns 0 when social mismatches (neither is "either")', () => {
    fc.assert(
      fc.property(
        arbitraryHobby().filter(h => h.social !== 'either'),
        arbitraryProfile().filter(p => p.social !== 'either'),
        (hobby, profile) => {
          // Force a social mismatch
          // Normalize user social: "with-others" maps to "social"
          let forcedSocial;
          if (hobby.social === 'solo') {
            forcedSocial = 'with-others'; // maps to "social", mismatches "solo"
          } else {
            // hobby.social === 'social'
            forcedSocial = 'solo'; // mismatches "social"
          }
          const mismatchedProfile = { ...profile, social: forcedSocial };
          const score = scoreHobby(hobby, mismatchedProfile);
          expect(score).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('scoreHobby returns 0 for any hobby violating at least one hard filter', () => {
    // Combined property: generate a random hard filter violation and verify score is 0
    const hardFilterViolation = fc.oneof(
      // Budget "free" violation
      fc.tuple(
        arbitraryHobby().filter(h => h.starterCost.min > 0),
        arbitraryProfile().map(p => ({ ...p, budget: 'free' }))
      ),
      // Budget "<$50" violation
      fc.tuple(
        arbitraryHobby().filter(h => h.starterCost.min > 50),
        arbitraryProfile().map(p => ({ ...p, budget: '<$50' }))
      ),
      // Time "<2hrs" violation
      fc.tuple(
        arbitraryHobby().filter(h => h.timePerWeek.min >= 5),
        arbitraryProfile().map(p => ({ ...p, time: '<2hrs' }))
      ),
      // Environment mismatch
      fc.tuple(
        arbitraryHobby().filter(h => h.environment !== 'both'),
        arbitraryProfile().map(p => ({
          ...p,
          env: fc.sample(fc.constantFrom('indoor', 'outdoor').filter(e => e !== 'both'), 1)[0] || 'indoor'
        }))
      ).map(([hobby, profile]) => {
        const env = hobby.environment === 'indoor' ? 'outdoor' : 'indoor';
        return [hobby, { ...profile, env }];
      }),
      // Social mismatch
      fc.tuple(
        arbitraryHobby().filter(h => h.social !== 'either'),
        arbitraryProfile()
      ).map(([hobby, profile]) => {
        const social = hobby.social === 'solo' ? 'with-others' : 'solo';
        return [hobby, { ...profile, social }];
      })
    );

    fc.assert(
      fc.property(hardFilterViolation, ([hobby, profile]) => {
        const score = scoreHobby(hobby, profile);
        expect(score).toBe(0);
      }),
      { numRuns: 200 }
    );
  });
});


/**
 * Feature: starthobby-v1, Property 2: Soft score composition
 *
 * For any hobby passing all hard filters, score equals sum of applicable soft bonuses.
 *
 * **Validates: Requirements 9.6, 9.7, 9.8**
 */
describe('Feature: starthobby-v1, Property 2: Soft score composition', () => {
  /**
   * Generator that produces a hobby+profile pair guaranteed to pass all hard filters.
   * Strategy: generate a hobby first, then constrain the profile to satisfy all hard filters.
   */
  function arbitraryPassingPair() {
    return arbitraryHobby().chain(hobby => {
      // Build a profile that will always pass hard filters for this hobby
      const budgetArb = (() => {
        if (hobby.starterCost.min === 0) {
          // Any budget works
          return fc.constantFrom('free', '<$50', '$50-$150', '$150+');
        } else if (hobby.starterCost.min <= 50) {
          // Must not be "free"
          return fc.constantFrom('<$50', '$50-$150', '$150+');
        } else {
          // Must not be "free" or "<$50"
          return fc.constantFrom('$50-$150', '$150+');
        }
      })();

      const timeArb = (() => {
        if (hobby.timePerWeek.min >= 5) {
          // "<2hrs" would fail, so exclude it
          return fc.constantFrom('2-5hrs', '5-10hrs', '10+hrs');
        } else {
          return fc.constantFrom('<2hrs', '2-5hrs', '5-10hrs', '10+hrs');
        }
      })();

      const envArb = (() => {
        if (hobby.environment === 'both') {
          // Any env works since hobby is "both"
          return fc.constantFrom('indoor', 'outdoor', 'both');
        } else {
          // Profile must match hobby env or be "both"
          return fc.constantFrom(hobby.environment, 'both');
        }
      })();

      const socialArb = (() => {
        if (hobby.social === 'either') {
          // Any user social works since hobby is "either"
          return fc.constantFrom('solo', 'with-others', 'either');
        } else if (hobby.social === 'solo') {
          // User must be "solo" or "either"
          return fc.constantFrom('solo', 'either');
        } else {
          // hobby.social === 'social', user must be "with-others" or "either"
          return fc.constantFrom('with-others', 'either');
        }
      })();

      return fc.record({
        time: timeArb,
        budget: budgetArb,
        env: envArb,
        social: socialArb,
        space: fc.constantFrom('small', 'room', 'yard', 'outside'),
        learning: fc.array(fc.constantFrom('videos', 'guides', 'tasks', 'try-first'), { minLength: 1, maxLength: 4 }),
        goals: fc.array(fc.constantFrom(...GOALS), { minLength: 0, maxLength: 6 }),
        name: fc.string({ minLength: 0, maxLength: 20 })
      }).map(profile => [hobby, profile]);
    });
  }

  /**
   * Computes the expected soft score for a hobby+profile pair.
   */
  function expectedSoftScore(hobby, profile) {
    let expected = 0;

    // +20 for beginner difficulty
    if (hobby.difficulty === 'beginner') {
      expected += 20;
    }

    // +30 if any hobby tag matches any user goal
    if (profile.goals && hobby.tags) {
      const hasTagMatch = hobby.tags.some(tag => profile.goals.includes(tag));
      if (hasTagMatch) {
        expected += 30;
      }
    }

    // +10 for exact environment match
    if (profile.env === hobby.environment) {
      expected += 10;
    }

    // +10 for exact social match (user "with-others" maps to hobby "social")
    const userSocial = profile.social === 'with-others' ? 'social' : profile.social;
    if (userSocial === hobby.social) {
      expected += 10;
    }

    // +10 for exact space match
    if (profile.space === hobby.spaceNeeded) {
      expected += 10;
    }

    // +10 if hobby has zero starter cost
    if (hobby.starterCost.min === 0) {
      expected += 10;
    }

    return expected;
  }

  it('score equals sum of applicable soft bonuses for any hobby passing hard filters', () => {
    fc.assert(
      fc.property(arbitraryPassingPair(), ([hobby, profile]) => {
        const score = scoreHobby(hobby, profile);
        const expected = expectedSoftScore(hobby, profile);
        expect(score).toBe(expected);
      }),
      { numRuns: 200 }
    );
  });

  it('+20 bonus is applied if and only if hobby difficulty is "beginner"', () => {
    fc.assert(
      fc.property(arbitraryPassingPair(), ([hobby, profile]) => {
        const score = scoreHobby(hobby, profile);
        const scoreWithoutBeginner = expectedSoftScore({ ...hobby, difficulty: 'intermediate' }, profile);
        if (hobby.difficulty === 'beginner') {
          expect(score).toBe(scoreWithoutBeginner + 20);
        } else {
          expect(score).toBe(scoreWithoutBeginner);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('+30 bonus is applied if and only if any hobby tag matches a user goal', () => {
    fc.assert(
      fc.property(arbitraryPassingPair(), ([hobby, profile]) => {
        const score = scoreHobby(hobby, profile);
        const hasTagMatch = hobby.tags && profile.goals &&
          hobby.tags.some(tag => profile.goals.includes(tag));
        const scoreWithoutTagMatch = expectedSoftScore({ ...hobby, tags: [] }, profile);
        if (hasTagMatch) {
          expect(score).toBe(scoreWithoutTagMatch + 30);
        } else {
          expect(score).toBe(scoreWithoutTagMatch);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('+10 bonuses are applied for exact env, social, space matches and zero cost', () => {
    fc.assert(
      fc.property(arbitraryPassingPair(), ([hobby, profile]) => {
        const score = scoreHobby(hobby, profile);
        const expected = expectedSoftScore(hobby, profile);

        // Verify score is always the exact sum of all applicable bonuses
        expect(score).toBe(expected);

        // Additionally verify score is within valid range [0, 100]
        // Max: 20 (beginner) + 30 (tag) + 10 (env) + 10 (social) + 10 (space) + 10 (zero-cost) = 90
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(90);
      }),
      { numRuns: 100 }
    );
  });
});


/**
 * Feature: starthobby-v1, Property 3: Ranking output invariants
 *
 * For any array of hobbies and any valid user profile, rankHobbies(hobbies, profile)
 * returns a list that is (a) sorted in descending order by matchScore, (b) contains
 * no hobbies with a score of zero, and (c) contains only hobbies from the original input array.
 *
 * **Validates: Requirements 3.2, 9.9**
 */
describe('Feature: starthobby-v1, Property 3: Ranking output invariants', () => {
  // Wrap hobby objects to ensure they have Object.prototype (rankHobbies uses hasOwnProperty)
  function arbitraryHobbyWithProto() {
    return arbitraryHobby().map(h => Object.assign({}, h));
  }

  it('output is sorted in descending order by matchScore', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryHobbyWithProto(), { minLength: 0, maxLength: 20 }),
        arbitraryProfile(),
        (hobbies, profile) => {
          const ranked = rankHobbies(hobbies, profile);
          for (let i = 1; i < ranked.length; i++) {
            expect(ranked[i - 1].matchScore).toBeGreaterThanOrEqual(ranked[i].matchScore);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('output contains no hobbies with a matchScore of zero', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryHobbyWithProto(), { minLength: 0, maxLength: 20 }),
        arbitraryProfile(),
        (hobbies, profile) => {
          const ranked = rankHobbies(hobbies, profile);
          for (const hobby of ranked) {
            expect(hobby.matchScore).toBeGreaterThan(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('output contains only hobbies from the original input array', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryHobbyWithProto(), { minLength: 0, maxLength: 20 }),
        arbitraryProfile(),
        (hobbies, profile) => {
          const ranked = rankHobbies(hobbies, profile);
          const originalIds = hobbies.map(h => h.id);
          for (const hobby of ranked) {
            expect(originalIds).toContain(hobby.id);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('all three invariants hold simultaneously for any input', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraryHobbyWithProto(), { minLength: 1, maxLength: 30 }),
        arbitraryProfile(),
        (hobbies, profile) => {
          const ranked = rankHobbies(hobbies, profile);
          const originalIds = hobbies.map(h => h.id);

          // (a) Sorted descending by matchScore
          for (let i = 1; i < ranked.length; i++) {
            expect(ranked[i - 1].matchScore).toBeGreaterThanOrEqual(ranked[i].matchScore);
          }

          // (b) No zeros
          for (const hobby of ranked) {
            expect(hobby.matchScore).toBeGreaterThan(0);
          }

          // (c) Only original hobbies
          for (const hobby of ranked) {
            expect(originalIds).toContain(hobby.id);
          }
        }
      ),
      { numRuns: 200 }
    );
  });
});
