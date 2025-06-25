import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native-ui-lib';

import { observer } from 'mobx-react';
import { NavioScreen } from 'rn-navio';

import { COLORS } from '../../constants/styles';

import { ArticlesList, FeedTabs } from '../../components';
import { FEED_TYPES, TEST_IDS } from '../../constants';
import { useTranslation } from '../../hooks/useTranslation';
import { userStore } from '../../store';

import useArticles from './useArticles';

interface HomeScreenProps {}

export const HomeScreen: NavioScreen<HomeScreenProps> = observer(() => {
  const { t } = useTranslation();
  const {
    articles,
    isLoading,
    feedType,
    refreshArticles,
    loadMoreArticles,
    handleGlobalFeedPress,
    handleUserFeedPress,
    handleFavoritePress,
    handleArticlePress,
    handleAuthorPress,
  } = useArticles();

  const styles = useMemo(() => createStyles(), []);

  const renderFeedTabs = () =>
    userStore.isAuthenticated() ? (
      <FeedTabs
        feedType={feedType}
        onGlobalFeedPress={handleGlobalFeedPress}
        onUserFeedPress={handleUserFeedPress}
      />
    ) : null;

  return (
    <View style={styles.container} testID={TEST_IDS.HOME_SCREEN}>
      {renderFeedTabs()}

      <ArticlesList
        articles={articles}
        isLoading={isLoading}
        onRefresh={refreshArticles}
        onLoadMore={loadMoreArticles}
        onArticlePress={handleArticlePress}
        onAuthorPress={handleAuthorPress}
        onFavoritePress={handleFavoritePress}
        emptyMessage={
          feedType === FEED_TYPES.FEED
            ? t('empty.followUsersMessage')
            : t('empty.noArticlesAvailable')
        }
        contextKey='home'
      />
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
