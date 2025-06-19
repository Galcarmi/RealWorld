import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { themeColors, TYPOGRAPHY } from '../constants/styles';

interface ArticleContentProps {
  title: string;
  description: string;
}

export const ArticleContent: React.FC<ArticleContentProps> = ({
  title,
  description,
}) => {
  const styles = useMemo(() => createStyles(), []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description} numberOfLines={3}>
        {description}
      </Text>
    </View>
  );
};

const createStyles = () =>
  StyleSheet.create({
    container: {},
    title: {
      fontSize: 20,
      color: themeColors.textColor,
      marginBottom: 8,
      fontFamily: TYPOGRAPHY.BOLD.fontFamily,
    },
    description: {
      fontSize: 16,
      color: themeColors.placeholderColor,
    },
  });
