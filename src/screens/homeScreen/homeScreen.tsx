import { observer } from 'mobx-react';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, Colors } from 'react-native-ui-lib';

import { ArticlesList } from '../../components/ArticlesList';
import { FeedTabs } from '../../components/FeedTabs';
import { FeedType } from '../../constants/feedTypes';
import { themeColors } from '../../theme/colors';

import useArticles from './useArticles';

interface HomeScreenProps {
  // Define props even if empty initially
}

export const HomeScreen: React.FC<HomeScreenProps> = observer(() => {
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.bgColor }}>
      <View flex backgroundColor={themeColors.bgColor}>
        <FeedTabs
          feedType={feedType}
          onGlobalFeedPress={handleGlobalFeedPress}
          onUserFeedPress={handleUserFeedPress}
        />

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
