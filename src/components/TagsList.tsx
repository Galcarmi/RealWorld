import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { APP_UI } from '../constants';
import {
  COLORS,
  SPACINGS,
  TYPOGRAPHY,
  DIMENSIONS,
  FONT_SIZES,
} from '../constants/styles';

interface TagsListProps {
  tags: string[] | null;
  maxVisible?: number;
}

export const TagsList: React.FC<TagsListProps> = ({
  tags,
  maxVisible = APP_UI.MAX_VISIBLE_TAGS,
}) => {
  const tagList = tags || [];

  const styles = useMemo(() => createStyles(), []);

  if (tagList.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {tagList.slice(0, maxVisible).map((tag, index) => (
        <View key={index} style={styles.tag}>
          <Text style={styles.tagText}>{tag}</Text>
        </View>
      ))}
      {tagList.length > maxVisible && (
        <Text style={styles.moreText}>+{tagList.length - maxVisible} more</Text>
      )}
    </View>
  );
};

const createStyles = () =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: SPACINGS.PADDING_MEDIUM,
    },
    tag: {
      paddingVertical: SPACINGS.PADDING_SMALL,
      paddingHorizontal: SPACINGS.PADDING_MEDIUM,
      marginRight: SPACINGS.PADDING_SMALL,
      backgroundColor: COLORS.SECONDARY,
      borderRadius: DIMENSIONS.BORDER_RADIUS_MEDIUM,
    },
    tagText: {
      fontSize: FONT_SIZES.X_SMALL,
      color: COLORS.PRIMARY,
      fontFamily: TYPOGRAPHY.BOLD.fontFamily,
    },
    moreText: {
      fontSize: FONT_SIZES.X_SMALL,
      color: COLORS.PLACEHOLDER,
    },
  });
