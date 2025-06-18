export const API = {
  URI: 'http://node-express-conduit.appspot.com/api',
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
} as const;
