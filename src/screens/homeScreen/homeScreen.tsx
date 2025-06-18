import { View } from 'react-native-ui-lib';

import { observer } from 'mobx-react';
import { NavioScreen } from 'rn-navio';

import { FeedType } from '../../constants/feedTypes';
import { themeColors } from '../../theme/colors';

import { componentStyles } from '../../styles/componentStyles';

import { ArticlesList } from '../../components/ArticlesList';
import { FeedTabs } from '../../components/FeedTabs';
import { ScreenHeader } from '../../components/ScreenHeader';
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
    <View style={componentStyles.homeScreenSafeArea} testID='home-screen'>
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
            feedType === FeedType.FEED
              ? 'Follow some users to see their articles here'
              : 'No articles available'
          }
          contextKey='home'
        />
      </View>
    </View>
  );
});
