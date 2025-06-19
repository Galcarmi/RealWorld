import { StyleSheet } from 'react-native';

import {
  SPACINGS,
  DIMENSIONS,
  COMPONENT_DIMENSIONS,
  FONT_WEIGHTS,
  themeColors,
} from '../constants/styles';

export const componentStyles = StyleSheet.create({
  // ArticlesList styles
  articlesListContentContainer: {
    flexGrow: 1,
    paddingBottom: SPACINGS.PADDING_EXTRA_LARGE,
  },

  // FeedTabs styles
  feedTabsActiveTab: {
    borderBottomWidth: DIMENSIONS.BORDER_WIDTH_MEDIUM,
    borderBottomColor: themeColors.primaryColor,
    marginRight: SPACINGS.MARGIN_TAB,
    marginLeft: SPACINGS.MARGIN_TAB,
  },
  feedTabsInactiveTab: {
    borderBottomWidth: 0,
    marginRight: SPACINGS.MARGIN_TAB,
    marginLeft: SPACINGS.MARGIN_TAB,
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
    marginLeft: SPACINGS.MARGIN_SMALL,
    marginBottom: SPACINGS.MARGIN_TINY,
  },

  // NewArticleButton styles
  newArticleButton: {
    borderRadius: COMPONENT_DIMENSIONS.BUTTON_BORDER_RADIUS,
    height: COMPONENT_DIMENSIONS.BUTTON_HEIGHT,
    borderWidth: DIMENSIONS.BORDER_WIDTH_THIN,
    borderColor: themeColors.primaryColor,
    width: DIMENSIONS.WIDTH_50_PERCENT,
  },

  // NewArticleForm styles
  newArticleFormScrollView: {
    flex: 1,
  },
  newArticleFormContentContainer: {
    flexGrow: 1,
    padding: SPACINGS.PADDING_EXTRA_LARGE,
  },
  newArticleFormTitleInput: {
    marginBottom: SPACINGS.FORM_SPACING,
  },
  newArticleFormDescriptionInput: {
    marginBottom: SPACINGS.FORM_SPACING,
  },
  newArticleFormBodyInput: {
    marginBottom: SPACINGS.MARGIN_XXL,
    flex: 1,
  },
  newArticleFormPublishButton: {
    marginTop: 'auto',
    marginBottom: SPACINGS.PADDING_EXTRA_LARGE,
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
    minHeight: COMPONENT_DIMENSIONS.HEADER_MIN_HEIGHT,
  },
  screenHeaderContainer: {
    backgroundColor: themeColors.primaryColor,
  },
  screenHeaderTitle: {
    fontWeight: FONT_WEIGHTS.SEMIBOLD,
  },
  screenHeaderLeftSpacer: {
    width: COMPONENT_DIMENSIONS.HEADER_SPACER_WIDTH,
  },
  screenHeaderRightContainer: {
    width: COMPONENT_DIMENSIONS.HEADER_SPACER_WIDTH,
    alignItems: 'flex-end',
  },
  screenHeaderRightSpacer: {
    width: COMPONENT_DIMENSIONS.HEADER_SPACER_WIDTH,
  },
});
