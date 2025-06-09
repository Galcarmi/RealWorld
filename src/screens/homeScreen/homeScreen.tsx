import { observer } from 'mobx-react';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native-ui-lib';

import { ArticlesList } from '../../components/ArticlesList';
import { FeedTabs } from '../../components/FeedTabs';
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
    switchFeedType,
  } = useArticles();

  const handleGlobalFeedPress = () => {
    switchFeedType(FeedType.GLOBAL);
  };

  const handleUserFeedPress = () => {
    switchFeedType(FeedType.FEED);
  };

  const renderFeedTabs = () =>
    userStore.isAuthenticated() ? (
      <FeedTabs
        feedType={feedType}
        onGlobalFeedPress={handleGlobalFeedPress}
        onUserFeedPress={handleUserFeedPress}
      />
    ) : null;

  return (
    <SafeAreaView style={componentStyles.homeScreenSafeArea}>
      <View flex backgroundColor={themeColors.bgColor}>
        {renderFeedTabs()}

        <ArticlesList
          articles={articles}
          isLoading={isLoading}
          onRefresh={refreshArticles}
          onLoadMore={loadMoreArticles}
          emptyMessage={
            feedType === FeedType.FEED
              ? 'Follow some users to see their articles here'
              : 'No articles available'
          }
        />
      </View>
    </SafeAreaView>
  );
});
