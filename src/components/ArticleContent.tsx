import React from 'react';
import { View, Text } from 'react-native-ui-lib';

import { themeColors } from '../constants/styles';

interface ArticleContentProps {
  title: string;
  description: string;
}

export const ArticleContent: React.FC<ArticleContentProps> = ({
  title,
  description,
}) => {
  return (
    <View>
      <Text text60 color={themeColors.textColor} marginB-8>
        {title}
      </Text>
      <Text text70 color={themeColors.placeholderColor} numberOfLines={3}>
        {description}
      </Text>
    </View>
  );
};
