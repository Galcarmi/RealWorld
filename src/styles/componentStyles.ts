import { StyleSheet } from 'react-native';

import { themeColors } from '../theme/colors';

export const componentStyles = StyleSheet.create({
  // ArticlesList styles
  articlesListContentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  // FeedTabs styles
  feedTabsActiveTab: {
    borderBottomWidth: 2,
    borderBottomColor: themeColors.primaryColor,
    marginRight: 3,
    marginLeft: 3,
  },
  feedTabsInactiveTab: {
    borderBottomWidth: 0,
    marginRight: 3,
    marginLeft: 3,
  },

  // HomeScreen styles
  homeScreenSafeArea: {
    flex: 1,
    backgroundColor: themeColors.bgColor,
  },

  // InputField styles
  inputFieldFloatingPlaceholder: {
    color: themeColors.placeholderColor,
  },

  // Login/SignUp Button styles
  authButtonLabel: {
    color: themeColors.primaryColor,
  },

  // AuthorHeader styles
  authorFollowingIcon: {
    marginLeft: 6,
    marginBottom: 2,
  },

  // NewArticleButton styles
  newArticleButton: {
    borderRadius: 25,
    height: 45,
    borderWidth: 1,
    borderColor: themeColors.primaryColor,
    width: '50%',
  },

  // NewArticleForm styles
  newArticleFormScrollView: {
    flex: 1,
  },
  newArticleFormContentContainer: {
    flexGrow: 1,
    padding: 20,
  },
  newArticleFormTitleInput: {
    marginBottom: 24,
  },
  newArticleFormDescriptionInput: {
    marginBottom: 24,
  },
  newArticleFormBodyInput: {
    marginBottom: 40,
    flex: 1,
  },
  newArticleFormPublishButton: {
    marginTop: 'auto',
    marginBottom: 20,
  },

  // ProfileHeader styles
  profileHeaderContainer: {
    backgroundColor: themeColors.primaryColor,
  },

  // ProfileScreen styles
  profileScreenHeaderSection: {
    flex: 0.35,
  },
  profileScreenArticlesSection: {
    flex: 0.65,
  },

  // ScreenHeader styles
  screenHeader: {
    minHeight: 56,
  },
  screenHeaderContainer: {
    backgroundColor: themeColors.primaryColor,
  },
  screenHeaderTitle: {
    fontWeight: '600',
  },
  screenHeaderLeftSpacer: {
    width: 70,
  },
  screenHeaderRightContainer: {
    width: 70,
    alignItems: 'flex-end',
  },
  screenHeaderRightSpacer: {
    width: 70,
  },
});
