import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native-ui-lib';

import { observer } from 'mobx-react';
import { NavioScreen } from 'rn-navio';

import { COLORS } from '../../constants/styles';

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

  const styles = useMemo(() => createStyles(), []);

  return (
    <View style={styles.container} testID={TEST_IDS.FAVORITES_SCREEN}>
      <ScreenHeader />

      <View flex backgroundColor={COLORS.BACKGROUND}>
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

const createStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.BACKGROUND,
    },
  });
