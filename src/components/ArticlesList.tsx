import React from 'react';
import { FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { View, Text } from 'react-native-ui-lib';

import { Article } from '../services/types';
import { componentStyles } from '../styles/componentStyles';
import { themeColors } from '../theme/colors';

import { ArticleCard } from './ArticleCard';

interface ArticlesListProps {
  articles: Article[];
  isLoading: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onArticlePress?: (slug: string) => void;
  onFavoritePress?: (slug: string, favorited: boolean) => void;
  emptyMessage?: string;
}

export const ArticlesList: React.FC<ArticlesListProps> = ({
  articles,
  isLoading,
  onRefresh,
  onLoadMore,
  onArticlePress,
  onFavoritePress,
  emptyMessage = 'No articles found',
}) => {
  const renderArticle = ({ item }: { item: Article }) => {
    const handlePress = () => {
      onArticlePress?.(item.slug);
    };

    const handleFavorite = () => {
      onFavoritePress?.(item.slug, item.favorited);
    };

    return (
      <ArticleCard
        article={item}
        onPress={handlePress}
        onFavorite={handleFavorite}
      />
    );
  };

  const renderFooter = () => {
    if (!isLoading) return null;

    return (
      <View padding-16 center>
        <ActivityIndicator size='small' color={themeColors.primaryColor} />
      </View>
    );
  };

  const renderEmpty = () => (
    <View flex center padding-32>
      <Text text60 color={themeColors.placeholderColor} center>
        {emptyMessage}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={articles}
      renderItem={renderArticle}
      keyExtractor={item => item.slug}
      refreshControl={
        <RefreshControl
          refreshing={isLoading && articles.length === 0}
          onRefresh={onRefresh}
          colors={[themeColors.primaryColor]}
          tintColor={themeColors.primaryColor}
        />
      }
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.1}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={componentStyles.articlesListContentContainer}
    />
  );
};
