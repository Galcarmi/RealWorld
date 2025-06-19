import React, { useMemo } from 'react';
import {
  FlatList,
  RefreshControl,
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { themeColors } from '../constants/styles';
import { Article } from '../services/types';

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
  const styles = useMemo(() => createStyles(), []);

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
      <View style={styles.loadingFooter}>
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
      <View style={styles.centerContainer}>
        <ActivityIndicator size='large' color={themeColors.primaryColor} />
      </View>
    );
  };

  const renderEmptyMessage = () => {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
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
      contentContainerStyle={styles.contentContainer}
    />
  );
};

const createStyles = () =>
  StyleSheet.create({
    contentContainer: {
      flexGrow: 1,
      paddingBottom: 20,
    },
    loadingFooter: {
      padding: 16,
      alignItems: 'center',
    },
    centerContainer: {
      flex: 1,
      alignItems: 'center',
      padding: 32,
    },
    emptyText: {
      fontSize: 18,
      color: themeColors.placeholderColor,
      textAlign: 'center',
    },
  });
