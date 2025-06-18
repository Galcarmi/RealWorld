import React from 'react';
import { GestureResponderEvent, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-ui-lib';

import { TEST_IDS, DIMENSIONS } from '../constants';
import { Article } from '../services/types';
import { themeColors } from '../theme/colors';

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
  return (
    <Card
      marginH-16
      marginV-8
      padding-16
      backgroundColor={themeColors.bgColor}
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
