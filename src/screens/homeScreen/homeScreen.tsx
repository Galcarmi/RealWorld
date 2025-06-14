import { observer } from 'mobx-react';
import React from 'react';
import { View } from 'react-native-ui-lib';

import { ArticlesList } from '../../components/ArticlesList';
import { ScreenHeader } from '../../components/ScreenHeader';
import { FeedType } from '../../constants/feedTypes';
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
    handleFavoritePress,
    handleArticlePress,
  } = useArticles();

  return (
    <View style={componentStyles.homeScreenSafeArea} testID='home-screen'>
      <ScreenHeader />

      <View flex backgroundColor={themeColors.bgColor}>
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
