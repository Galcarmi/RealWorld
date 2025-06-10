import { observer } from 'mobx-react';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native-ui-lib';

import { ArticlesList } from '../../components/ArticlesList';
import { componentStyles } from '../../styles/componentStyles';
import { themeColors } from '../../theme/colors';

import { useFavoriteArticles } from './useFavoriteArticles';

export const FavoritesScreen: React.FC<{}> = observer(() => {
  const {
    articles,
    isLoading,
    refreshArticles,
    loadMoreArticles,
    handleFavoritePress,
  } = useFavoriteArticles();

  return (
    <SafeAreaView style={componentStyles.homeScreenSafeArea}>
      <View flex backgroundColor={themeColors.bgColor}>
        <ArticlesList
          articles={articles}
          isLoading={isLoading}
          onRefresh={refreshArticles}
          onLoadMore={loadMoreArticles}
          onFavoritePress={handleFavoritePress}
          emptyMessage="You haven't favorited any articles yet"
          contextKey='favorites'
        />
      </View>
    </SafeAreaView>
  );
});
