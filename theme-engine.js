/**
 * theme-engine.js — Theme Application Logic for StartHobby UI Theme Switcher
 *
 * Provides global functions for theme validation, resolution, application,
 * and persistence. Depends on:
 * - themes.js (THEMES array, REQUIRED_COLOR_KEYS constant)
 * - utils.js (saveToStorage, getFromStorage helpers)
 *
 * Loaded via <script> tag after themes.js and utils.js.
 */

// ─── localStorage Key ────────────────────────────────────────────────────────

var THEME_STORAGE_KEY = 'sh_theme';

// ─── Theme Validation ────────────────────────────────────────────────────────

/**
 * Validates a theme object has all required properties with correct types and constraints.
 * @param {*} theme - Theme object to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
function isValidTheme(theme) {
  if (!theme || typeof theme !== 'object') {
    return false;
  }

  // Validate id: string, 1-50 characters
  if (typeof theme.id !== 'string' || theme.id.length < 1 || theme.id.length > 50) {
    return false;
  }

  // Validate name: string, 1-100 characters
  if (typeof theme.name !== 'string' || theme.name.length < 1 || theme.name.length > 100) {
    return false;
  }

  // Validate colorMap: object with exactly 7 required keys
  if (!theme.colorMap || typeof theme.colorMap !== 'object') {
    return false;
  }

  var colorMapKeys = Object.keys(theme.colorMap);
  if (colorMapKeys.length !== REQUIRED_COLOR_KEYS.length) {
    return false;
  }

  for (var i = 0; i < REQUIRED_COLOR_KEYS.length; i++) {
    var key = REQUIRED_COLOR_KEYS[i];
    if (typeof theme.colorMap[key] !== 'string' || theme.colorMap[key].length === 0) {
      return false;
    }
  }

  return true;
}

// ─── Theme Filtering ─────────────────────────────────────────────────────────

/**
 * Returns the array of valid themes from the THEMES global,
 * filtering out any malformed entries.
 * @returns {Array} Array of valid theme objects.
 */
function getValidThemes() {
  if (typeof THEMES === 'undefined' || !Array.isArray(THEMES)) {
    return [];
  }

  return THEMES.filter(function (theme) {
    return isValidTheme(theme);
  });
}

// ─── Theme Resolution ────────────────────────────────────────────────────────

/**
 * Resolves the active theme ID using the priority:
 * 1. Stored value in localStorage (if valid theme ID)
 * 2. System preference (prefers-color-scheme: dark → 'dark')
 * 3. Default: 'light'
 *
 * If stored value is invalid (not matching any valid theme), removes it from localStorage.
 * @returns {string} The resolved theme ID.
 */
function resolveThemeId() {
  var validThemes = getValidThemes();
  var validIds = validThemes.map(function (t) { return t.id; });

  // Try stored value from localStorage
  var stored = getFromStorage(THEME_STORAGE_KEY, null);

  if (stored !== null) {
    if (validIds.indexOf(stored) !== -1) {
      return stored;
    }
    // Invalid stored value — remove it
    try {
      localStorage.removeItem(THEME_STORAGE_KEY);
    } catch (e) {
      // Ignore localStorage errors
    }
  }

  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  // Default
  return 'light';
}

// ─── Theme Application ───────────────────────────────────────────────────────

/**
 * Applies a theme by ID: sets data-theme attribute on <html> and
 * updates CSS custom properties for all 7 color map keys.
 * Falls back to 'light' theme if the provided themeId is not found.
 * @param {string} themeId - The theme identifier to apply.
 */
function applyTheme(themeId) {
  var validThemes = getValidThemes();
  var theme = null;

  for (var i = 0; i < validThemes.length; i++) {
    if (validThemes[i].id === themeId) {
      theme = validThemes[i];
      break;
    }
  }

  // Fall back to 'light' if theme not found
  if (!theme) {
    for (var j = 0; j < validThemes.length; j++) {
      if (validThemes[j].id === 'light') {
        theme = validThemes[j];
        break;
      }
    }
    themeId = 'light';
  }

  // Set data-theme attribute
  document.documentElement.setAttribute('data-theme', themeId);

  // Set CSS custom properties
  if (theme && theme.colorMap) {
    for (var k = 0; k < REQUIRED_COLOR_KEYS.length; k++) {
      var key = REQUIRED_COLOR_KEYS[k];
      document.documentElement.style.setProperty('--theme-' + key, theme.colorMap[key]);
    }
  }
}

// ─── Theme Setting ───────────────────────────────────────────────────────────

/**
 * Sets the active theme: applies it and persists to localStorage.
 * If themeId is already active, does nothing (idempotent).
 * @param {string} themeId - The theme identifier to set.
 */
function setTheme(themeId) {
  // No-op if already active
  if (getActiveThemeId() === themeId) {
    return;
  }

  applyTheme(themeId);
  saveToStorage(THEME_STORAGE_KEY, themeId);
}

// ─── Active Theme Query ──────────────────────────────────────────────────────

/**
 * Returns the currently active theme ID from the <html> data-theme attribute.
 * @returns {string} The active theme ID, or empty string if not set.
 */
function getActiveThemeId() {
  return document.documentElement.getAttribute('data-theme') || '';
}
