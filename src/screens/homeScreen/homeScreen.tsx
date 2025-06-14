import { observer } from 'mobx-react';
import React from 'react';
import { View } from 'react-native-ui-lib';

import { ArticlesList } from '../../components/ArticlesList';
import { FeedTabs } from '../../components/FeedTabs';
import { ScreenHeader } from '../../components/ScreenHeader';
import { FeedType } from '../../constants/feedTypes';
import { userStore } from '../../store';
import { componentStyles } from '../../styles/componentStyles';
import { themeColors } from '../../theme/colors';

import useArticles from './useArticles';

export const HomeScreen: React.FC<{}> = observer(() => {
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
