import React from 'react';
import { View } from 'react-native-ui-lib';

import { observer } from 'mobx-react';
import { NavioScreen } from 'rn-navio';

import { themeColors } from '../../theme/colors';

import { componentStyles } from '../../styles/componentStyles';

import { ArticlesList } from '../../components/ArticlesList';
import { ScreenHeader } from '../../components/ScreenHeader';
import { TEST_IDS } from '../../constants';

import { useFavoriteArticles } from './useFavoriteArticles';

export const FavoritesScreen: NavioScreen = observer(() => {
  const {
    articles,
    isLoading,
    loadMoreArticles,
    refreshArticles,
    handleFavoritePress,
    handleArticlePress,
  } = useFavoriteArticles();

  return (
    <View
      style={componentStyles.homeScreenSafeArea}
      testID={TEST_IDS.FAVORITES_SCREEN}
    >
      <ScreenHeader />

      <View flex backgroundColor={themeColors.bgColor}>
        <ArticlesList
          articles={articles}
          isLoading={isLoading}
          onRefresh={refreshArticles}
          onLoadMore={loadMoreArticles}
          onArticlePress={handleArticlePress}
          onFavoritePress={handleFavoritePress}
          emptyMessage='No favorite articles yet'
          contextKey='favorites'
        />
      </View>
    </View>
  );
});
