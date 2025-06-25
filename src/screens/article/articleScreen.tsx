import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
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
  const slug = route.params?.slug;

  const { article, onAuthorPress, onDelete, onEdit } = useArticle(slug);

  const styles = useMemo(() => createStyles(), []);

  const isAuthor = useMemo(() => {
    return article?.author?.username === userStore.user?.username;
  }, [article]);

  return (
    <View style={styles.container} testID={TEST_IDS.ARTICLE_SCREEN}>
      {article && (
        <>
          <View style={styles.headerSection}>
            <ArticleHeader
              article={article}
              onAuthorPress={onAuthorPress}
              onDelete={onDelete}
              onEdit={onEdit}
              isAuthor={isAuthor}
            />
          </View>

          <View style={styles.contentSection}>
            <ArticleContent body={article.body} tags={article.tagList} />
          </View>
        </>
      )}
    </View>
  );
});

const createStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.BACKGROUND,
    },
    headerSection: {
      paddingHorizontal: SPACINGS.LARGE,
      paddingVertical: SPACINGS.EXTRA_LARGE,
      backgroundColor: COLORS.SECONDARY,
      flexShrink: 0,
    },
    contentSection: {
      flex: 1,
      padding: SPACINGS.LARGE,
    },
  });
