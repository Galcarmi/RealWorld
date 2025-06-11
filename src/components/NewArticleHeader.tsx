import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native-ui-lib';

import { componentStyles } from '../styles/componentStyles';
import { themeColors } from '../theme/colors';

interface NewArticleHeaderProps {
  onGoBack: () => void;
}

export const NewArticleHeader: React.FC<NewArticleHeaderProps> = ({
  onGoBack,
}) => {
  return (
    <View
      row
      centerV
      paddingH-20
      paddingV-12
      backgroundColor={themeColors.primaryColor}
    >
      <TouchableOpacity onPress={onGoBack} activeOpacity={0.7}>
        <View row centerV>
          <Ionicons name='chevron-back' size={24} color={themeColors.bgColor} />
          <Text text70 color={themeColors.bgColor} marginL-4>
            Back
          </Text>
        </View>
      </TouchableOpacity>

      <View flex center>
        <Text
          text60
          color={themeColors.bgColor}
          style={componentStyles.newArticleHeaderTitle}
        >
          New Article
        </Text>
      </View>

      <View style={componentStyles.newArticleHeaderSpacer} />
    </View>
  );
};
