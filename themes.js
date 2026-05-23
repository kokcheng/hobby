/**
 * themes.js — Theme Definitions for StartHobby UI Theme Switcher
 *
 * Exports global constants (no module system):
 * - THEMES: Array of theme configuration objects (Light, Dark, Indigo Night)
 * - REQUIRED_COLOR_KEYS: Array of required color map keys for theme validation
 *
 * Each theme object contains:
 * - id: Unique string identifier (1-50 chars)
 * - name: Human-readable display name (1-100 chars)
 * - colorMap: Object with exactly 7 color keys mapping to valid CSS color strings
 *
 * Loaded via <script> tag in <head> before theme-engine.js and other modules.
 */

// ─── Required Color Map Keys ─────────────────────────────────────────────────

const REQUIRED_COLOR_KEYS = [
  'background', 'surface', 'text-primary', 'text-secondary',
  'brand-primary', 'brand-secondary', 'border'
];

// ─── Theme Definitions ───────────────────────────────────────────────────────

const THEMES = [
  {
    id: 'light',
    name: 'Light',
    colorMap: {
      background: '#ffffff',
      surface: '#f9fafb',
      'text-primary': '#111827',
      'text-secondary': '#6b7280',
      'brand-primary': '#6366f1',
      'brand-secondary': '#10b981',
      border: '#e5e7eb'
    }
  },
  {
    id: 'dark',
    name: 'Dark',
    colorMap: {
      background: '#111827',
      surface: '#1f2937',
      'text-primary': '#f3f4f6',
      'text-secondary': '#9ca3af',
      'brand-primary': '#6366f1',
      'brand-secondary': '#34d399',
      border: '#374151'
    }
  },
  {
    id: 'indigo-night',
    name: 'Indigo Night',
    colorMap: {
      background: '#1e1b4b',
      surface: '#312e81',
      'text-primary': '#e0e7ff',
      'text-secondary': '#a5b4fc',
      'brand-primary': '#818cf8',
      'brand-secondary': '#34d399',
      border: '#4338ca'
    }
  }
];
