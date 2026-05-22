# Requirements Document

## Introduction

This feature adds a password gate to the StartHobby application. Before a user can access the main landing page (index.html) or any other page, they must enter the correct password. Since the application is a static HTML/JS app with no backend, the password and authentication state are managed entirely in the browser using localStorage. This provides a lightweight access barrier rather than cryptographic security.

## Glossary

- **Password_Gate**: A full-screen overlay UI that blocks access to the application content until the correct password is entered.
- **Application**: The StartHobby multi-page HTML application consisting of index.html and all linked pages.
- **Auth_State**: A flag stored in localStorage under the key `authState` with value `"authenticated"` indicating whether the user has successfully authenticated.
- **Configured_Password**: The password value stored in a single JavaScript constant that users must match to gain access.

## Requirements

### Requirement 1: Display Password Gate on Application Load

**User Story:** As the application owner, I want users to see a password prompt before accessing the application, so that only people who know the password can use StartHobby.

#### Acceptance Criteria

1. WHEN index.html loads and localStorage does not contain the key `authState` with value `"authenticated"`, THE Password_Gate SHALL display a full-screen overlay blocking all application content.
2. WHILE the Password_Gate is displayed, THE Application SHALL prevent interaction with any content behind the overlay by blocking both pointer events and keyboard focus from reaching underlying elements.
3. THE Password_Gate SHALL display a password input field (type="password", maximum 128 characters), a submit button labeled "Enter", and an instructional label stating that a password is required to continue.
4. THE Password_Gate SHALL be visually consistent with the existing application design (Inter font, Tailwind CSS styling, brand colors).
5. WHEN index.html loads and localStorage contains the key `authState` with value `"authenticated"`, THE Application SHALL skip the Password_Gate and display application content immediately.

### Requirement 2: Validate Password Entry

**User Story:** As a user, I want to submit a password and gain access if it is correct, so that I can use the StartHobby application.

#### Acceptance Criteria

1. WHEN the user submits the correct password, THE Password_Gate SHALL be dismissed by hiding the gate overlay and the full application content SHALL become visible and interactive.
2. WHEN the user submits the correct password, THE Application SHALL store a value under the localStorage key `authState` set to `"authenticated"` to indicate successful authentication.
3. WHEN the user submits an incorrect password, THE Password_Gate SHALL display an inline error message below the password input field indicating the password is incorrect, and the error message SHALL remain visible until the user modifies the input value or submits again.
4. WHEN the user submits an incorrect password, THE Password_Gate SHALL clear the password input field and retain focus on the input field.
5. WHEN the user presses the Enter key while the password input is focused, THE Password_Gate SHALL submit the password for validation.
6. THE Password_Gate password input field SHALL accept a maximum of 128 characters.

### Requirement 3: Persist Authentication State

**User Story:** As a user, I want to remain authenticated after entering the password once, so that I do not have to re-enter it on every page load or navigation.

#### Acceptance Criteria

1. WHEN index.html loads and Auth_State is already set in localStorage, THE Password_Gate SHALL not be displayed and the application content SHALL be accessible without any overlay or authentication prompt.
2. IF Auth_State is set in localStorage WHEN the user navigates to any page in the Application, THEN THE Application SHALL allow access without displaying the Password_Gate.
3. IF Auth_State is not set when any page other than index.html loads, THEN THE Application SHALL hide all page content and redirect the user to index.html to complete authentication before any application content is rendered.
4. WHILE the Application is checking Auth_State on any page, THE Application SHALL not display page content until the authentication check completes.

### Requirement 4: Password Configuration

**User Story:** As the application owner, I want the password to be configurable in a single location, so that I can change it without editing multiple files.

#### Acceptance Criteria

1. THE Application SHALL read the Configured_Password from a single JavaScript constant defined in exactly one file, and all authentication checks SHALL reference this single constant.
2. THE Application SHALL require the Configured_Password to be a non-empty string between 4 and 128 characters in length.
3. WHEN the Configured_Password value is changed in the configuration constant, THE Application SHALL enforce the new password on all subsequent authentication attempts without requiring changes to any other file.
4. IF the Configured_Password constant is undefined, empty, or contains only whitespace, THEN THE Application SHALL deny all authentication attempts and display an error message indicating that the password is not configured.

### Requirement 5: Logout Capability

**User Story:** As a user, I want to be able to log out of the application, so that I can secure access on a shared device.

#### Acceptance Criteria

1. WHILE Auth_State is set in localStorage, THE Application SHALL display a logout control in the navigation bar on every page, rendered as a button with a text label or icon with an accessible name of "Logout".
2. WHEN the user activates the logout control, THE Application SHALL remove Auth_State from localStorage while preserving all other user data (hobbyUserProfile, coins, streak, savedHobbies, hobbyProgress, unlockedAchievements, avatarHistory).
3. WHEN the user activates the logout control, THE Application SHALL redirect the user to index.html, where the Password_Gate SHALL be displayed requiring re-authentication.
4. IF Auth_State is not set in localStorage, THEN THE Application SHALL NOT display the logout control.

### Requirement 6: Accessibility of Password Gate

**User Story:** As a user with assistive technology, I want the password gate to be accessible, so that I can authenticate regardless of how I interact with the application.

#### Acceptance Criteria

1. THE Password_Gate SHALL associate the password input with a visible label using a `for`/`id` attribute pairing.
2. THE Password_Gate SHALL announce error messages to screen readers using an ARIA live region with `aria-live="assertive"` so that error feedback is communicated immediately.
3. WHEN the Password_Gate is displayed, THE Password_Gate SHALL place keyboard focus on the password input field.
4. THE Password_Gate SHALL be operable using only a keyboard, where the user can navigate between the password input and the submit button using Tab and Shift+Tab, and activate the submit button using Enter or Space.
5. WHILE the Password_Gate is displayed, THE Password_Gate SHALL trap keyboard focus within the overlay so that Tab and Shift+Tab cycle only among the Password_Gate's focusable elements and do not move focus to content behind the overlay.
6. THE Password_Gate overlay SHALL have a `role="dialog"` and an `aria-modal="true"` attribute, and SHALL be labelled with an accessible name via `aria-labelledby` referencing the instructional label.
