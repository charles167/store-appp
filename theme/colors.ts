/**
 * Color Tokens - 2025 Premium Design System
 * Apple HIG + Material You inspired color palette
 * Supports Light & Dark modes
 */

export const colors = {
  // Primary Brand Colors
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c3d66',
  },

  // Neutral Colors - for text, backgrounds
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    150: '#f0f0f0',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
    950: '#0f0f0f',
  },

  // Success
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#145231',
  },

  // Warning
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  // Danger/Error
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Info
  info: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c3d66',
  },

  // Semantic Colors
  semantic: {
    background: {
      light: '#ffffff',
      dark: '#121212',
    },
    surface: {
      light: '#f8f9fa',
      dark: '#1e1e1e',
    },
    text: {
      light: '#1a1a1a',
      dark: '#ffffff',
    },
    textSecondary: {
      light: '#666666',
      dark: '#b3b3b3',
    },
    border: {
      light: '#e5e5e5',
      dark: '#303030',
    },
    divider: {
      light: '#f0f0f0',
      dark: '#2a2a2a',
    },
  },

  // Overlay
  overlay: {
    light: 'rgba(0, 0, 0, 0.5)',
    dark: 'rgba(0, 0, 0, 0.7)',
  },
};

/**
 * Light mode color scheme
 */
export const lightColors = {
  primary: colors.primary[600],
  primaryLight: colors.primary[50],
  secondary: colors.neutral[600],
  background: colors.semantic.background.light,
  surface: colors.semantic.surface.light,
  text: colors.semantic.text.light,
  textSecondary: colors.semantic.textSecondary.light,
  border: colors.semantic.border.light,
  divider: colors.semantic.divider.light,
  success: colors.success[600],
  warning: colors.warning[600],
  danger: colors.danger[600],
  info: colors.info[600],
  overlay: colors.overlay.light,
};

/**
 * Dark mode color scheme
 */
export const darkColors = {
  primary: colors.primary[400],
  primaryLight: colors.primary[900],
  secondary: colors.neutral[400],
  background: colors.semantic.background.dark,
  surface: colors.semantic.surface.dark,
  text: colors.semantic.text.dark,
  textSecondary: colors.semantic.textSecondary.dark,
  border: colors.semantic.border.dark,
  divider: colors.semantic.divider.dark,
  success: colors.success[400],
  warning: colors.warning[400],
  danger: colors.danger[400],
  info: colors.info[400],
  overlay: colors.overlay.dark,
};

export type ColorScheme = typeof lightColors;
