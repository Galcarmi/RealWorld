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

export const TEST_IDS = {
  SIGNIN_SCREEN: 'signin-screen',
  SIGNUP_SCREEN: 'signup-screen',
  AUTH_SCREEN_TITLE: 'auth-screen-title',
  AUTH_EMAIL_INPUT: 'auth-email-input',
  AUTH_PASSWORD_INPUT: 'auth-password-input',
  AUTH_USERNAME_INPUT: 'auth-username-input',
  AUTH_SUBMIT_BUTTON: 'auth-submit-button',
  AUTH_SIGNUP_BUTTON: 'auth-signup-button',
  AUTH_SIGNIN_BUTTON: 'auth-signin-button',
  SIGNUP_SIGNIN_BUTTON: 'signup-signin-button',

  // Main Screens
  HOME_SCREEN: 'home-screen',
  PROFILE_SCREEN: 'profile-screen',
  FAVORITES_SCREEN: 'favorites-screen',
  AUTHOR_PROFILE_SCREEN: 'author-profile-screen',

  // Profile Management
  EDIT_PROFILE_SCREEN: 'edit-profile-screen',
  EDIT_PROFILE_IMAGE_INPUT: 'edit-profile-image-input',
  EDIT_PROFILE_USERNAME_INPUT: 'edit-profile-username-input',
  EDIT_PROFILE_BIO_INPUT: 'edit-profile-bio-input',
  EDIT_PROFILE_EMAIL_INPUT: 'edit-profile-email-input',
  EDIT_PROFILE_PASSWORD_INPUT: 'edit-profile-password-input',
  EDIT_PROFILE_UPDATE_BUTTON: 'edit-profile-update-button',
  EDIT_PROFILE_LOGOUT_BUTTON: 'edit-profile-logout-button',
  EDIT_PROFILE_BUTTON: 'edit-profile-button',

  // Articles
  NEW_ARTICLE_SCREEN: 'new-article-screen',
  ARTICLE_TITLE_INPUT: 'article-title-input',
  ARTICLE_DESCRIPTION_INPUT: 'article-description-input',
  ARTICLE_BODY_INPUT: 'article-body-input',
  PUBLISH_ARTICLE_BUTTON: 'publish-article-button',
  NEW_ARTICLE_BUTTON: 'new-article-button',

  // Dynamic TestIDs (functions to generate)
  ARTICLE_CARD: (slug: string) => `article-card-${slug}`,
  FAVORITE_BUTTON: (username: string) => `favorite-button-${username}`,
  FOLLOW_BUTTON: 'follow-button',
  UNFOLLOW_BUTTON: 'unfollow-button',
} as const;
