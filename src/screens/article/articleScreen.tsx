import React, { useMemo } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { TextField, View, Text, Button } from 'react-native-ui-lib';

import { useRoute, RouteProp } from '@react-navigation/native';

import { noop } from 'lodash';
import { observer } from 'mobx-react-lite';
import { NavioScreen } from 'rn-navio';

import { COLORS, DIMENSIONS, SPACINGS } from '../../constants/styles';

import { RootStackParamList } from '../../navigation/types';

import { ArticleHeader, ArticleContent } from '../../components';
import { TEST_IDS } from '../../constants';
import { useTranslation } from '../../hooks/useTranslation';
import { userStore } from '../../store';

import { useArticle } from './useArticle';

type ArticleScreenRouteProp = RouteProp<RootStackParamList, 'Article'>;

interface ArticleScreenProps {}

export const ArticleScreen: NavioScreen<ArticleScreenProps> = observer(() => {
  const route = useRoute<ArticleScreenRouteProp>();
  const slug = route.params?.slug;
  const { t } = useTranslation();
  const { article, onAuthorPress, onDelete, onEdit, comments } =
    useArticle(slug);

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
          <View style={styles.commentSection}>
            <FlatList
              data={comments}
              renderItem={({ item }) => <Text>{item}</Text>}
            />
          </View>
          <View style={styles.commentInputSection}>
            <TextField
              placeholder={t('comments.addComment')}
              multiline
              containerStyle={styles.commentInputContainer}
              fieldStyle={styles.commentInput}
            />
            <View style={styles.commentInputButtonContainer}>
              <Button
                label={t('comments.post')}
                onPress={noop}
                backgroundColor={COLORS.SECONDARY}
                outlineColor={COLORS.PRIMARY}
                color={COLORS.PRIMARY}
                borderRadius={DIMENSIONS.BORDER_RADIUS_LARGE}
                size={'small'}
              />
            </View>
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
    commentSection: {
      padding: SPACINGS.LARGE,
    },
    commentInputSection: {
      padding: SPACINGS.LARGE,
      boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)',
    },
    commentInput: {
      borderWidth: 1,
      borderColor: COLORS.GREY,
      borderRadius: 10,
      padding: SPACINGS.SMALL,
      maxHeight: DIMENSIONS.HEIGHT_60,
    },
    commentInputContainer: {
      paddingVertical: SPACINGS.SMALL,
    },
    commentInputButtonContainer: {
      paddingVertical: SPACINGS.SMALL,
      backgroundColor: COLORS.SECONDARY,
      alignItems: 'flex-end',
      borderBottomLeftRadius: DIMENSIONS.BORDER_RADIUS_LARGE,
      borderBottomRightRadius: DIMENSIONS.BORDER_RADIUS_LARGE,
      paddingHorizontal: SPACINGS.SMALL,
    },
  });
