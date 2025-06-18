import { View } from 'react-native-ui-lib';

import { observer } from 'mobx-react';
import { NavioScreen } from 'rn-navio';

import { themeColors } from '../../theme/colors';

import { componentStyles } from '../../styles/componentStyles';

import { ArticlesList } from '../../components/ArticlesList';
import { FeedTabs } from '../../components/FeedTabs';
import { ScreenHeader } from '../../components/ScreenHeader';
import { FEED_TYPES, TEST_IDS } from '../../constants';
import { userStore } from '../../store';

import useArticles from './useArticles';

export const HomeScreen: NavioScreen = observer(() => {
  const {
    articles,
    isLoading,
    feedType,
    refreshArticles,
    loadMoreArticles,
    handleGlobalFeedPress,
    handleUserFeedPress,
    handleFavoritePress,
    handleArticlePress,
  } = useArticles();

  const renderFeedTabs = () =>
    userStore.isAuthenticated() ? (
      <FeedTabs
        feedType={feedType}
        onGlobalFeedPress={handleGlobalFeedPress}
        onUserFeedPress={handleUserFeedPress}
      />
    ) : null;

  return (
    <View
      style={componentStyles.homeScreenSafeArea}
      testID={TEST_IDS.HOME_SCREEN}
    >
      <ScreenHeader />

      <View flex backgroundColor={themeColors.bgColor}>
        {renderFeedTabs()}

        <ArticlesList
          articles={articles}
          isLoading={isLoading}
          onRefresh={refreshArticles}
          onLoadMore={loadMoreArticles}
          onArticlePress={handleArticlePress}
          onFavoritePress={handleFavoritePress}
          emptyMessage={
            feedType === FEED_TYPES.FEED
              ? 'Follow some users to see their articles here'
              : 'No articles available'
          }
          contextKey='home'
        />
      </View>
    </View>
  );
});
