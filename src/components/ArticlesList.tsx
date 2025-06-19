import React from 'react';
import { FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { View, Text } from 'react-native-ui-lib';

import { themeColors } from '../constants/styles';
import { Article } from '../services/types';
import { componentStyles } from '../styles/componentStyles';

import { ArticleCard } from './ArticleCard';

interface ArticlesListProps {
  articles: Article[];
  isLoading: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onArticlePress?: (slug: string) => void;
  onFavoritePress?: (slug: string, favorited: boolean) => void;
  emptyMessage?: string;
  contextKey: string;
}

export const ArticlesList: React.FC<ArticlesListProps> = ({
  articles,
  isLoading,
  onRefresh,
  onLoadMore,
  onArticlePress,
  onFavoritePress,
  emptyMessage = 'No articles found',
  contextKey,
}) => {
  const createArticleHandlers = (item: Article) => {
    const handlePress = () => {
      onArticlePress?.(item.slug);
    };

    const handleFavorite = () => {
      onFavoritePress?.(item.slug, item.favorited);
    };

    return { handlePress, handleFavorite };
  };

  const renderArticle = ({ item }: { item: Article }) => {
    const { handlePress, handleFavorite } = createArticleHandlers(item);

    return (
      <ArticleCard
        article={item}
        onPress={handlePress}
        onFavorite={handleFavorite}
      />
    );
  };

  const renderLoadingFooter = () => {
    return (
      <View padding-16 center>
        <ActivityIndicator size='small' color={themeColors.primaryColor} />
      </View>
    );
  };

  const renderFooter = () => {
    if (!isLoading) return null;
    return renderLoadingFooter();
  };

  const renderLoadingIndicator = () => {
    return (
      <View flex center padding-32>
        <ActivityIndicator size='large' color={themeColors.primaryColor} />
      </View>
    );
  };

  const renderEmptyMessage = () => {
    return (
      <View flex center padding-32>
        <Text text60 color={themeColors.placeholderColor} center>
          {emptyMessage}
        </Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (articles.length === 0 && isLoading) {
      return renderLoadingIndicator();
    }
    return renderEmptyMessage();
  };

  const createRefreshControl = () => {
    return (
      <RefreshControl
        refreshing={isLoading && articles.length === 0}
        onRefresh={onRefresh}
        colors={[themeColors.primaryColor]}
        tintColor={themeColors.primaryColor}
      />
    );
  };

  return (
    <FlatList
      data={articles}
      renderItem={renderArticle}
      keyExtractor={item => `${contextKey}-${item.slug}`}
      refreshControl={createRefreshControl()}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.1}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={componentStyles.articlesListContentContainer}
    />
  );
};
