// Legacy exports (keeping for backward compatibility)
export { API_URI } from './api';
export { FeedType } from './feedTypes';
export { PAGINATION, VALIDATION, UI } from './pagination';

// New organized exports
export { TEST_IDS } from './testIds';
export {
  API,
  PAGINATION as APP_PAGINATION,
  VALIDATION as APP_VALIDATION,
  FORM_LIMITS,
  UI as APP_UI,
  TIMEOUTS,
  FEED_TYPES,
  STORAGE_KEYS,
  NAVIGATION_ROUTES,
  SCREEN_TITLES,
  BUTTON_LABELS,
  PLACEHOLDERS,
  VALIDATION_MESSAGES,
  EMPTY_MESSAGES,
  ERROR_MESSAGES,
  CONTEXT_KEYS,
  ICON_NAMES,
  KEYBOARD_TYPES,
  INPUT_PRESETS,
  DATE_FORMAT,
  FEED_TAB_LABELS,
} from './app';

// Export styles constants
export * from './styles';
