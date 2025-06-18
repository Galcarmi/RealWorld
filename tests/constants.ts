export const TEST_TIMEOUTS = {
  DEFAULT: 10000,
  NAVIGATION: 8000,
  ELEMENT_WAIT: 5000,
  API_RESPONSE: 15000,
  ANIMATION: 2000,
  RETRY_DELAY: 500,
} as const;

export const TEST_DATA = {
  VALID_EMAIL: 'test@example.com',
  VALID_PASSWORD: 'password123',
  VALID_USERNAME: 'testuser',
  INVALID_EMAIL: 'invalid-email',
  SHORT_PASSWORD: '123',
  LONG_CONTENT: 'A'.repeat(1000),
  SPECIAL_CHARS: 'Special chars: !@#$%^&*()_+-={}[]|\\:";\'<>?,./',
  MULTILINE_CONTENT: `Line 1
Line 2
Line 3`,
} as const;

export const MOCK_DELAYS = {
  API_RESPONSE: 500,
  LOADING_STATE: 100,
  TRANSITION: 300,
} as const;

export const TEST_SELECTORS = {
  LOADING_ELEMENTS: '[data-testid*="loading"]',
  ERROR_ELEMENTS: '[data-testid*="error"]',
  VALIDATION_ELEMENTS: '[data-testid*="validation"]',
  EMPTY_STATE_ELEMENTS: '[data-testid*="empty"]',
  VISIBLE_ELEMENTS: '[data-testid]:not([style*="display: none"])',
  ARTICLE_CARDS: '[data-testid*="article-card"]',
  INPUT_FIELDS: 'input',
  TEXTAREA_FIELDS: 'textarea',
} as const;

export const CSS_OVERRIDES = {
  DISABLE_ANIMATIONS: `
    *, *:before, *:after {
      animation-duration: 0s !important;
      animation-delay: 0s !important;
      transition-duration: 0s !important;
      transition-delay: 0s !important;
    }
  `,
} as const;

export const TEST_RETRY = {
  MAX_ATTEMPTS: 3,
  NAVIGATION_ATTEMPTS: 3,
  API_ATTEMPTS: 2,
} as const;

export const VISUAL_TEST_CONFIG = {
  VIEWPORT_WIDTH: 1280,
  VIEWPORT_HEIGHT: 720,
  HEADLESS: process.env.HEADLESS === 'true',
  UPDATE_BASELINES: process.env.UPDATE_BASELINES === 'true',
} as const;
