export const TEST_IDS = {
  // Auth Screens
  LOGIN_SCREEN: 'login-screen',
  LOGIN_SCREEN_TITLE: 'login-screen-title',
  LOGIN_EMAIL_INPUT: 'login-email-input',
  LOGIN_PASSWORD_INPUT: 'login-password-input',
  LOGIN_SUBMIT_BUTTON: 'login-submit-button',
  LOGIN_SIGNUP_BUTTON: 'login-signup-button',

  REGISTER_SCREEN: 'register-screen',
  SIGNUP_SCREEN_TITLE: 'signup-screen-title',
  SIGNUP_USERNAME_INPUT: 'signup-username-input',
  SIGNUP_EMAIL_INPUT: 'signup-email-input',
  SIGNUP_PASSWORD_INPUT: 'signup-password-input',
  SIGNUP_SUBMIT_BUTTON: 'signup-submit-button',
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
