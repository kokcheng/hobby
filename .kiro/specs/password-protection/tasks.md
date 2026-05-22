# Implementation Plan: Password Protection

## Overview

This plan implements a client-side password gate for the StartHobby application. The approach creates a new `auth.js` module with all authentication logic, adds a password gate overlay to `index.html`, adds auth check redirects to all other pages, and adds a logout button to the navigation bar on every page. Property-based tests validate the core authentication functions.

## Tasks

- [x] 1. Create auth.js module with password constant and auth functions
  - [x] 1.1 Create `auth.js` with APP_PASSWORD constant and core functions
    - Create new file `auth.js` in the project root
    - Define `APP_PASSWORD` constant set to `'starthobby2024'`
    - Implement `isPasswordConfigValid()` — returns true if APP_PASSWORD is a non-empty, non-whitespace string of 4–128 characters
    - Implement `isAuthenticated()` — returns true if localStorage `authState` equals `"authenticated"` (use `getFromStorage` from utils.js)
    - Implement `validatePassword(attempt)` — compares attempt to APP_PASSWORD, returns `{ success: true }` on match (and calls `setAuthenticated()`), or `{ success: false, error: <message> }` on mismatch. If config is invalid, always returns failure with config error message.
    - Implement `setAuthenticated()` — stores `"authenticated"` under `authState` key via `saveToStorage`
    - Implement `logout()` — removes only the `authState` key from localStorage using `localStorage.removeItem('authState')`
    - Implement `runAuthCheck(isIndexPage)` — on index: shows/hides gate overlay; on other pages: redirects to index.html if not authenticated
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 2.1, 2.2, 2.3, 5.2_

  - [ ]* 1.2 Write property tests for auth.js core functions
    - Create `tests/auth.property.test.js`
    - **Property 1: Authentication round-trip** — For any string P equal to APP_PASSWORD, `validatePassword(P)` returns `{ success: true }` and `isAuthenticated()` returns true
    - **Validates: Requirements 2.1, 2.2**
    - **Property 2: Incorrect password rejection** — For any string P not equal to APP_PASSWORD, `validatePassword(P)` returns `{ success: false, error: <message> }` and localStorage is unchanged
    - **Validates: Requirements 2.3**
    - **Property 3: Password configuration validation** — `isPasswordConfigValid()` returns true iff APP_PASSWORD is non-empty, non-whitespace-only, and 4–128 chars
    - **Validates: Requirements 4.2**
    - **Property 4: Invalid configuration denial** — If APP_PASSWORD is undefined/empty/whitespace, `validatePassword(P)` always returns `{ success: false }` for any P
    - **Validates: Requirements 4.4**
    - **Property 5: Logout preserves user data** — After `logout()`, only `authState` is removed; all other localStorage keys retain their values
    - **Validates: Requirements 5.2**

- [x] 2. Add password gate overlay to index.html
  - [x] 2.1 Add password gate overlay HTML and auth script to index.html
    - Add `<script src="auth.js"></script>` before other scripts (after utils.js)
    - Add the password gate overlay `<div id="password-gate">` with `role="dialog"`, `aria-modal="true"`, `aria-labelledby="gate-title"`
    - Include password input with `id="gate-password"`, `type="password"`, `maxlength="128"`, `autocomplete="current-password"`, and associated `<label for="gate-password">`
    - Include submit button labeled "Enter"
    - Include error region `<div id="gate-error" aria-live="assertive">`
    - Style with Tailwind CSS classes matching existing brand design (Inter font, brand-primary colors)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 2.6, 6.1, 6.2, 6.6_

  - [x] 2.2 Implement gate interaction logic on index.html
    - Add inline script or script block that calls `runAuthCheck(true)` on page load
    - Implement form submit handler on `#gate-form`: calls `validatePassword()`, on success hides gate and shows content, on failure displays error in `#gate-error`, clears input, retains focus
    - Implement focus trap: `keydown` listener on `#password-gate` that cycles Tab/Shift+Tab among gate's focusable elements (input and button)
    - On gate display, set initial focus to `#gate-password` input
    - When gate is hidden (authenticated), show logout button and ensure page content is interactive
    - _Requirements: 1.5, 2.1, 2.3, 2.4, 2.5, 6.3, 6.4, 6.5_

- [x] 3. Add auth check and logout button to all non-index pages
  - [x] 3.1 Add auth redirect script to discovery.html, my-plan.html, progress.html, avatar.html, about.html, onboarding.html, hobby-detail.html
    - Add `<script src="auth.js"></script>` to each page (after utils.js script tag)
    - Add inline script that hides body content (`document.body.style.visibility = 'hidden'`), checks `isAuthenticated()`, redirects to `index.html` via `window.location.replace()` if not authenticated, otherwise restores visibility
    - Ensure the auth check runs before page content renders to prevent flash of content
    - _Requirements: 3.2, 3.3, 3.4_

  - [x] 3.2 Add logout button to navigation bar on all pages (index.html and all non-index pages)
    - Add logout button HTML to the nav bar on each page: `<button id="logout-btn" onclick="handleLogout()" aria-label="Logout">` with SVG icon
    - Style with Tailwind CSS: `text-gray-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50`
    - Set `style="display: none;"` by default
    - Implement `handleLogout()` function: calls `logout()` then `window.location.replace('index.html')`
    - Show/hide logout button based on auth state: visible when authenticated, hidden when not
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 4. Checkpoint - Verify core functionality
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 5. Write unit tests for auth UI behavior
  - [ ]* 5.1 Write unit tests for gate display and interaction
    - Create `tests/auth.unit.test.js`
    - Test: gate is shown when authState is missing
    - Test: gate is hidden when authState is present
    - Test: Enter key triggers form submission
    - Test: input cleared and focused after incorrect submission
    - Test: redirect triggered on non-index page when unauthenticated
    - Test: logout button visible when authenticated, hidden when not
    - Test: redirect to index.html after logout
    - _Requirements: 1.1, 1.5, 2.4, 2.5, 3.3, 5.1, 5.3, 5.4_

- [x] 6. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The `auth.js` file must be loaded after `utils.js` on every page since it uses `getFromStorage`/`saveToStorage`
- All pages share the same logout button HTML and `handleLogout()` function defined in `auth.js`

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "2.1"] },
    { "id": 2, "tasks": ["2.2", "3.1"] },
    { "id": 3, "tasks": ["3.2"] },
    { "id": 4, "tasks": ["5.1"] }
  ]
}
```
