import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native-ui-lib';

import { observer } from 'mobx-react';
import { NavioScreen } from 'rn-navio';

import { COLORS } from '../../constants/styles';

import { ArticlesList } from '../../components';
import { TEST_IDS } from '../../constants';
import { useTranslation } from '../../hooks/useTranslation';

import { useFavoriteArticles } from './useFavoriteArticles';

export const FavoritesScreen: NavioScreen = observer(() => {
  const { t } = useTranslation();
  const {
    articles,
    isLoading,
    loadMoreArticles,
    refreshArticles,
    handleFavoritePress,
    handleArticlePress,
    handleAuthorPress,
  } = useFavoriteArticles();

  const styles = useMemo(() => createStyles(), []);

  return (
    <View style={styles.container} testID={TEST_IDS.FAVORITES_SCREEN}>
      <View flex backgroundColor={COLORS.BACKGROUND}>
        <ArticlesList
          articles={articles}
          isLoading={isLoading}
          onRefresh={refreshArticles}
          onLoadMore={loadMoreArticles}
          onArticlePress={handleArticlePress}
          onAuthorPress={handleAuthorPress}
          onFavoritePress={handleFavoritePress}
          emptyMessage={t('empty.noFavoriteArticles')}
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
