export const API = {
  URI: 'http://node-express-conduit.appspot.com/api',
  ENDPOINTS: {
    USER: '/user',
    ARTICLES: '/articles',
    PROFILES: '/profiles',
    USERS_LOGIN: '/users/login',
    USERS: '/users',
  },
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  DEFAULT_OFFSET: 0,
} as const;

export const VALIDATION = {
  MIN_USERNAME_LENGTH: 3,
  MIN_PASSWORD_LENGTH: 6,
  MAX_INPUT_LENGTH: 30,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

export const FORM_LIMITS = {
  ARTICLE_TITLE_MAX: 100,
  ARTICLE_TITLE_MIN: 1,
  ARTICLE_DESCRIPTION_MAX: 200,
  ARTICLE_DESCRIPTION_MIN: 1,
  ARTICLE_BODY_MAX: 5000,
  ARTICLE_BODY_MIN: 1,
  PROFILE_IMAGE_MAX: 200,
  PROFILE_BIO_MAX: 300,
  PROFILE_EMAIL_MAX: 50,
  INPUT_FIELD_DEFAULT_MAX: 30,
  INPUT_FIELD_DEFAULT_MIN: 6,
} as const;

export const UI = {
  ANIMATION_DURATION: 300,
  DEBOUNCE_TIME: 500,
  MAX_VISIBLE_TAGS: 3,
  LOADING_SIZES: {
    SMALL: 'small' as const,
    LARGE: 'large' as const,
  },
  BORDER_RADIUS: {
    SMALL: 8,
    MEDIUM: 10,
    LARGE: 25,
  },
  ICON_SIZES: {
    SMALL: 16,
    MEDIUM: 20,
    LARGE: 24,
    XLARGE: 32,
    AVATAR_SMALL: 32,
    AVATAR_MEDIUM: 38,
    AVATAR_LARGE: 100,
  },
} as const;

export const TIMEOUTS = {
  DEFAULT_API: 10000,
  LOADING_DELAY: 500,
  RETRY_DELAY: 2000,
  ANIMATION_DELAY: 500,
} as const;

export const FEED_TYPES = {
  GLOBAL: 'global',
  FEED: 'feed',
} as const;

export const STORAGE_KEYS = {
  USER_TOKEN: '@realworld:user_token',
  USER_DATA: '@realworld:user_data',
  THEME_PREFERENCE: '@realworld:theme',
} as const;

export const NAVIGATION_ROUTES = {
  AUTH_TABS: 'AuthTabs',
  MAIN_TABS: 'MainTabs',
  LOGIN: 'Login',
  SIGNUP: 'SignUp',
  HOME: 'Home',
  PROFILE: 'Profile',
  FAVORITES: 'Favorites',
  NEW_ARTICLE: 'NewArticle',
  EDIT_PROFILE: 'EditProfile',
  AUTHOR_PROFILE: 'AuthorProfile',
  SIGN_IN_STACK: 'SignInStack',
  SIGN_UP_STACK: 'SignUpStack',
} as const;

export const SCREEN_TITLES = {
  SIGN_IN: 'Sign In',
  SIGN_UP: 'Sign Up',
  PROFILE: 'Profile',
  EDIT_PROFILE: 'Edit Profile',
  NEW_ARTICLE: 'New Article',
} as const;

export const BUTTON_LABELS = {
  SIGN_IN: 'Sign In',
  SIGN_UP: 'Sign Up',
  UPDATE: 'Update',
  LOG_OUT: 'Log out',
  PUBLISH: 'Publish',
  NEW_ARTICLE: 'New Article',
  FOLLOW: 'Follow',
  UNFOLLOW: 'Unfollow',
  OR: 'Or',
} as const;

export const PLACEHOLDERS = {
  EMAIL: 'Email',
  PASSWORD: 'Password',
  NEW_PASSWORD: 'New password',
  USERNAME: 'Username',
  YOUR_NAME: 'Your name',
  PROFILE_PICTURE_URL: 'URL of profile picture',
  SHORT_BIO: 'A short bio about you',
  YOUR_EMAIL: 'Your email',
  TITLE: 'Title',
  DESCRIPTION: 'Description',
  ARTICLE_TEXT: 'Article text',
} as const;

export const VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Not a valid email',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_TOO_SHORT: 'Password is too short',
  USERNAME_REQUIRED: 'Username is required',
  USERNAME_TOO_SHORT: 'Username is too short',
  TITLE_REQUIRED: 'Title is required',
  DESCRIPTION_REQUIRED: 'Description is required',
  ARTICLE_TEXT_REQUIRED: 'Article text is required',
} as const;

export const EMPTY_MESSAGES = {
  NO_ARTICLES_FOUND: 'No articles found',
  NO_FAVORITE_ARTICLES: 'No favorite articles yet',
  NO_ARTICLES_AVAILABLE: 'No articles available',
  FOLLOW_USERS_MESSAGE: 'Follow some users to see their articles here',
  NO_USER_ARTICLES:
    "No articles yet. Tap 'New Article' to create your first post",
} as const;

export const ERROR_MESSAGES = {
  SOMETHING_WENT_WRONG: 'Something went wrong',
  SOMETHING_WENT_WRONG_TRY_AGAIN: 'Something went wrong, please try again',
  FAILED_TO_FETCH_ARTICLES: 'Failed to fetch articles',
  FAILED_TO_CREATE_ARTICLE: 'Failed to create article',
  FAILED_TO_UPDATE_ARTICLE: 'Failed to update article',
  FAILED_TO_LOAD_ARTICLES: 'Failed to load articles',
  FAILED_TO_LOAD_FAVORITE_ARTICLES: 'Failed to load favorite articles',
  FAILED_TO_FETCH_USER_ARTICLES: 'Failed to fetch user articles',
  FAILED_TO_FETCH_AUTHOR_PROFILE: 'Failed to fetch author profile',
  FAILED_TO_LOAD_AUTHOR_ARTICLES: 'Failed to load author articles',
  FAILED_TO_TOGGLE_FOLLOW_STATUS: 'Failed to toggle follow status',
  FAILED_TO_UPDATE_PROFILE: 'Failed to update profile',
  NAVIGATION_GO_BACK_FAILED: 'Navigation goBack failed:',
} as const;

export const CONTEXT_KEYS = {
  HOME: 'home',
  FAVORITES: 'favorites',
  PROFILE: 'profile',
  AUTHOR_PROFILE: 'author-profile',
} as const;

export const ICON_NAMES = {
  ADD: 'add',
  HEART: 'heart',
  HEART_OUTLINE: 'heart-outline',
  CREATE_OUTLINE: 'create-outline',
  CHECKMARK_CIRCLE: 'checkmark-circle',
  CHECKMARK_SHARP: 'checkmark-sharp',
  CHEVRON_BACK: 'chevron-back',
} as const;

export const KEYBOARD_TYPES = {
  DEFAULT: 'default',
  EMAIL: 'email-address',
  NUMERIC: 'numeric',
} as const;

export const INPUT_PRESETS = {
  UNDERLINE: 'underline',
  OUTLINE: 'outline',
  REQUIRED: 'required',
} as const;

export const DATE_FORMAT = {
  LOCALE: 'en-US',
  OPTIONS: {
    year: 'numeric' as const,
    month: 'short' as const,
    day: 'numeric' as const,
  },
} as const;

export const FEED_TAB_LABELS = {
  FOR_YOU: 'For You',
  FOLLOWING: 'Following',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Navigation Root Types
export const NAVIGATION_ROOT_TYPES = {
  STACKS: 'stacks',
  TABS: 'tabs',
  DRAWERS: 'drawers',
} as const;

// Authentication
export const AUTH = {
  TOKEN_PREFIX: 'Token ',
  HEADER_NAME: 'authorization',
} as const;

// Alert Button Labels
export const ALERT_BUTTONS = {
  OK: 'OK',
  CANCEL: 'Cancel',
  YES: 'Yes',
  NO: 'No',
  CONFIRM: 'Confirm',
} as const;

// Log Levels
export const LOG_LEVELS = {
  LOG: 'log',
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
} as const;

// Log Emojis/Prefixes
export const LOG_PREFIXES = {
  ERROR: '🔴',
  SUCCESS: '🟢',
  REQUEST: '🔵',
  WARNING: '⚠️',
} as const;

// Error Types
export const ERROR_TYPES = {
  NETWORK_ERROR: 'Network Error',
  UNAUTHORIZED: 'Request failed with status code 401',
  GENERIC: 'Error',
} as const;

// HTTP Headers
export const HTTP_HEADERS = {
  CONTENT_TYPE: 'content-type',
  AUTHORIZATION: 'authorization',
  ACCEPT: 'Accept',
} as const;

// Content Types
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
} as const;

// Input Security
export const INPUT_SECURITY = {
  SECURE_TEXT_ENTRY: true,
  INSECURE_TEXT_ENTRY: false,
} as const;

// Auto Capitalize Options
export const AUTO_CAPITALIZE = {
  NONE: 'none',
  SENTENCES: 'sentences',
  WORDS: 'words',
  CHARACTERS: 'characters',
} as const;

// Auto Complete Types
export const AUTO_COMPLETE = {
  OFF: 'off',
  EMAIL: 'email',
  PASSWORD: 'password',
  USERNAME: 'username',
  NAME: 'name',
} as const;

export enum AUTH_SCREEN_TYPE {
  SIGN_IN,
  SIGN_UP,
}
