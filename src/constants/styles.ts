// Design System Constants for consistent styling across the app

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

  // Icon sizes (already in app.ts but adding here for styles)
  ICON_SMALL: 16,
  ICON_MEDIUM: 20,
  ICON_LARGE: 24,
  ICON_XLARGE: 32,
} as const;

export const FLEX_VALUES = {
  // Common flex values
  FLEX_1: 1,
  FLEX_0_35: 0.35,
  FLEX_0_65: 0.65,
} as const;

export const LAYOUT_STYLES = {
  // Flex layouts
  CENTER: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ROW_CENTER: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ROW_SPACE_BETWEEN: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  COLUMN_CENTER: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  FLEX_1: {
    flex: 1,
  },

  // Position styles
  ABSOLUTE_FILL: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  // Margins
  MARGIN_AUTO: {
    marginTop: 'auto',
  },
} as const;

export const COMPONENT_DIMENSIONS = {
  // Button dimensions
  BUTTON_HEIGHT: 45,
  BUTTON_BORDER_RADIUS: 25,
  BUTTON_PADDING_VERTICAL: 15,
  BUTTON_PADDING_HORIZONTAL: 20,

  // Input dimensions
  INPUT_HEIGHT: 60,
  INPUT_BORDER_WIDTH: 1,

  // Header dimensions
  HEADER_MIN_HEIGHT: 56,
  HEADER_SPACER_WIDTH: 70,

  // Card dimensions
  CARD_BORDER_RADIUS: 8,
  CARD_PADDING: 16,
  CARD_ELEVATION: 3,
} as const;

export const BACKGROUND_COLORS = {
  TRANSPARENT: 'transparent',
} as const;

export const FONT_WEIGHTS = {
  NORMAL: '400',
  MEDIUM: '500',
  SEMIBOLD: '600',
  BOLD: '700',
} as const;

// UI Components positioning and styling presets
export const UI_PRESETS = {
  // Input field container styles
  INPUT_CONTAINER_80_WIDTH: {
    width: DIMENSIONS.WIDTH_80_PERCENT,
    height: DIMENSIONS.HEIGHT_60,
  },

  // Button container styles
  AUTH_BUTTON_CONTAINER: {
    height: DIMENSIONS.HEIGHT_25_PERCENT,
    width: DIMENSIONS.WIDTH_80_PERCENT,
  },

  // Common view styles
  FULL_WIDTH_CENTER: {
    width: DIMENSIONS.WIDTH_FULL,
    ...LAYOUT_STYLES.CENTER,
  },

  // Screen padding
  SCREEN_HORIZONTAL_PADDING: {
    paddingHorizontal: SPACINGS.SCREEN_PADDING_HORIZONTAL,
  },

  // Form spacing
  FORM_ELEMENT_SPACING: {
    marginBottom: SPACINGS.FORM_SPACING,
  },
} as const;
