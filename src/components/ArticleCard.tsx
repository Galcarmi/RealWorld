import React, { useMemo } from 'react';
import {
  GestureResponderEvent,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Card } from 'react-native-ui-lib';

import { TEST_IDS, DIMENSIONS } from '../constants';
import { COLORS, SPACINGS } from '../constants/styles';
import { Article } from '../services/types';

import { ArticleContent } from './ArticleContent';
import { AuthorHeader } from './AuthorHeader';
import { TagsList } from './TagsList';

interface ArticleCardProps {
  article: Article;
  onPress: (event: GestureResponderEvent) => void;
  onFavorite: () => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onPress,
  onFavorite,
}) => {
  const styles = useMemo(() => createStyles(), []);

  return (
    <Card
      style={styles.card}
      enableShadow={true}
      elevation={DIMENSIONS.ELEVATION_LOW}
      testID={TEST_IDS.ARTICLE_CARD(article.slug)}
    >
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <AuthorHeader
          author={article.author}
          createdAt={article.createdAt}
          favorited={article.favorited}
          favoritesCount={article.favoritesCount}
          onFavorite={onFavorite}
        />

        <ArticleContent
          title={article.title}
          description={article.description}
        />

        <TagsList tags={article.tagList} />
      </TouchableOpacity>
    </Card>
  );
};

const createStyles = () =>
  StyleSheet.create({
    card: {
      marginHorizontal: SPACINGS.PADDING_LARGE,
      marginVertical: SPACINGS.PADDING_SMALL,
      padding: SPACINGS.PADDING_LARGE,
      backgroundColor: COLORS.BACKGROUND,
    },
  });
