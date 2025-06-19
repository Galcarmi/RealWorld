// Design System Constants for consistent styling across the app

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
  // Padding values
  PADDING_EXTRA_SMALL: 4,
  PADDING_SMALL: 8,
  PADDING_MEDIUM: 12,
  PADDING_LARGE: 16,
  PADDING_EXTRA_LARGE: 20,
  PADDING_XXL: 24,
  PADDING_XXXL: 30,
  PADDING_HUGE: 32,
  PADDING_MASSIVE: 40,

  // Margin values
  MARGIN_TINY: 2,
  MARGIN_SMALL: 6,
  MARGIN_MEDIUM: 15,
  MARGIN_LARGE: 20,
  MARGIN_EXTRA_LARGE: 24,
  MARGIN_XXL: 40,
  MARGIN_HUGE: 70,

  // Hard-coded values found in componentStyles.ts
  MARGIN_TAB: 3,

  // Theme spacings - migrated from src/theme/spacings.ts
  PAGE: 20,
  CARD: 12,
  GRID_GUTTER: 16,

  // Specific semantic spacings
  CARD_PADDING: 16,
  SCREEN_PADDING_HORIZONTAL: 20,
  SCREEN_PADDING_VERTICAL: 30,
  LIST_ITEM_PADDING: 16,
  LIST_CONTENT_PADDING: 32,
  TAB_PADDING_HORIZONTAL: 16,
  TAB_PADDING_VERTICAL: 12,
  BUTTON_PADDING_VERTICAL: 15,
  BUTTON_PADDING_HORIZONTAL: 20,
  HEADER_PADDING_TOP: 20,
  HEADER_PADDING_BOTTOM: 30,
  FORM_SPACING: 24,
  INPUT_SPACING: 40,
} as const;

export const DIMENSIONS = {
  // Common percentages
  WIDTH_FULL: '100%',
  WIDTH_80_PERCENT: '80%',
  WIDTH_50_PERCENT: '50%',
  HEIGHT_25_PERCENT: '25%',

  // Fixed heights
  HEIGHT_60: 60,
  HEIGHT_45: 45,
  HEIGHT_56: 56, // Header height

  // Fixed widths
  WIDTH_70: 70, // Header spacer width

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
