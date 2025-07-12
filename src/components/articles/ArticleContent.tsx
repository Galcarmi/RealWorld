import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { SPACINGS, FONT_SIZES, COLORS } from '../../constants/styles';

import { TagsList } from './TagsList';

interface ArticleContentProps {
  body: string;
  tags: string[] | null;
}

export const ArticleContent: React.FC<ArticleContentProps> = ({
  body,
  tags,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.body}>{body}</Text>

      {tags && tags.length > 0 && (
        <View style={styles.tagsSection}>
          <TagsList tags={tags} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.TEXT,
    lineHeight: 22,
    marginBottom: SPACINGS.LARGE,
  },
  tagsSection: {
    marginTop: SPACINGS.MEDIUM,
  },
});
