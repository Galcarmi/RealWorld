import React, { useMemo, useCallback } from 'react';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { TextField, View, Button } from 'react-native-ui-lib';

import { useRoute, RouteProp } from '@react-navigation/native';

import { observer } from 'mobx-react-lite';
import { NavioScreen } from 'rn-navio';

import { COLORS, DIMENSIONS, SPACINGS } from '../../constants/styles';

import { RootStackParamList } from '../../navigation/types';

import { ArticleHeader, ArticleContent, CommentItem } from '../../components';
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
  const {
    article,
    onAuthorPress,
    onDelete,
    onEdit,
    comments,
    createComment,
    isCreatingComment,
    commentText,
    setCommentText,
    isLoading,
  } = useArticle(slug);

  const isAuthor = useMemo(() => {
    return article?.author?.username === userStore.user?.username;
  }, [article]);

  const handlePostComment = useCallback(async () => {
    if (!commentText.trim() || isCreatingComment) return;

    await createComment(commentText);
  }, [commentText, createComment, isCreatingComment]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={COLORS.PRIMARY} />
      </View>
    );
  }
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

          <View style={styles.bodySection}>
            <View style={styles.contentSection}>
              <ArticleContent body={article.body} tags={article.tagList} />
            </View>
            <View style={styles.commentSection}>
              <FlatList
                data={comments}
                renderItem={({ item }) => <CommentItem comment={item} />}
                keyExtractor={item => item.id.toString()}
                showsVerticalScrollIndicator={false}
              />
            </View>
            <View style={styles.commentInputSection}>
              <TextField
                placeholder={t('comments.addComment')}
                multiline
                value={commentText}
                onChangeText={setCommentText}
                containerStyle={styles.commentInputContainer}
                fieldStyle={styles.commentInput}
              />
              <View style={styles.commentInputButtonContainer}>
                <Button
                  label={t('comments.post')}
                  onPress={handlePostComment}
                  disabled={!commentText.trim() || isCreatingComment}
                  backgroundColor={COLORS.SECONDARY}
                  outlineColor={COLORS.PRIMARY}
                  color={COLORS.PRIMARY}
                  borderRadius={DIMENSIONS.BORDER_RADIUS_LARGE}
                  size={'small'}
                />
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSection: {
    paddingHorizontal: SPACINGS.LARGE,
    paddingVertical: SPACINGS.EXTRA_LARGE,
    backgroundColor: COLORS.SECONDARY,
    flexShrink: 0,
  },
  bodySection: {
    flex: 1,
  },
  contentSection: {
    flex: 0.7,
    padding: SPACINGS.LARGE,
  },
  commentSection: {
    flex: 0.3,
    backgroundColor: COLORS.BACKGROUND,
    elevation: DIMENSIONS.ELEVATION_LOW,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.7,
    shadowRadius: 4,
  },
  commentInputSection: {
    padding: SPACINGS.LARGE,
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
