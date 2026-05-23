# Implementation Plan: UI Theme Switcher

## Overview

Implement a multi-theme system for the StartHobby application supporting Light, Dark, and Indigo Night themes. The implementation uses CSS custom properties driven by a `data-theme` attribute on `<html>`, with theme definitions in a dedicated file, a theme engine for logic, synchronous initialization to prevent flash, and an accessible Alpine.js-powered switcher UI in the navigation bar.

## Tasks

- [x] 1. Create theme definitions and engine
  - [x] 1.1 Create `themes.js` with theme configuration objects
    - Define the global `THEMES` array with Light, Dark, and Indigo Night theme objects
    - Each theme must have `id`, `name`, and `colorMap` with all 7 required keys (background, surface, text-primary, text-secondary, brand-primary, brand-secondary, border)
    - Define the `REQUIRED_COLOR_KEYS` constant
    - _Requirements: 1.1, 9.1, 9.2_

  - [x] 1.2 Create `theme-engine.js` with theme application logic
    - Implement `isValidTheme(theme)` — validates theme object structure
    - Implement `getValidThemes()` — filters THEMES array to only valid entries
    - Implement `resolveThemeId()` — resolves active theme from localStorage → system preference → 'light' default
    - Implement `applyTheme(themeId)` — sets `data-theme` attribute and CSS custom properties on `<html>`
    - Implement `setTheme(themeId)` — applies theme and persists to localStorage; no-op if already active
    - Implement `getActiveThemeId()` — reads current `data-theme` attribute
    - Use existing `saveToStorage`/`getFromStorage` helpers from `utils.js` for localStorage access
    - Handle localStorage errors gracefully (fall back to 'light')
    - _Requirements: 1.2, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 4.3, 5.3, 5.4, 9.1, 9.4_

  - [x] 1.3 Write property tests for theme validation (Property 5)
    - **Property 5: Theme validation correctness**
    - Test that `isValidTheme` returns true iff object has valid id (1-50 chars), name (1-100 chars), and colorMap with exactly 7 required keys with non-empty string values
    - **Validates: Requirements 9.1**

  - [x] 1.4 Write property tests for theme filtering (Property 6)
    - **Property 6: getValidThemes filtering**
    - Test that `getValidThemes()` returns exactly those objects passing `isValidTheme()`, preserving order
    - **Validates: Requirements 9.3, 9.4**

  - [x] 1.5 Write property tests for theme persistence (Property 1)
    - **Property 1: Theme persistence round-trip**
    - Test that for any valid theme ID, `setTheme(id)` followed by `resolveThemeId()` returns that same ID
    - **Validates: Requirements 2.1, 2.2, 3.3**

  - [x] 1.6 Write property tests for invalid theme fallback (Property 2)
    - **Property 2: Invalid theme ID fallback and cleanup**
    - Test that invalid stored theme IDs cause fallback to 'light' or 'dark' (based on system preference) and removal from localStorage
    - **Validates: Requirements 2.4, 5.4**

  - [x] 1.7 Write property tests for theme application (Property 3)
    - **Property 3: Theme application sets all CSS custom properties**
    - Test that `applyTheme(id)` sets exactly 7 CSS custom properties on document element matching the theme's colorMap
    - **Validates: Requirements 4.1, 4.3**

  - [x] 1.8 Write property tests for setTheme idempotence (Property 4)
    - **Property 4: setTheme idempotence**
    - Test that calling `setTheme(id)` when that theme is already active produces no DOM or localStorage changes
    - **Validates: Requirements 1.5**

- [x] 2. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Integrate theme system into HTML pages
  - [x] 3.1 Extend Tailwind CSS configuration in all pages
    - Update the `tailwind.config` block in the `<head>` of all 8 pages (index.html, discovery.html, my-plan.html, progress.html, avatar.html, about.html, onboarding.html, hobby-detail.html)
    - Add semantic color tokens mapped to CSS custom properties: `surface`, `th-bg`, `th-text`, `th-text-secondary`, `th-border`, and extend `brand.primary`/`brand.secondary`
    - Include fallback values in `var()` for graceful degradation
    - _Requirements: 4.1, 4.3_

  - [x] 3.2 Add theme initialization inline script to all pages
    - Add `<script src="themes.js"></script>` in `<head>` before the inline init script
    - Add synchronous inline script in `<head>` (after themes.js loads) that resolves theme from localStorage → system preference → 'light', sets `data-theme` attribute, and applies CSS custom properties before body renders
    - Ensure the init script handles localStorage errors gracefully
    - _Requirements: 2.2, 3.1, 3.2, 4.2, 5.1, 5.2, 5.3, 5.4_

  - [x] 3.3 Add `theme-engine.js` script tag to all pages
    - Add `<script src="theme-engine.js"></script>` after `themes.js` and before Alpine.js in all 8 pages
    - _Requirements: 9.2_

- [x] 4. Implement theme switcher UI component
  - [x] 4.1 Create the Alpine.js theme switcher component in the navigation bar
    - Implement `themeSwitcher()` Alpine.js component with `open`, `activeTheme`, `themes`, and `focusedIndex` state
    - Add trigger button with sun/moon or palette icon, `aria-label="Change theme"`, and tooltip
    - Render theme selection panel with `role="radiogroup"` and `aria-label="Theme selection"`
    - Each theme option: `role="radio"`, `aria-checked`, color preview swatch (min 16×16px), theme name
    - Active theme indicator (visible border or checkmark)
    - Implement roving tabindex: selected option gets `tabindex="0"`, others get `tabindex="-1"`
    - _Requirements: 1.1, 1.3, 1.4, 6.2, 6.3, 6.4, 6.5, 7.1, 7.3, 7.4_

  - [x] 4.2 Implement keyboard navigation for the theme switcher
    - Arrow Up/Down and Arrow Left/Right to navigate between theme options with circular wrapping
    - Enter/Space to confirm selection
    - Escape to close the panel
    - Tab to move focus into/out of the component
    - Visible focus indicator: 2px solid brand-primary outline with 2px outline-offset
    - _Requirements: 6.1, 6.4_

  - [x] 4.3 Add theme switcher to mobile navigation menu
    - Render the theme switcher trigger within the mobile nav menu for viewports below 768px
    - Ensure same accessibility and functionality as desktop version
    - _Requirements: 7.2_

  - [x] 4.4 Write property tests for keyboard navigation wrapping (Property 7)
    - **Property 7: Keyboard navigation wrapping**
    - Test that Arrow Down/Right moves focus to `(index + 1) % N` and Arrow Up/Left moves to `(index - 1 + N) % N`
    - **Validates: Requirements 6.1**

  - [x] 4.5 Write property tests for ARIA state consistency (Property 8)
    - **Property 8: ARIA and tabindex state consistency**
    - Test that exactly one option has `aria-checked="true"` and `tabindex="0"`, all others have `aria-checked="false"` and `tabindex="-1"`
    - **Validates: Requirements 6.3, 6.5**

- [x] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Apply theme colors to existing page elements
  - [x] 6.1 Update page backgrounds and text colors across all pages
    - Replace hardcoded Tailwind color classes (e.g., `bg-white`, `bg-gray-900`, `text-gray-900`) with semantic theme classes (`bg-th-bg`, `text-th-text`, `text-th-text-secondary`, `bg-surface`)
    - Update card/surface backgrounds to use `bg-surface`
    - Update border colors to use `border-th-border`
    - _Requirements: 4.1, 8.1, 8.3_

  - [x] 6.2 Update brand color references across all pages
    - Replace hardcoded brand color classes (e.g., `bg-indigo-500`, `text-indigo-500`) with `bg-brand-primary`, `text-brand-primary`, `bg-brand-secondary`, `text-brand-secondary`
    - Ensure interactive elements use brand-primary for consistency
    - _Requirements: 4.3, 8.4_

  - [x] 6.3 Write property tests for WCAG contrast ratios (Property 9)
    - **Property 9: WCAG AA contrast ratios**
    - Test that for all themes: text-primary vs background ≥ 4.5:1, text-primary vs surface ≥ 4.5:1, brand-primary vs background ≥ 3:1
    - **Validates: Requirements 8.2, 8.4**

- [x] 7. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The project uses Vitest with jsdom environment and fast-check for property-based testing
- All theme scripts use global variables (no module system) consistent with the existing architecture
- The implementation language is JavaScript, matching the existing codebase

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2"] },
    { "id": 2, "tasks": ["1.3", "1.4", "1.5", "1.6", "1.7", "1.8", "3.1"] },
    { "id": 3, "tasks": ["3.2", "3.3"] },
    { "id": 4, "tasks": ["4.1"] },
    { "id": 5, "tasks": ["4.2", "4.3"] },
    { "id": 6, "tasks": ["4.4", "4.5", "6.1"] },
    { "id": 7, "tasks": ["6.2"] },
    { "id": 8, "tasks": ["6.3"] }
  ]
}
```
