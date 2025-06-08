import React from 'react';
import { View, Text } from 'react-native-ui-lib';

import { themeColors } from '../theme/colors';

interface TagsListProps {
  tags: string[] | null;
  maxVisible?: number;
}

export const TagsList: React.FC<TagsListProps> = ({ tags, maxVisible = 3 }) => {
  const tagList = tags || [];

  if (tagList.length === 0) {
    return null;
  }

  return (
    <View row marginT-12>
      {tagList.slice(0, maxVisible).map((tag, index) => (
        <View
          key={index}
          padding-4
          paddingH-8
          marginR-8
          backgroundColor={themeColors.secondaryColor}
          br10
        >
          <Text text90 color={themeColors.primaryColor}>
            {tag}
          </Text>
        </View>
      ))}
      {tagList.length > maxVisible && (
        <Text text90 color={themeColors.placeholderColor}>
          +{tagList.length - maxVisible} more
        </Text>
      )}
    </View>
  );
};
