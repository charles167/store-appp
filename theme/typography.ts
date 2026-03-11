/**
 * Typography System - 2025 Premium Design
 * Clear visual hierarchy with optimal readability
 */

export const typography = {
  // Display sizes - Large headlines
  display: {
    large: {
      fontSize: 57,
      lineHeight: 64,
      fontWeight: '700',
      letterSpacing: -0.5,
    },
    medium: {
      fontSize: 45,
      lineHeight: 52,
      fontWeight: '700',
      letterSpacing: 0,
    },
    small: {
      fontSize: 36,
      lineHeight: 44,
      fontWeight: '700',
      letterSpacing: 0,
    },
  },

  // Headline sizes
  headline: {
    large: {
      fontSize: 32,
      lineHeight: 40,
      fontWeight: '700',
      letterSpacing: 0,
    },
    medium: {
      fontSize: 28,
      lineHeight: 36,
      fontWeight: '700',
      letterSpacing: 0,
    },
    small: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: '700',
      letterSpacing: 0,
    },
  },

  // Title sizes
  title: {
    large: {
      fontSize: 20,
      lineHeight: 28,
      fontWeight: '700',
      letterSpacing: 0.15,
    },
    medium: {
      fontSize: 18,
      lineHeight: 26,
      fontWeight: '600',
      letterSpacing: 0.1,
    },
    small: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600',
      letterSpacing: 0.1,
    },
  },

  // Body text
  body: {
    large: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
      letterSpacing: 0.5,
    },
    medium: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400',
      letterSpacing: 0.25,
    },
    small: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400',
      letterSpacing: 0.4,
    },
  },

  // Label sizes
  label: {
    large: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '500',
      letterSpacing: 0.1,
    },
    medium: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '500',
      letterSpacing: 0.5,
    },
    small: {
      fontSize: 11,
      lineHeight: 16,
      fontWeight: '500',
      letterSpacing: 0.5,
    },
  },
};

/**
 * Typography scale mapping for Tailwind classes
 * Generated from the typography tokens above
 */
export const typographyScale = {
  'text-display-large': 'text-5xl font-bold leading-tight tracking-tighter',
  'text-display-medium': 'text-4xl font-bold leading-tight',
  'text-display-small': 'text-3xl font-bold leading-snug',
  'text-headline-large': 'text-2xl font-bold leading-8',
  'text-headline-medium': 'text-xl font-bold leading-7',
  'text-headline-small': 'text-lg font-bold leading-6',
  'text-title-large': 'text-base font-bold leading-7 tracking-tight',
  'text-title-medium': 'text-base font-semibold leading-6 tracking-tight',
  'text-title-small': 'text-sm font-semibold leading-6 tracking-tight',
  'text-body-large': 'text-base font-normal leading-6',
  'text-body-medium': 'text-sm font-normal leading-5',
  'text-body-small': 'text-xs font-normal leading-4',
  'text-label-large': 'text-sm font-medium leading-5 tracking-tight',
  'text-label-medium': 'text-xs font-medium leading-4 tracking-normal',
  'text-label-small': 'text-xs font-medium leading-4 tracking-normal',
};
