import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { APP_UI } from '../constants';
import { themeColors, SPACINGS } from '../constants/styles';

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
      marginTop: 12,
    },
    tag: {
      paddingVertical: SPACINGS.PADDING_SMALL,
      paddingHorizontal: SPACINGS.PADDING_SMALL + 4,
      marginRight: SPACINGS.PADDING_SMALL,
      backgroundColor: themeColors.secondaryColor,
      borderRadius: 10,
    },
    tagText: {
      fontSize: 12,
      color: themeColors.primaryColor,
    },
    moreText: {
      fontSize: 12,
      color: themeColors.placeholderColor,
    },
  });
