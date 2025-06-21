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
  emptyMessage,
  contextKey,
  containerStyle,
}) => {
  const styles = useMemo(() => createStyles(), []);
  const { t } = useTranslation();

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

  const renderFooter = useCallback(() => {
    if (!isLoading) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size='small' color={COLORS.PRIMARY} />
      </View>
    );
  }, [isLoading, styles.loadingFooter]);

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
  }, [
    articles.length,
    isLoading,
    emptyMessage,
    styles.centerContainer,
    styles.emptyText,
    t,
  ]);

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

const createStyles = () =>
  StyleSheet.create({
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
