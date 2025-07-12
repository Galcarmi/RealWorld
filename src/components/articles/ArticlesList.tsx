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

import { COLORS, SPACINGS, TYPOGRAPHY } from '../../constants/styles';

import { useTranslation } from '../../hooks/useTranslation';
import { Article } from '../../services';

import { ArticleCard } from './ArticleCard';

interface ArticlesListProps {
  articles: Article[];
  isLoading: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onArticlePress?: (slug: string) => void;
  onAuthorPress?: (username: string) => void;
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
  onAuthorPress,
  onFavoritePress,
  emptyMessage,
  contextKey,
  containerStyle,
}) => {
  const { t } = useTranslation();

  const createArticleHandlers = useCallback(
    (item: Article) => {
      const handleAuthorPress = () => {
        onAuthorPress?.(item.author.username);
      };

      const handleFavorite = () => {
        onFavoritePress?.(item.slug, item.favorited);
      };

      const handleContentPress = () => {
        onArticlePress?.(item.slug);
      };

      return { handleAuthorPress, handleFavorite, handleContentPress };
    },

    [onArticlePress, onAuthorPress, onFavoritePress]
  );

  const renderArticle = useCallback(
    ({ item }: { item: Article }) => {
      const { handleAuthorPress, handleFavorite, handleContentPress } =
        createArticleHandlers(item);

      return (
        <ArticleCard
          article={item}
          onAuthorPress={handleAuthorPress}
          onFavorite={handleFavorite}
          containerStyle={styles.articleCard}
          onContentPress={handleContentPress}
        />
      );
    },
    [createArticleHandlers]
  );

  const renderFooter = useCallback(() => {
    if (!isLoading) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size='small' color={COLORS.PRIMARY} />
      </View>
    );
  }, [isLoading]);

  const renderEmpty = useCallback(() => {
    const message = emptyMessage || t('empty.noArticlesFound');
    if (articles.length === 0 && !isLoading) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>{message}</Text>
        </View>
      );
    }
    return null;
  }, [articles.length, isLoading, emptyMessage, t]);

  const refreshControl = useMemo(
    () => (
      <RefreshControl
        refreshing={isLoading}
        onRefresh={onRefresh}
        colors={[COLORS.PRIMARY]}
        tintColor={COLORS.PRIMARY}
      />
    ),
    [isLoading, onRefresh]
  );

  return (
    <View style={containerStyle}>
      <FlatList
        data={articles}
        renderItem={renderArticle}
        keyExtractor={item => `${contextKey}-${item.slug}`}
        refreshControl={refreshControl}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingFooter: {
    padding: SPACINGS.LARGE,
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACINGS.LIST_CONTENT,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.BODY.fontSize,
    color: COLORS.PLACEHOLDER,
    textAlign: 'center',
  },
  articleCard: {
    marginBottom: SPACINGS['2_EXTRA_SMALL'],
    borderRadius: 0,
    padding: SPACINGS.LARGE,
  },
});
