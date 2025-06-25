import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import {
  TYPOGRAPHY,
  SPACINGS,
  FONT_SIZES,
  COLORS,
} from '../../constants/styles';

interface ArticleCardContentProps {
  title: string;
  description: string;
}

export const ArticleCardContent: React.FC<ArticleCardContentProps> = ({
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
      color: COLORS.TEXT,
      marginBottom: SPACINGS.SMALL,
      ...TYPOGRAPHY.BOLD,
    },
    description: {
      fontSize: FONT_SIZES.MEDIUM,
      color: COLORS.PLACEHOLDER,
    },
  });
