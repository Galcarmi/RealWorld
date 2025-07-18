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

  // Tab Icons
  LOGIN_TAB_ICON: 'login-tab-icon',
  REGISTER_TAB_ICON: 'register-tab-icon',
  HOME_TAB_ICON: 'home-tab-icon',
  HOME_MAIN_TAB_ICON: 'home-main-tab-icon',
  FAVORITES_MAIN_TAB_ICON: 'favorites-main-tab-icon',
  PROFILE_MAIN_TAB_ICON: 'profile-main-tab-icon',

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
  ARTICLE_SCREEN: 'article-screen',
  EDIT_ARTICLE_BUTTON: 'edit-article-button',
  FAVORITE_ARTICLE_BUTTON: 'favorite-article-button',
  ARTICLE_TITLE_INPUT: 'article-title-input',
  ARTICLE_DESCRIPTION_INPUT: 'article-description-input',
  ARTICLE_BODY_INPUT: 'article-body-input',
  PUBLISH_ARTICLE_BUTTON: 'publish-article-button',
  NEW_ARTICLE_BUTTON: 'new-article-button',
  DELETE_ARTICLE_BUTTON: 'delete-article-button',

  // Dynamic TestIDs (functions to generate)
  ARTICLE_CARD: (slug: string) => `article-card-${slug}`,
  FAVORITE_BUTTON: (username: string) => `favorite-button-${username}`,
  FOLLOW_BUTTON: 'follow-button',
  UNFOLLOW_BUTTON: 'unfollow-button',
} as const;
