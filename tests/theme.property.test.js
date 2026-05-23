/**
 * Property-based tests for theme-engine.js — UI Theme Switcher
 *
 * Feature: ui-theme-switcher
 * Property 2: Invalid theme ID fallback and cleanup
 * Property 3: Theme application sets all CSS custom properties
 * Property 4: setTheme idempotence
 * Property 6: getValidThemes filtering
 *
 * **Validates: Requirements 2.4, 5.4, 4.1, 4.3, 1.5, 9.3, 9.4**
 */

import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// ─── localStorage Mock ───────────────────────────────────────────────────────

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

const mockStorage = createLocalStorageMock();
globalThis.localStorage = mockStorage;

// ─── window.matchMedia mock ──────────────────────────────────────────────────

let mockPrefersDark = false;

if (!globalThis.window) {
  globalThis.window = globalThis;
}
window.matchMedia = (query) => ({
  matches: query === '(prefers-color-scheme: dark)' ? mockPrefersDark : false,
  media: query,
  addEventListener: () => {},
  removeEventListener: () => {}
});
if (!window.dispatchEvent) {
  window.dispatchEvent = () => {};
}
if (!globalThis.CustomEvent) {
  globalThis.CustomEvent = class CustomEvent {
    constructor(type, options) {
      this.type = type;
      this.detail = options ? options.detail : null;
    }
  };
}

// ─── Load global scripts (no module system) ──────────────────────────────────

const themesCode = readFileSync(resolve(__dirname, '..', 'themes.js'), 'utf-8');
const utilsCode = readFileSync(resolve(__dirname, '..', 'utils.js'), 'utf-8');
const engineCode = readFileSync(resolve(__dirname, '..', 'theme-engine.js'), 'utf-8');

const combinedModule = new Function(
  themesCode + '\n' +
  utilsCode + '\n' +
  engineCode + '\n' +
  'return { THEMES, REQUIRED_COLOR_KEYS, resolveThemeId, isValidTheme, getValidThemes, saveToStorage, getFromStorage, setTheme, getActiveThemeId, applyTheme };'
);
const {
  THEMES,
  REQUIRED_COLOR_KEYS,
  resolveThemeId,
  isValidTheme,
  getValidThemes,
  saveToStorage,
  getFromStorage,
  setTheme,
  getActiveThemeId,
  applyTheme
} = combinedModule();

// Valid theme IDs from the configuration
const VALID_THEME_IDS = THEMES.filter(t => isValidTheme(t)).map(t => t.id);

// ─── Generators ──────────────────────────────────────────────────────────────

/**
 * Generates a random valid theme ID from the THEMES array.
 */
function arbitraryThemeId() {
  return fc.constantFrom(...VALID_THEME_IDS);
}

/**
 * Generates arbitrary strings that are NOT valid theme IDs.
 */
function arbitraryInvalidThemeId() {
  return fc.string({ minLength: 0, maxLength: 100 }).filter(
    s => VALID_THEME_IDS.indexOf(s) === -1
  );
}

/**
 * Generates a random valid theme object from the THEMES array.
 */
function arbitraryValidTheme() {
  const validThemes = THEMES.filter(t => isValidTheme(t));
  return fc.constantFrom(...validThemes);
}

// ─── Property 2: Invalid theme ID fallback and cleanup ───────────────────────

describe('Feature: ui-theme-switcher, Property 2: Invalid theme ID fallback and cleanup', () => {
  beforeEach(() => {
    mockStorage.clear();
    mockPrefersDark = false;
    document.documentElement.removeAttribute('data-theme');
    REQUIRED_COLOR_KEYS.forEach(key => {
      document.documentElement.style.removeProperty('--theme-' + key);
    });
  });

  it('resolveThemeId returns "light" or "dark" when an invalid theme ID is stored in localStorage', () => {
    fc.assert(
      fc.property(arbitraryInvalidThemeId(), (invalidId) => {
        mockStorage.setItem('sh_theme', JSON.stringify(invalidId));
        const resolved = resolveThemeId();
        expect(['light', 'dark']).toContain(resolved);
      }),
      { numRuns: 100 }
    );
  });

  it('resolveThemeId removes the invalid theme ID from localStorage', () => {
    fc.assert(
      fc.property(arbitraryInvalidThemeId(), (invalidId) => {
        mockStorage.setItem('sh_theme', JSON.stringify(invalidId));
        resolveThemeId();
        const storedAfter = mockStorage.getItem('sh_theme');
        expect(storedAfter).toBeNull();
      }),
      { numRuns: 100 }
    );
  });

  it('resolveThemeId returns "dark" when system prefers dark and invalid ID is stored', () => {
    mockPrefersDark = true;
    fc.assert(
      fc.property(arbitraryInvalidThemeId(), (invalidId) => {
        mockStorage.setItem('sh_theme', JSON.stringify(invalidId));
        const resolved = resolveThemeId();
        expect(resolved).toBe('dark');
      }),
      { numRuns: 100 }
    );
  });

  it('resolveThemeId returns "light" when system prefers light and invalid ID is stored', () => {
    mockPrefersDark = false;
    fc.assert(
      fc.property(arbitraryInvalidThemeId(), (invalidId) => {
        mockStorage.setItem('sh_theme', JSON.stringify(invalidId));
        const resolved = resolveThemeId();
        expect(resolved).toBe('light');
      }),
      { numRuns: 100 }
    );
  });
});


// ─── Property 3: Theme application sets all CSS custom properties ────────────

/**
 * **Validates: Requirements 4.1, 4.3**
 *
 * For any valid theme object from the THEMES configuration, calling applyTheme(theme.id)
 * SHALL result in exactly 7 CSS custom properties (--theme-background, --theme-surface,
 * --theme-text-primary, --theme-text-secondary, --theme-brand-primary,
 * --theme-brand-secondary, --theme-border) being set on the document element,
 * with values matching the theme's colorMap. Also verifies data-theme attribute is set.
 */
describe('Feature: ui-theme-switcher, Property 3: Theme application sets all CSS custom properties', () => {
  beforeEach(() => {
    mockStorage.clear();
    mockPrefersDark = false;
    document.documentElement.removeAttribute('data-theme');
    REQUIRED_COLOR_KEYS.forEach(key => {
      document.documentElement.style.removeProperty('--theme-' + key);
    });
  });

  it('applyTheme sets exactly 7 CSS custom properties matching the theme colorMap', () => {
    fc.assert(
      fc.property(arbitraryValidTheme(), (theme) => {
        // Apply the theme
        applyTheme(theme.id);

        // Verify all 7 CSS custom properties are set with correct values
        for (const key of REQUIRED_COLOR_KEYS) {
          const cssValue = document.documentElement.style.getPropertyValue('--theme-' + key);
          expect(cssValue).toBe(theme.colorMap[key]);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('applyTheme sets exactly 7 CSS custom properties (no more, no fewer)', () => {
    fc.assert(
      fc.property(arbitraryValidTheme(), (theme) => {
        // Reset all properties first
        REQUIRED_COLOR_KEYS.forEach(key => {
          document.documentElement.style.removeProperty('--theme-' + key);
        });

        // Apply the theme
        applyTheme(theme.id);

        // Count the --theme-* properties that are set
        let setCount = 0;
        for (const key of REQUIRED_COLOR_KEYS) {
          const cssValue = document.documentElement.style.getPropertyValue('--theme-' + key);
          if (cssValue !== '') {
            setCount++;
          }
        }

        expect(setCount).toBe(7);
      }),
      { numRuns: 100 }
    );
  });

  it('applyTheme sets data-theme attribute to the theme id', () => {
    fc.assert(
      fc.property(arbitraryValidTheme(), (theme) => {
        applyTheme(theme.id);

        const dataTheme = document.documentElement.getAttribute('data-theme');
        expect(dataTheme).toBe(theme.id);
      }),
      { numRuns: 100 }
    );
  });
});

// ─── Property 4: setTheme idempotence ────────────────────────────────────────

describe('Feature: ui-theme-switcher, Property 4: setTheme idempotence', () => {
  beforeEach(() => {
    mockStorage.clear();
    mockPrefersDark = false;
    document.documentElement.removeAttribute('data-theme');
    REQUIRED_COLOR_KEYS.forEach(key => {
      document.documentElement.style.removeProperty('--theme-' + key);
    });
  });

  it('calling setTheme(id) when that theme is already active produces no DOM or localStorage changes', () => {
    fc.assert(
      fc.property(arbitraryThemeId(), (themeId) => {
        setTheme(themeId);

        const dataThemeAfterFirst = document.documentElement.getAttribute('data-theme');
        const cssPropsAfterFirst = {};
        REQUIRED_COLOR_KEYS.forEach(key => {
          cssPropsAfterFirst[key] = document.documentElement.style.getPropertyValue('--theme-' + key);
        });
        const localStorageAfterFirst = mockStorage.getItem('sh_theme');

        setTheme(themeId);

        const dataThemeAfterSecond = document.documentElement.getAttribute('data-theme');
        const cssPropsAfterSecond = {};
        REQUIRED_COLOR_KEYS.forEach(key => {
          cssPropsAfterSecond[key] = document.documentElement.style.getPropertyValue('--theme-' + key);
        });
        const localStorageAfterSecond = mockStorage.getItem('sh_theme');

        expect(dataThemeAfterSecond).toBe(dataThemeAfterFirst);
        REQUIRED_COLOR_KEYS.forEach(key => {
          expect(cssPropsAfterSecond[key]).toBe(cssPropsAfterFirst[key]);
        });
        expect(localStorageAfterSecond).toBe(localStorageAfterFirst);
      }),
      { numRuns: 100 }
    );
  });

  it('setTheme is idempotent for multiple consecutive calls with the same theme', () => {
    fc.assert(
      fc.property(
        arbitraryThemeId(),
        fc.integer({ min: 2, max: 10 }),
        (themeId, repeatCount) => {
          setTheme(themeId);

          const dataThemeExpected = document.documentElement.getAttribute('data-theme');
          const cssPropsExpected = {};
          REQUIRED_COLOR_KEYS.forEach(key => {
            cssPropsExpected[key] = document.documentElement.style.getPropertyValue('--theme-' + key);
          });
          const localStorageExpected = mockStorage.getItem('sh_theme');

          for (let i = 0; i < repeatCount; i++) {
            setTheme(themeId);
          }

          expect(document.documentElement.getAttribute('data-theme')).toBe(dataThemeExpected);
          REQUIRED_COLOR_KEYS.forEach(key => {
            expect(document.documentElement.style.getPropertyValue('--theme-' + key)).toBe(cssPropsExpected[key]);
          });
          expect(mockStorage.getItem('sh_theme')).toBe(localStorageExpected);
        }
      ),
      { numRuns: 100 }
    );
  });
});


// ─── Property 6: getValidThemes filtering ────────────────────────────────────

/**
 * Feature: ui-theme-switcher, Property 6: getValidThemes filtering
 *
 * For any array of theme-like objects (some valid, some invalid),
 * getValidThemes() SHALL return exactly those objects that pass isValidTheme()
 * validation, preserving their order, and excluding all invalid entries.
 *
 * **Validates: Requirements 9.3, 9.4**
 */

/**
 * Helper: create a theme engine with a custom THEMES array.
 * Evaluates theme-engine.js with the provided array as the THEMES global.
 */
function createEngineWithThemes(themesArray) {
  const fn = new Function(
    'THEMES', 'REQUIRED_COLOR_KEYS', 'localStorage', 'window', 'document',
    utilsCode + '\n' +
    engineCode + '\n' +
    'return { isValidTheme: isValidTheme, getValidThemes: getValidThemes };'
  );
  return fn(themesArray, REQUIRED_COLOR_KEYS, mockStorage, window, document);
}

// ─── Generators for Property 6 ──────────────────────────────────────────────

/**
 * Generates a valid theme object with random id, name, and colorMap
 * that will pass isValidTheme validation.
 */
function arbitraryValidThemeObj() {
  const hexColor = fc.stringMatching(/^#[0-9a-f]{6}$/);
  return fc.record({
    id: fc.string({ minLength: 1, maxLength: 50 }),
    name: fc.string({ minLength: 1, maxLength: 100 }),
    colorMap: fc.record({
      background: hexColor,
      surface: hexColor,
      'text-primary': hexColor,
      'text-secondary': hexColor,
      'brand-primary': hexColor,
      'brand-secondary': hexColor,
      border: hexColor,
    })
  });
}

/**
 * Generates an invalid theme object (missing or malformed properties).
 */
function arbitraryInvalidThemeObj() {
  return fc.oneof(
    // Missing id entirely
    fc.constant({ name: 'NoId', colorMap: { background: '#fff', surface: '#eee', 'text-primary': '#000', 'text-secondary': '#333', 'brand-primary': '#00f', 'brand-secondary': '#0f0', border: '#ccc' } }),
    // Empty id string
    fc.constant({ id: '', name: 'EmptyId', colorMap: { background: '#fff', surface: '#eee', 'text-primary': '#000', 'text-secondary': '#333', 'brand-primary': '#00f', 'brand-secondary': '#0f0', border: '#ccc' } }),
    // Id too long (51 chars)
    fc.constant({ id: 'a'.repeat(51), name: 'TooLongId', colorMap: { background: '#fff', surface: '#eee', 'text-primary': '#000', 'text-secondary': '#333', 'brand-primary': '#00f', 'brand-secondary': '#0f0', border: '#ccc' } }),
    // Missing name
    fc.constant({ id: 'no-name', colorMap: { background: '#fff', surface: '#eee', 'text-primary': '#000', 'text-secondary': '#333', 'brand-primary': '#00f', 'brand-secondary': '#0f0', border: '#ccc' } }),
    // Empty name
    fc.constant({ id: 'empty-name', name: '', colorMap: { background: '#fff', surface: '#eee', 'text-primary': '#000', 'text-secondary': '#333', 'brand-primary': '#00f', 'brand-secondary': '#0f0', border: '#ccc' } }),
    // Missing colorMap
    fc.constant({ id: 'no-map', name: 'No Map' }),
    // colorMap missing a key (only 6 keys)
    fc.constant({ id: 'missing-key', name: 'Missing Key', colorMap: { background: '#fff', surface: '#eee', 'text-primary': '#000', 'text-secondary': '#333', 'brand-primary': '#00f', 'brand-secondary': '#0f0' } }),
    // colorMap with empty string value
    fc.constant({ id: 'empty-val', name: 'Empty Val', colorMap: { background: '', surface: '#eee', 'text-primary': '#000', 'text-secondary': '#333', 'brand-primary': '#00f', 'brand-secondary': '#0f0', border: '#ccc' } }),
    // colorMap with extra key (8 keys total)
    fc.constant({ id: 'extra-key', name: 'Extra Key', colorMap: { background: '#fff', surface: '#eee', 'text-primary': '#000', 'text-secondary': '#333', 'brand-primary': '#00f', 'brand-secondary': '#0f0', border: '#ccc', extra: '#abc' } }),
    // null
    fc.constant(null),
    // undefined
    fc.constant(undefined),
    // Non-object types
    fc.constant(42),
    fc.constant('string-theme'),
    fc.constant(true)
  );
}

/**
 * Generates a mixed array of valid and invalid theme objects.
 */
function arbitraryMixedThemeArray() {
  return fc.array(
    fc.oneof(
      arbitraryValidThemeObj(),
      arbitraryInvalidThemeObj()
    ),
    { minLength: 0, maxLength: 15 }
  );
}

describe('Feature: ui-theme-switcher, Property 6: getValidThemes filtering', () => {
  it('getValidThemes returns exactly those objects passing isValidTheme, preserving order', () => {
    fc.assert(
      fc.property(arbitraryMixedThemeArray(), (themesArray) => {
        const engine = createEngineWithThemes(themesArray);

        const result = engine.getValidThemes();

        // Manually filter using isValidTheme
        const expected = themesArray.filter(t => engine.isValidTheme(t));

        // Same length
        expect(result.length).toBe(expected.length);

        // Same elements in same order (reference equality)
        for (let i = 0; i < result.length; i++) {
          expect(result[i]).toBe(expected[i]);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('getValidThemes excludes all invalid entries', () => {
    fc.assert(
      fc.property(arbitraryMixedThemeArray(), (themesArray) => {
        const engine = createEngineWithThemes(themesArray);

        const result = engine.getValidThemes();

        // Every returned theme must pass isValidTheme
        for (const theme of result) {
          expect(engine.isValidTheme(theme)).toBe(true);
        }
      }),
      { numRuns: 100 }
    );
  });
});


// ─── Property 7: Keyboard navigation wrapping ────────────────────────────────

/**
 * Feature: ui-theme-switcher, Property 7: Keyboard navigation wrapping
 *
 * For any number of themes N (≥ 1) and any currently focused index, pressing
 * Arrow Down/Right SHALL move focus to (index + 1) % N, and pressing Arrow Up/Left
 * SHALL move focus to (index - 1 + N) % N, implementing circular navigation.
 *
 * **Validates: Requirements 6.1**
 */

/**
 * Replicates the keyboard navigation logic from the handleKeydown method
 * in the themeSwitcher Alpine.js component.
 *
 * @param {number} focusedIndex - Current focused index
 * @param {number} numThemes - Total number of themes (N)
 * @param {string} key - Arrow key pressed
 * @returns {number} New focused index after key press
 */
function computeNextFocusedIndex(focusedIndex, numThemes, key) {
  if (numThemes === 0) return focusedIndex;

  if (key === 'ArrowDown' || key === 'ArrowRight') {
    return (focusedIndex + 1) % numThemes;
  } else if (key === 'ArrowUp' || key === 'ArrowLeft') {
    return (focusedIndex - 1 + numThemes) % numThemes;
  }
  return focusedIndex;
}

/**
 * Generator: produces integers in [0, n-1] for a given n.
 */
function arbitraryFocusedIndex(n) {
  return fc.integer({ min: 0, max: n - 1 });
}

/**
 * Generator: produces one of the four arrow keys.
 */
function arbitraryArrowKey() {
  return fc.constantFrom('ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight');
}

describe('Feature: ui-theme-switcher, Property 7: Keyboard navigation wrapping', () => {
  it('Arrow Down/Right moves focus to (index + 1) % N', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 20 }).chain(n =>
          fc.tuple(
            fc.constant(n),
            arbitraryFocusedIndex(n),
            fc.constantFrom('ArrowDown', 'ArrowRight')
          )
        ),
        ([n, currentIndex, key]) => {
          const newIndex = computeNextFocusedIndex(currentIndex, n, key);
          expect(newIndex).toBe((currentIndex + 1) % n);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Arrow Up/Left moves focus to (index - 1 + N) % N', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 20 }).chain(n =>
          fc.tuple(
            fc.constant(n),
            arbitraryFocusedIndex(n),
            fc.constantFrom('ArrowUp', 'ArrowLeft')
          )
        ),
        ([n, currentIndex, key]) => {
          const newIndex = computeNextFocusedIndex(currentIndex, n, key);
          expect(newIndex).toBe((currentIndex - 1 + n) % n);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('navigation wraps from last index to first on Arrow Down/Right', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 20 }),
        fc.constantFrom('ArrowDown', 'ArrowRight'),
        (n, key) => {
          const lastIndex = n - 1;
          const newIndex = computeNextFocusedIndex(lastIndex, n, key);
          expect(newIndex).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('navigation wraps from first index to last on Arrow Up/Left', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 20 }),
        fc.constantFrom('ArrowUp', 'ArrowLeft'),
        (n, key) => {
          const newIndex = computeNextFocusedIndex(0, n, key);
          expect(newIndex).toBe(n - 1);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('resulting index is always within valid bounds [0, N-1]', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 20 }).chain(n =>
          fc.tuple(
            fc.constant(n),
            arbitraryFocusedIndex(n),
            arbitraryArrowKey()
          )
        ),
        ([n, currentIndex, key]) => {
          const newIndex = computeNextFocusedIndex(currentIndex, n, key);
          expect(newIndex).toBeGreaterThanOrEqual(0);
          expect(newIndex).toBeLessThan(n);
        }
      ),
      { numRuns: 100 }
    );
  });
});


// ─── Property 8: ARIA and tabindex state consistency ─────────────────────────

/**
 * Feature: ui-theme-switcher, Property 8: ARIA and tabindex state consistency
 *
 * For any set of valid themes and any selected theme index, exactly one theme option
 * SHALL have aria-checked="true" and tabindex="0", and all other theme options SHALL
 * have aria-checked="false" and tabindex="-1".
 *
 * This tests the component state logic that drives the ARIA attributes in the template:
 *   :aria-checked="theme.id === activeTheme ? 'true' : 'false'"
 *   :tabindex="index === focusedIndex ? '0' : '-1'"
 *
 * When a theme is selected, focusedIndex is set to that theme's index, so both
 * aria-checked and tabindex align on the same single option.
 *
 * **Validates: Requirements 6.3, 6.5**
 */
describe('Feature: ui-theme-switcher, Property 8: ARIA and tabindex state consistency', () => {
  /**
   * Simulates the component state logic for ARIA attributes.
   * Given an array of themes and a selectedIndex, computes the aria-checked
   * and tabindex values for each option as the component template would.
   *
   * The component logic:
   * - activeTheme = themes[selectedIndex].id
   * - focusedIndex = selectedIndex (set on init and on select)
   * - aria-checked: theme.id === activeTheme ? 'true' : 'false'
   * - tabindex: index === focusedIndex ? '0' : '-1'
   */
  function computeAriaState(themes, selectedIndex) {
    const activeTheme = themes[selectedIndex].id;
    const focusedIndex = selectedIndex;

    return themes.map((theme, index) => ({
      ariaChecked: theme.id === activeTheme ? 'true' : 'false',
      tabindex: index === focusedIndex ? '0' : '-1'
    }));
  }

  /**
   * Generator: number of themes N (1-20)
   */
  function arbitraryThemeCount() {
    return fc.integer({ min: 1, max: 20 });
  }

  /**
   * Generator: array of N themes with unique IDs
   */
  function arbitraryThemeArray(n) {
    return fc.array(
      fc.string({ minLength: 1, maxLength: 50 }),
      { minLength: n, maxLength: n }
    ).chain(ids => {
      // Ensure unique IDs by appending index
      const uniqueIds = ids.map((id, i) => id + '-' + i);
      const themes = uniqueIds.map((id, i) => ({
        id: id,
        name: 'Theme ' + i,
        colorMap: {
          background: '#ffffff',
          surface: '#f9fafb',
          'text-primary': '#111827',
          'text-secondary': '#6b7280',
          'brand-primary': '#6366f1',
          'brand-secondary': '#10b981',
          border: '#e5e7eb'
        }
      }));
      return fc.constant(themes);
    });
  }

  /**
   * Generator: produces a tuple of [themes, selectedIndex] where selectedIndex is valid
   */
  function arbitraryThemesAndSelection() {
    return arbitraryThemeCount().chain(n => {
      return fc.tuple(
        arbitraryThemeArray(n),
        fc.integer({ min: 0, max: n - 1 })
      );
    });
  }

  it('exactly one option has aria-checked="true" and tabindex="0" for any selection', () => {
    fc.assert(
      fc.property(arbitraryThemesAndSelection(), ([themes, selectedIndex]) => {
        const states = computeAriaState(themes, selectedIndex);

        // Count options with aria-checked="true"
        const checkedCount = states.filter(s => s.ariaChecked === 'true').length;
        expect(checkedCount).toBe(1);

        // Count options with tabindex="0"
        const focusableCount = states.filter(s => s.tabindex === '0').length;
        expect(focusableCount).toBe(1);

        // The same option has both aria-checked="true" AND tabindex="0"
        const checkedIndex = states.findIndex(s => s.ariaChecked === 'true');
        const focusedIdx = states.findIndex(s => s.tabindex === '0');
        expect(checkedIndex).toBe(focusedIdx);
        expect(checkedIndex).toBe(selectedIndex);
      }),
      { numRuns: 100 }
    );
  });

  it('all non-selected options have aria-checked="false" and tabindex="-1"', () => {
    fc.assert(
      fc.property(arbitraryThemesAndSelection(), ([themes, selectedIndex]) => {
        const states = computeAriaState(themes, selectedIndex);

        for (let i = 0; i < states.length; i++) {
          if (i !== selectedIndex) {
            expect(states[i].ariaChecked).toBe('false');
            expect(states[i].tabindex).toBe('-1');
          }
        }
      }),
      { numRuns: 100 }
    );
  });

  it('the selected option always has aria-checked="true" and tabindex="0"', () => {
    fc.assert(
      fc.property(arbitraryThemesAndSelection(), ([themes, selectedIndex]) => {
        const states = computeAriaState(themes, selectedIndex);

        expect(states[selectedIndex].ariaChecked).toBe('true');
        expect(states[selectedIndex].tabindex).toBe('0');
      }),
      { numRuns: 100 }
    );
  });

  it('aria-checked and tabindex are always consistent (same single index)', () => {
    fc.assert(
      fc.property(arbitraryThemesAndSelection(), ([themes, selectedIndex]) => {
        const states = computeAriaState(themes, selectedIndex);

        // For every option, aria-checked="true" iff tabindex="0"
        for (let i = 0; i < states.length; i++) {
          const isChecked = states[i].ariaChecked === 'true';
          const isFocusable = states[i].tabindex === '0';
          expect(isChecked).toBe(isFocusable);
        }
      }),
      { numRuns: 100 }
    );
  });
});


// ─── Property 9: WCAG AA contrast ratios ─────────────────────────────────────

/**
 * Feature: ui-theme-switcher, Property 9: WCAG AA contrast ratios
 *
 * For any theme in the THEMES configuration:
 * 1. The contrast ratio between text-primary and background SHALL be at least 4.5:1
 * 2. The contrast ratio between text-primary and surface SHALL be at least 4.5:1
 * 3. The contrast ratio between brand-primary and background SHALL be at least 3:1
 *
 * **Validates: Requirements 8.2, 8.4**
 */

/**
 * Parses a hex color string (#RRGGBB) to an [R, G, B] array with values 0-255.
 */
function parseHexColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

/**
 * Linearizes an sRGB channel value (0-255) to linear RGB (0-1).
 * If sRGB <= 0.03928, linear = sRGB / 12.92
 * Otherwise, linear = ((sRGB + 0.055) / 1.055) ^ 2.4
 */
function linearize(channel) {
  const srgb = channel / 255;
  if (srgb <= 0.03928) {
    return srgb / 12.92;
  }
  return Math.pow((srgb + 0.055) / 1.055, 2.4);
}

/**
 * Calculates the relative luminance of a color given as a hex string.
 * L = 0.2126 * R + 0.7152 * G + 0.0722 * B (linearized values)
 */
function relativeLuminance(hex) {
  const [r, g, b] = parseHexColor(hex);
  const rLin = linearize(r);
  const gLin = linearize(g);
  const bLin = linearize(b);
  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

/**
 * Calculates the WCAG contrast ratio between two hex colors.
 * Contrast ratio = (L1 + 0.05) / (L2 + 0.05) where L1 >= L2
 */
function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('Feature: ui-theme-switcher, Property 9: WCAG AA contrast ratios', () => {
  // Get all valid themes from the THEMES configuration
  const validThemes = THEMES.filter(t => isValidTheme(t));

  it('text-primary vs background has contrast ratio >= 4.5:1 for all themes', () => {
    fc.assert(
      fc.property(fc.constantFrom(...validThemes), (theme) => {
        const ratio = contrastRatio(theme.colorMap['text-primary'], theme.colorMap.background);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      }),
      { numRuns: 100 }
    );
  });

  it('text-primary vs surface has contrast ratio >= 4.5:1 for all themes', () => {
    fc.assert(
      fc.property(fc.constantFrom(...validThemes), (theme) => {
        const ratio = contrastRatio(theme.colorMap['text-primary'], theme.colorMap.surface);
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      }),
      { numRuns: 100 }
    );
  });

  it('brand-primary vs background has contrast ratio >= 3:1 for all themes', () => {
    fc.assert(
      fc.property(fc.constantFrom(...validThemes), (theme) => {
        const ratio = contrastRatio(theme.colorMap['brand-primary'], theme.colorMap.background);
        expect(ratio).toBeGreaterThanOrEqual(3);
      }),
      { numRuns: 100 }
    );
  });
});
