import { observer } from 'mobx-react';
import React from 'react';
import { View } from 'react-native-ui-lib';

import { ArticlesList } from '../../components/ArticlesList';
import { ScreenHeader } from '../../components/ScreenHeader';
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
    <View style={componentStyles.homeScreenSafeArea}>
      <ScreenHeader title='Favorites' showBackButton={true} />

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
    </View>
  );
});
