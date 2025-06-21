// Design System Constants for consistent styling across the app

import { Dimensions } from 'react-native';

import { UI } from './app';

// Colors - migrated from src/theme/colors.ts
export const COLORS = {
  PRIMARY: '#116DFF',
  SECONDARY: '#007AFF14',
  TEXT: '#221D23',
  ERROR: '#E63B2E',
  SUCCESS: '#ADC76F',
  WARN: '#FF963C',
  BACKGROUND: '#FFFFFF',
  PLACEHOLDER: '#6E7881',
  GREY: '#6E7881',
  TAB_BAR_ACTIVE_TINT: '#007AFF',
  TAB_BAR_INACTIVE_TINT: '#8E8E93',
  TAB_BAR_BORDER: '#E5E5E7',
  BLACK: '#000000',
  TRANSPARENT: 'transparent',
} as const;

export const TYPOGRAPHY = {
  HEADING: { fontSize: 40, fontFamily: 'WixMadeforText-Regular' },
  SUBHEADING: { fontSize: 28, fontFamily: 'WixMadeforText-Medium' },
  BODY: { fontSize: 18, fontFamily: 'WixMadeforText-Regular' },
  BOLD: { fontSize: 20, fontFamily: 'WixMadeforText-Bold' },
  TITLE: { fontSize: 28, weight: 700, fontFamily: 'WixMadeforText-Bold' },
} as const;

export const FONT_SIZES = {
  LARGE: 22,
  EXTRA_LARGE: 30,
  SMALL: 14,
  X_SMALL: 12,
  MEDIUM: 16,
} as const;

export const SPACINGS = {
  '2_EXTRA_SMALL': 1.5,
  EXTRA_SMALL: 4,
  SMALL: 8,
  MEDIUM: 12,
  LARGE: 16,
  EXTRA_LARGE: 20,
  '2_EXTRA_LARGE': 24,
  '3_EXTRA_LARGE': 30,
  HUGE: 32,
  MASSIVE: 40,
  GIGANTIC: 70,

  PAGE: 20,
  CARD: 12,
  GRID_GUTTER: 16,
  LIST_CONTENT: 32,
  FORM: 24,
  INPUT: 40,
  TAB: 3,
  TAB_VERTICAL: 15,
  HEADER_TOP: 20,
  HEADER_BOTTOM: 30,
  SCREEN_HORIZONTAL: 20,
  SCREEN_VERTICAL: 30,
  BUTTON_VERTICAL: 15,
  BUTTON_HORIZONTAL: 20,
} as const;

export const DIMENSIONS = {
  SCREEN_WIDTH: Dimensions.get('window').width,
  // Common percentages
  WIDTH_FULL: '100%',
  WIDTH_80_PERCENT: '80%',
  WIDTH_50_PERCENT: '50%',
  HEIGHT_25_PERCENT: '25%',

  // Fixed heights
  HEIGHT_60: 60,
  HEIGHT_45: 45,
  HEIGHT_30: 30,
  HEIGHT_56: 56, // Header height

  // Fixed widths
  WIDTH_70: 70, // Header spacer width
  WIDTH_150: 150,

  // Border radius values
  BORDER_RADIUS_SMALL: 8,
  BORDER_RADIUS_MEDIUM: 10,
  BORDER_RADIUS_LARGE: 25,

  // Border widths
  BORDER_WIDTH_THIN: 1,
  BORDER_WIDTH_MEDIUM: 2,

  // Elevation/Shadow
  ELEVATION_LOW: 3,

  // Icon sizes (imported from app.ts for consistency)
  ...UI.ICON_SIZES,
} as const;

export const FONT_WEIGHTS = {
  NORMAL: '400',
  MEDIUM: '500',
  SEMIBOLD: '600',
  BOLD: '700',
} as const;
