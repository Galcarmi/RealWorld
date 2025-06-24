import React, { useMemo } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { View } from 'react-native-ui-lib';

import { useRoute, RouteProp } from '@react-navigation/native';

import { observer } from 'mobx-react-lite';
import { NavioScreen } from 'rn-navio';

import { COLORS, SPACINGS } from '../../constants/styles';

import { RootStackParamList } from '../../navigation/types';

import { ArticleHeader, ArticleContent } from '../../components';
import { TEST_IDS } from '../../constants';
import { userStore } from '../../store';

import { useArticle } from './useArticle';

type ArticleScreenRouteProp = RouteProp<RootStackParamList, 'Article'>;

interface ArticleScreenProps {}

export const ArticleScreen: NavioScreen<ArticleScreenProps> = observer(() => {
  const route = useRoute<ArticleScreenRouteProp>();
  const slug = route.params?.slug || '';

  const { article, isLoading, onAuthorPress, onDelete } = useArticle(slug);

  const styles = useMemo(() => createStyles(), []);

  const refreshControl = useMemo(
    () => (
      <RefreshControl
        refreshing={isLoading}
        colors={[COLORS.PRIMARY]}
        tintColor={COLORS.PRIMARY}
      />
    ),
    [isLoading]
  );

  const isAuthor = useMemo(() => {
    return article?.author?.username === userStore.user?.username;
  }, [article]);

  return (
    <View style={styles.container} testID={TEST_IDS.ARTICLE_SCREEN}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
      >
        {article && (
          <>
            <ArticleHeader
              article={article}
              onAuthorPress={onAuthorPress}
              onDelete={onDelete}
              containerStyle={styles.headerSection}
              isAuthor={isAuthor}
            />

            <View style={styles.contentSection}>
              <ArticleContent body={article.body} tags={article.tagList} />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
});

const createStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.BACKGROUND,
    },
    scrollView: {
      flex: 1,
    },
    headerSection: {
      padding: SPACINGS.LARGE,
      backgroundColor: COLORS.SECONDARY,
    },
    contentSection: {
      flex: 1,
      padding: SPACINGS.LARGE,
    },
  });
