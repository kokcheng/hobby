# Requirements Document

## Introduction

The UI Theme Switcher feature allows StartHobby users to select and apply different visual themes across the application. Users can choose between light mode, dark mode, and alternative color schemes. The selected theme persists across page loads and navigation via localStorage, consistent with the application's existing state management approach. The feature integrates with the current static HTML/JS architecture using Tailwind CSS (CDN), Alpine.js, and inline Tailwind configuration.

## Glossary

- **Theme_Switcher**: The UI component that allows users to select and apply a visual theme across all StartHobby pages.
- **Theme_Engine**: The JavaScript module responsible for loading, applying, and persisting theme configurations.
- **Theme**: A named set of visual properties including background colors, text colors, brand colors, and surface colors that define the application's appearance.
- **Active_Theme**: The currently applied theme, stored in localStorage and reflected in the rendered UI.
- **System_Preference**: The operating system or browser-level color scheme preference (light or dark) reported by the `prefers-color-scheme` media query.

## Requirements

### Requirement 1: Theme Selection

**User Story:** As a user, I want to choose from multiple visual themes, so that I can customize the application's appearance to my preference.

#### Acceptance Criteria

1. THE Theme_Switcher SHALL provide at least three selectable themes: "Light", "Dark", and "Indigo Night" (a dark theme with indigo accent tones).
2. WHEN a user selects a theme from the Theme_Switcher, THE Theme_Engine SHALL apply the selected theme to the current page within 100 milliseconds, updating background, text, and brand colors to match the selected theme's color map.
3. THE Theme_Switcher SHALL display the name and a color preview swatch (minimum 16×16 pixels) for each available theme, where the swatch represents the theme's background and brand-primary colors.
4. THE Theme_Switcher SHALL visually indicate which theme is currently active by displaying a visible border or checkmark on the active theme option that is distinguishable from the inactive theme options.
5. IF a user selects the theme that is already active, THEN THE Theme_Switcher SHALL remain in its current state with no visible change or re-application.

### Requirement 2: Theme Persistence

**User Story:** As a user, I want my theme choice to persist across page loads and navigation, so that I do not have to reselect my theme every time I visit the application.

#### Acceptance Criteria

1. WHEN a user selects a theme, THE Theme_Engine SHALL store the selected theme identifier in localStorage using the existing `saveToStorage` helper.
2. WHEN a page loads, THE Theme_Engine SHALL read the stored theme identifier from localStorage and apply the corresponding theme before the page content becomes visible.
3. IF no theme preference is stored in localStorage, THEN THE Theme_Engine SHALL apply the "Light" theme as the default, unless overridden by System_Preference detection as specified in Requirement 3.
4. IF the stored theme identifier does not match any theme defined in the themes configuration, THEN THE Theme_Engine SHALL discard the invalid value and apply the "Light" theme as the default.

### Requirement 3: System Preference Detection

**User Story:** As a user, I want the application to respect my operating system color scheme preference on first visit, so that the initial theme matches my system settings.

#### Acceptance Criteria

1. IF no theme preference is stored in localStorage AND the System_Preference is "dark", THEN THE Theme_Engine SHALL apply the "Dark" theme as the initial default.
2. IF no theme preference is stored in localStorage AND the System_Preference is "light" or unavailable, THEN THE Theme_Engine SHALL apply the "Light" theme as the initial default.
3. WHEN a user explicitly selects a theme via the Theme_Switcher, THE Theme_Engine SHALL use the explicit selection and ignore the System_Preference for subsequent page loads.

### Requirement 4: Theme Application Across All Pages

**User Story:** As a user, I want the selected theme to apply consistently across all pages of the application, so that my experience is visually coherent.

#### Acceptance Criteria

1. THE Theme_Engine SHALL apply the Active_Theme's complete color map (background, surface, text-primary, text-secondary, brand-primary, brand-secondary, and border) to each application page: index.html, discovery.html, my-plan.html, progress.html, avatar.html, about.html, onboarding.html, and hobby-detail.html.
2. WHEN a user navigates between pages, THE Theme_Engine SHALL read the stored theme identifier from localStorage and apply the corresponding theme's Tailwind CSS configuration before the first content paint, so that no frame of incorrectly-themed content is visible.
3. THE Theme_Engine SHALL override the Tailwind CSS configuration's `colors.brand`, background classes, text classes, surface classes, and border classes with the values defined in the Active_Theme's color map.
4. IF the stored theme identifier does not match any theme defined in the themes configuration, THEN THE Theme_Engine SHALL fall back to the "Light" theme and apply it without displaying an error to the user.

### Requirement 5: Flash of Incorrect Theme Prevention

**User Story:** As a user, I want the page to load with the correct theme immediately, so that I do not see a brief flash of the wrong colors.

#### Acceptance Criteria

1. THE Theme_Engine SHALL execute theme application logic in a synchronous blocking script in the `<head>` of each page, before the body renders, and after the theme definitions from `themes.js` are available.
2. WHEN the page loads, THE Theme_Engine SHALL set a data attribute on the `<html>` element that corresponds to the Active_Theme before any content paints, following the resolution order: stored theme from localStorage, then System_Preference, then "Light" as the default.
3. IF the theme application script fails due to a localStorage read error, THEN THE Theme_Engine SHALL fall back to the "Light" theme without displaying an error to the user.
4. IF the stored theme identifier in localStorage does not match any defined theme in the theme configuration, THEN THE Theme_Engine SHALL fall back to the "Light" theme and remove the invalid identifier from localStorage.

### Requirement 6: Theme Switcher Accessibility

**User Story:** As a user who relies on assistive technology, I want the theme switcher to be fully accessible, so that I can change themes using a keyboard or screen reader.

#### Acceptance Criteria

1. THE Theme_Switcher SHALL be operable using keyboard navigation: Tab to move focus into and out of the component, Arrow Up/Arrow Down (or Arrow Left/Arrow Right) to move between theme options within the radiogroup, and Enter or Space to confirm the selection.
2. THE Theme_Switcher SHALL include the following ARIA attributes: `role="radiogroup"` with an `aria-label` of "Theme selection" on the container, and `role="radio"` with `aria-checked` set to "true" or "false" for each theme option.
3. WHEN a user selects a theme option, THE Theme_Switcher SHALL update the `aria-checked` attribute on the newly selected option to "true" and set all other options to "false", enabling screen readers to announce the state change via the radio role semantics.
4. THE Theme_Switcher SHALL maintain a visible focus indicator using a 2px solid brand-primary outline with a 2px outline-offset on the currently focused theme option.
5. THE Theme_Switcher SHALL implement roving tabindex within the radiogroup: the currently selected option SHALL have `tabindex="0"` and all other options SHALL have `tabindex="-1"`, so that Tab moves focus into the group at the selected option.

### Requirement 7: Theme Switcher Placement

**User Story:** As a user, I want to easily find and access the theme switcher, so that I can change themes without searching through the interface.

#### Acceptance Criteria

1. THE Theme_Switcher trigger SHALL be visually present and interactive within the desktop navigation bar (viewport width 768px and above) on all application pages, positioned between the navigation links and the right-side action buttons.
2. WHILE the viewport width is below 768px, THE Theme_Switcher trigger SHALL be visually present and interactive within the mobile navigation menu.
3. THE Theme_Switcher trigger SHALL use an icon (sun/moon or palette icon) with an aria-label of "Change theme" and a visible tooltip displaying "Change theme" on hover or focus.
4. WHEN the user activates the Theme_Switcher trigger (via click, Enter, or Space), THE Theme_Switcher SHALL display the theme selection panel adjacent to the trigger within 100 milliseconds.

### Requirement 8: Dark Theme Color Mapping

**User Story:** As a user, I want the dark theme to provide appropriate contrast and readability, so that I can comfortably use the application in low-light environments.

#### Acceptance Criteria

1. WHILE the "Dark" theme is active, THE Theme_Engine SHALL set the page background to a dark surface color (gray-900 or equivalent) and primary text to a light color (gray-100 or equivalent).
2. WHILE the "Dark" theme is active, THE Theme_Engine SHALL maintain a minimum contrast ratio of 4.5:1 between normal text (below 18pt or below 14pt bold) and its background, and a minimum contrast ratio of 3:1 for large text (18pt+ or 14pt+ bold) and non-text UI components (icons, borders, focus indicators), consistent with WCAG 2.1 AA.
3. WHILE the "Dark" theme is active, THE Theme_Engine SHALL adjust card and surface backgrounds to a slightly lighter dark tone (gray-800 or equivalent) to create a visible distinction from the page background (gray-900).
4. WHILE the "Dark" theme is active, THE Theme_Engine SHALL preserve the brand primary color (#6366f1) for interactive elements and adjust the brand secondary color to maintain a minimum contrast ratio of 4.5:1 against the dark surface background (gray-900 or gray-800).

### Requirement 9: Theme Configuration Structure

**User Story:** As a developer, I want themes defined in a structured configuration object, so that new themes can be added without modifying application logic.

#### Acceptance Criteria

1. THE Theme_Engine SHALL define each theme as a JavaScript object containing: a unique string identifier (1 to 50 characters), a display name (1 to 100 characters), and a color map object with exactly the following keys: background, surface, text-primary, text-secondary, brand-primary, brand-secondary, and border, where each value is a valid CSS color string.
2. THE Theme_Engine SHALL load theme definitions from a dedicated `themes.js` file included via a script tag on each page, exposing the themes configuration array as a global variable accessible to other scripts.
3. WHEN a new theme object is added to the themes configuration array in `themes.js`, THE Theme_Engine SHALL render the new theme as a selectable option in the Theme_Switcher (displaying its name and color preview) without requiring changes to other application files.
4. IF a theme object in the configuration array is missing any required property (identifier, display name, or any color map key), THEN THE Theme_Engine SHALL exclude that theme from the Theme_Switcher and continue loading the remaining valid themes.
