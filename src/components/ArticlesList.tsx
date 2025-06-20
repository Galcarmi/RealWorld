import React, { useCallback, useMemo } from 'react';
import {
  FlatList,
  RefreshControl,
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { COLORS, SPACINGS, TYPOGRAPHY } from '../constants/styles';
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
  containerStyle?: StyleProp<ViewStyle>;
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
  containerStyle,
}) => {
  const styles = useMemo(() => createStyles(), []);

  const createArticleHandlers = useCallback(
    (item: Article) => {
      const handlePress = () => {
        onArticlePress?.(item.slug);
      };

      const handleFavorite = () => {
        onFavoritePress?.(item.slug, item.favorited);
      };

      return { handlePress, handleFavorite };
    },
    [onArticlePress, onFavoritePress]
  );

  const renderArticle = useCallback(
    ({ item }: { item: Article }) => {
      const { handlePress, handleFavorite } = createArticleHandlers(item);

      return (
        <ArticleCard
          article={item}
          onPress={handlePress}
          onFavorite={handleFavorite}
          containerStyle={styles.articleCard}
        />
      );
    },
    [createArticleHandlers, styles.articleCard]
  );

  const renderLoadingFooter = useCallback(() => {
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size='small' color={COLORS.PRIMARY} />
      </View>
    );
  }, [styles.loadingFooter]);

  const renderFooter = useCallback(() => {
    if (!isLoading) return null;
    return renderLoadingFooter();
  }, [isLoading, renderLoadingFooter]);

  const renderLoadingIndicator = useCallback(() => {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size='large' color={COLORS.PRIMARY} />
      </View>
    );
  }, [styles.centerContainer]);

  const renderEmptyMessage = useCallback(() => {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }, [styles.centerContainer, styles.emptyText, emptyMessage]);

  const renderEmpty = useCallback(() => {
    if (articles.length === 0 && isLoading) {
      return renderLoadingIndicator();
    }
    return renderEmptyMessage();
  }, [articles.length, isLoading, renderEmptyMessage, renderLoadingIndicator]);

  const createRefreshControl = useCallback(() => {
    return (
      <RefreshControl
        refreshing={isLoading && articles.length === 0}
        onRefresh={onRefresh}
        colors={[COLORS.PRIMARY]}
        tintColor={COLORS.PRIMARY}
      />
    );
  }, [isLoading, articles.length, onRefresh]);

  return (
    <View style={containerStyle}>
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
      />
    </View>
  );
};

const createStyles = () =>
  StyleSheet.create({
    loadingFooter: {
      padding: SPACINGS.PADDING_LARGE,
      alignItems: 'center',
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: SPACINGS.LIST_CONTENT_PADDING,
    },
    emptyText: {
      fontSize: TYPOGRAPHY.BODY.fontSize,
      color: COLORS.PLACEHOLDER,
      textAlign: 'center',
    },
    articleCard: {
      marginBottom: SPACINGS.PADDING_TINY,
      borderRadius: 0,
      padding: SPACINGS.MARGIN_LARGE,
    },
  });
