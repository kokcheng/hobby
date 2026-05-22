/**
 * auth.js — Password Protection Module for StartHobby
 *
 * Defines the configured password constant and exposes authentication
 * helper functions. Loaded via <script> tag after utils.js on every page.
 *
 * All functions are global (no ES modules) — same pattern as utils.js.
 */

// ─── Password Configuration ─────────────────────────────────────────────────

/**
 * The single configured password for the application.
 * Change this value to update the password across all pages.
 * Must be a non-empty string between 4 and 128 characters.
 */
var APP_PASSWORD = 'starthobby2024';

// ─── Authentication Functions ────────────────────────────────────────────────

/**
 * Checks if the configured password is valid.
 * @returns {boolean} True if APP_PASSWORD is a non-empty, non-whitespace string of 4-128 chars.
 */
function isPasswordConfigValid() {
  if (typeof APP_PASSWORD !== 'string') return false;
  if (APP_PASSWORD.length < 4 || APP_PASSWORD.length > 128) return false;
  if (APP_PASSWORD.trim().length === 0) return false;
  return true;
}

/**
 * Checks if the user is currently authenticated.
 * @returns {boolean} True if localStorage contains authState = "authenticated".
 */
function isAuthenticated() {
  return getFromStorage('authState', null) === 'authenticated';
}

/**
 * Validates a password attempt against the configured password.
 * If the password config is invalid, always returns failure.
 * On success, stores the authenticated state.
 * @param {string} attempt - The password the user entered.
 * @returns {{ success: boolean, error?: string }}
 */
function validatePassword(attempt) {
  if (!isPasswordConfigValid()) {
    return { success: false, error: 'Password is not configured. Please contact the administrator.' };
  }

  if (attempt === APP_PASSWORD) {
    setAuthenticated();
    return { success: true };
  }

  return { success: false, error: 'Incorrect password. Please try again.' };
}

/**
 * Stores the authenticated state in localStorage.
 */
function setAuthenticated() {
  saveToStorage('authState', 'authenticated');
}

/**
 * Removes only the authState key from localStorage, preserving all other data.
 */
function logout() {
  localStorage.removeItem('authState');
}

/**
 * Handles the logout button click: logs out and redirects to index.html.
 */
function handleLogout() {
  logout();
  window.location.replace('index.html');
}

/**
 * Runs the auth check appropriate for the current page.
 * - On index.html: shows/hides the password gate overlay
 * - On other pages: redirects to index.html if not authenticated
 * @param {boolean} isIndexPage - Whether the current page is index.html
 */
function runAuthCheck(isIndexPage) {
  if (isIndexPage) {
    var gate = document.getElementById('password-gate');
    var logoutBtn = document.getElementById('logout-btn');

    if (isAuthenticated()) {
      // User is authenticated — hide gate, show content
      if (gate) gate.style.display = 'none';
      if (logoutBtn) logoutBtn.style.display = '';
    } else {
      // User is not authenticated — show gate
      if (gate) gate.style.display = '';
      if (logoutBtn) logoutBtn.style.display = 'none';
    }
  } else {
    // Non-index page: redirect if not authenticated
    if (!isAuthenticated()) {
      window.location.replace('index.html');
    } else {
      // Show logout button if authenticated
      var logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) logoutBtn.style.display = '';
      // Restore page visibility
      document.body.style.visibility = 'visible';
    }
  }
}
