/**
 * Property-based tests for utils.js — Coin System
 *
 * Feature: starthobby-v1
 * Property 5: Coin award additivity
 *
 * **Validates: Requirements 10.1, 10.4, 10.6, 10.7**
 */

import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import { arbitraryCoinBalance } from './generators.js';
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

// Set up the mock localStorage on globalThis before evaluating utils.js
const mockStorage = createLocalStorageMock();
globalThis.localStorage = mockStorage;

// Provide a minimal window.dispatchEvent for showToast (called indirectly)
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
// Evaluate it so addCoins and related functions use our mock localStorage.
const utilsCode = readFileSync(resolve(__dirname, '..', 'utils.js'), 'utf-8');
const utilsModule = new Function(utilsCode + '\nreturn { addCoins, deductCoins, getFromStorage, saveToStorage };');
const { addCoins, deductCoins, getFromStorage, saveToStorage } = utilsModule();

describe('Feature: starthobby-v1, Property 5: Coin award additivity', () => {
  beforeEach(() => {
    // Reset localStorage before each test
    mockStorage.clear();
  });

  it('addCoins(amount) results in balance = previous + amount for arbitrary starting balances and amounts', () => {
    fc.assert(
      fc.property(
        arbitraryCoinBalance(),
        fc.integer({ min: 0, max: 10000 }),
        (startingBalance, amount) => {
          // Set up localStorage with the starting balance
          mockStorage.setItem('coins', JSON.stringify(startingBalance));

          // Call addCoins
          const result = addCoins(amount);

          // Verify the result equals previous + amount
          expect(result).toBe(startingBalance + amount);

          // Verify the new balance is persisted to localStorage
          const persisted = JSON.parse(mockStorage.getItem('coins'));
          expect(persisted).toBe(startingBalance + amount);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('addCoins persists the updated balance to localStorage for task completion awards (30 coins)', () => {
    fc.assert(
      fc.property(
        arbitraryCoinBalance(),
        (startingBalance) => {
          mockStorage.setItem('coins', JSON.stringify(startingBalance));

          const result = addCoins(30);

          expect(result).toBe(startingBalance + 30);
          expect(JSON.parse(mockStorage.getItem('coins'))).toBe(startingBalance + 30);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('addCoins persists the updated balance to localStorage for save hobby awards (5 coins)', () => {
    fc.assert(
      fc.property(
        arbitraryCoinBalance(),
        (startingBalance) => {
          mockStorage.setItem('coins', JSON.stringify(startingBalance));

          const result = addCoins(5);

          expect(result).toBe(startingBalance + 5);
          expect(JSON.parse(mockStorage.getItem('coins'))).toBe(startingBalance + 5);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('addCoins persists the updated balance to localStorage for note writing awards (10 coins)', () => {
    fc.assert(
      fc.property(
        arbitraryCoinBalance(),
        (startingBalance) => {
          mockStorage.setItem('coins', JSON.stringify(startingBalance));

          const result = addCoins(10);

          expect(result).toBe(startingBalance + 10);
          expect(JSON.parse(mockStorage.getItem('coins'))).toBe(startingBalance + 10);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 6: Coin redemption correctness
 *
 * **Validates: Requirements 6.7, 6.8, 10.8**
 */
describe('Feature: starthobby-v1, Property 6: Coin redemption correctness', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  it('deductCoins returns true and balance = previous - cost when balance >= cost', () => {
    fc.assert(
      fc.property(
        arbitraryCoinBalance(),
        fc.integer({ min: 0, max: 10000 }),
        (balance, cost) => {
          // Pre-condition: balance must be >= cost
          fc.pre(balance >= cost);

          // Set up localStorage with the starting balance
          mockStorage.setItem('coins', JSON.stringify(balance));

          // Call deductCoins
          const result = deductCoins(cost);

          // Verify deduction succeeded
          expect(result).toBe(true);

          // Verify the new balance is previous - cost
          const persisted = JSON.parse(mockStorage.getItem('coins'));
          expect(persisted).toBe(balance - cost);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('deductCoins returns false and balance is unchanged when balance < cost', () => {
    fc.assert(
      fc.property(
        arbitraryCoinBalance(),
        fc.integer({ min: 1, max: 10000 }),
        (balance, cost) => {
          // Pre-condition: balance must be < cost
          fc.pre(balance < cost);

          // Set up localStorage with the starting balance
          mockStorage.setItem('coins', JSON.stringify(balance));

          // Call deductCoins
          const result = deductCoins(cost);

          // Verify deduction failed
          expect(result).toBe(false);

          // Verify the balance is unchanged
          const persisted = JSON.parse(mockStorage.getItem('coins'));
          expect(persisted).toBe(balance);
        }
      ),
      { numRuns: 100 }
    );
  });
});
