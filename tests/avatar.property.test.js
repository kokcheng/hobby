/**
 * Property-based tests for avatar-engine.js — Avatar Response Engine
 *
 * Feature: starthobby-v1
 * Property 4: Avatar keyword matching
 *
 * **Validates: Requirements 7.4, 7.5, 7.6, 7.7, 7.8**
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { arbitraryProfile } from './generators.js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// avatar-engine.js uses global function declarations (no module exports).
// Evaluate it to make getAvatarResponse and FLOWS available.
const avatarCode = readFileSync(resolve(__dirname, '..', 'avatar-engine.js'), 'utf-8');
const avatarModule = new Function(avatarCode + '\nreturn { getAvatarResponse, getGreeting, getFallbackResponse, FLOWS };');
const { getAvatarResponse, getGreeting, getFallbackResponse, FLOWS } = avatarModule();

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Collect all trigger keywords from all flows (both single-word and multi-word).
 */
const ALL_KEYWORDS = FLOWS.flatMap(flow => flow.keywords);
const ALL_FLOW_IDS = FLOWS.map(flow => flow.id);

/**
 * The fallback response text (constant).
 */
const FALLBACK_TEXT = "I'm here to help with your hobby journey! Try asking about your next step, or let me know if you're feeling stuck.";

/**
 * Generates a valid plan object for avatar responses.
 */
function arbitraryPlan() {
  return fc.record({
    hobby: fc.record({
      name: fc.string({ minLength: 1, maxLength: 30 }).map(s => s || 'Painting'),
      commonPitfalls: fc.array(
        fc.record({
          issue: fc.string({ minLength: 1, maxLength: 50 }).map(s => s || 'Issue'),
          fix: fc.string({ minLength: 1, maxLength: 50 }).map(s => s || 'Fix')
        }),
        { minLength: 1, maxLength: 3 }
      ),
      milestones: fc.array(
        fc.record({
          label: fc.string({ minLength: 1, maxLength: 30 }).map(s => s || 'Milestone'),
          timeframe: fc.constant('1 week'),
          description: fc.string({ minLength: 1, maxLength: 50 }).map(s => s || 'Description')
        }),
        { minLength: 1, maxLength: 3 }
      ),
      weekOnePlan: fc.array(
        fc.record({
          day: fc.integer({ min: 1, max: 7 }),
          title: fc.string({ minLength: 1, maxLength: 30 }).map(s => s || 'Task'),
          description: fc.constant('Task description'),
          estimatedTime: fc.constant('15 minutes'),
          coins: fc.constant(30)
        }),
        { minLength: 1, maxLength: 7 }
      )
    }),
    todayTask: fc.record({
      title: fc.string({ minLength: 1, maxLength: 30 }).map(s => s || 'Today Task'),
      estimatedTime: fc.constantFrom('10 minutes', '15 minutes', '30 minutes', '1 hour')
    }),
    streak: fc.record({
      current: fc.integer({ min: 0, max: 30 }),
      best: fc.integer({ min: 0, max: 60 }),
      lastActiveDate: fc.constant('2026-05-21')
    }),
    completedDays: fc.subarray([1, 2, 3, 4, 5, 6, 7])
  });
}

/**
 * Generates a string that contains at least one keyword from the specified flow.
 * Wraps the keyword in surrounding text to simulate realistic user input.
 */
function arbitraryInputWithKeyword(flowIndex) {
  const flow = FLOWS[flowIndex];
  return fc.tuple(
    fc.constantFrom(...flow.keywords),
    fc.string({ minLength: 0, maxLength: 20 }).map(s => s.replace(/[a-z]/gi, 'x')), // prefix (no accidental keywords)
    fc.string({ minLength: 0, maxLength: 20 }).map(s => s.replace(/[a-z]/gi, 'x'))  // suffix (no accidental keywords)
  ).map(([keyword, prefix, suffix]) => {
    // For multi-word keywords, just use the keyword with some padding
    return (prefix ? prefix + ' ' : '') + keyword + (suffix ? ' ' + suffix : '');
  });
}

/**
 * Generates a string guaranteed to NOT contain any trigger keyword.
 * Uses characters/words that don't match any keyword.
 */
function arbitraryInputWithoutKeywords() {
  // Generate strings from a safe alphabet that cannot form any trigger keyword
  const safeWords = ['banana', 'zebra', 'quantum', 'purple', 'umbrella', 'xylophone', 'jazz', 'waffle', 'kiwi', 'noodle'];
  return fc.array(fc.constantFrom(...safeWords), { minLength: 1, maxLength: 5 })
    .map(words => words.join(' '));
}

// ─── Property Tests ──────────────────────────────────────────────────────────

describe('Feature: starthobby-v1, Property 4: Avatar keyword matching', () => {

  it('input containing a trigger keyword from any flow returns a non-fallback response', () => {
    // Generate a random flow index and an input containing one of its keywords
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: FLOWS.length - 1 }).chain(flowIdx =>
          fc.tuple(fc.constant(flowIdx), arbitraryInputWithKeyword(flowIdx))
        ),
        arbitraryProfile(),
        arbitraryPlan(),
        ([flowIdx, input], profile, plan) => {
          const response = getAvatarResponse(input, profile, plan);
          // The response should NOT be the fallback
          expect(response.text).not.toBe(FALLBACK_TEXT);
          // The response should have text and chips
          expect(response).toHaveProperty('text');
          expect(response).toHaveProperty('chips');
          expect(typeof response.text).toBe('string');
          expect(Array.isArray(response.chips)).toBe(true);
        }
      ),
      { numRuns: 200 }
    );
  });

  it('input containing a trigger keyword returns the response from the FIRST matching flow', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: FLOWS.length - 1 }).chain(flowIdx =>
          fc.tuple(fc.constant(flowIdx), arbitraryInputWithKeyword(flowIdx))
        ),
        arbitraryProfile(),
        arbitraryPlan(),
        ([flowIdx, input], profile, plan) => {
          const response = getAvatarResponse(input, profile, plan);
          // Determine which flow SHOULD match first by simulating the engine logic
          const lowered = input.toLowerCase();
          let expectedFlowIdx = -1;
          for (let i = 0; i < FLOWS.length; i++) {
            const flow = FLOWS[i];
            let matched = false;
            for (const keyword of flow.keywords) {
              if (keyword.indexOf(' ') !== -1) {
                if (lowered.indexOf(keyword) !== -1) { matched = true; break; }
              } else {
                const regex = new RegExp('\\b' + keyword + '\\b');
                if (regex.test(lowered)) { matched = true; break; }
              }
            }
            if (matched) { expectedFlowIdx = i; break; }
          }
          // The expected flow should have matched
          expect(expectedFlowIdx).toBeGreaterThanOrEqual(0);
          // The response should match what that flow produces
          const expectedResponse = FLOWS[expectedFlowIdx].getResponse(profile, plan);
          expect(response.text).toBe(expectedResponse.text);
          expect(response.chips).toEqual(expectedResponse.chips);
        }
      ),
      { numRuns: 200 }
    );
  });

  it('input without any trigger keywords returns the fallback response', () => {
    fc.assert(
      fc.property(
        arbitraryInputWithoutKeywords(),
        arbitraryProfile(),
        arbitraryPlan(),
        (input, profile, plan) => {
          const response = getAvatarResponse(input, profile, plan);
          expect(response.text).toBe(FALLBACK_TEXT);
          expect(response.chips).toEqual([
            "What's next?",
            "I'm stuck",
            "I completed today",
            "Show my plan",
            "Motivate me"
          ]);
        }
      ),
      { numRuns: 200 }
    );
  });

  it('keyword matching is case-insensitive', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: FLOWS.length - 1 }).chain(flowIdx =>
          fc.tuple(
            fc.constant(flowIdx),
            fc.constantFrom(...FLOWS[flowIdx].keywords)
          )
        ),
        arbitraryProfile(),
        arbitraryPlan(),
        fc.constantFrom('upper', 'lower', 'mixed'),
        ([flowIdx, keyword], profile, plan, caseType) => {
          let input;
          if (caseType === 'upper') {
            input = keyword.toUpperCase();
          } else if (caseType === 'lower') {
            input = keyword.toLowerCase();
          } else {
            // Mixed case: alternate upper/lower
            input = keyword.split('').map((c, i) => i % 2 === 0 ? c.toUpperCase() : c.toLowerCase()).join('');
          }
          const response = getAvatarResponse(input, profile, plan);
          // Should NOT be fallback since keyword is present
          expect(response.text).not.toBe(FALLBACK_TEXT);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('empty or null input returns fallback response', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('', null, undefined),
        arbitraryProfile(),
        arbitraryPlan(),
        (input, profile, plan) => {
          const response = getAvatarResponse(input, profile, plan);
          expect(response.text).toBe(FALLBACK_TEXT);
        }
      ),
      { numRuns: 30 }
    );
  });
});
