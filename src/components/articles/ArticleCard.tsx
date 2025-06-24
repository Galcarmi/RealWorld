import React from 'react';
import { TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Card } from 'react-native-ui-lib';

import { TEST_IDS, DIMENSIONS } from '../../constants';
import { Article } from '../../services';
import { AuthorHeader } from '../profile/AuthorHeader';

import { ArticleCardContent } from './ArticleCardContent';
import { TagsList } from './TagsList';

interface ArticleCardProps {
  article: Article;
  onAuthorPress: () => void;
  onFavorite: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  onContentPress: () => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  onAuthorPress,
  onFavorite,
  containerStyle,
  onContentPress,
}) => {
  return (
    <Card
      enableShadow={true}
      elevation={DIMENSIONS.ELEVATION_LOW}
      testID={TEST_IDS.ARTICLE_CARD(article.slug)}
      containerStyle={containerStyle}
    >
      <TouchableOpacity onPress={onAuthorPress} activeOpacity={0.7}>
        <AuthorHeader
          author={article.author}
          createdAt={article.createdAt}
          favorited={article.favorited}
          onFavorite={onFavorite}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onContentPress} activeOpacity={0.7}>
        <ArticleCardContent
          title={article.title}
          description={article.description}
        />

        <TagsList tags={article.tagList} />
      </TouchableOpacity>
    </Card>
  );
};
