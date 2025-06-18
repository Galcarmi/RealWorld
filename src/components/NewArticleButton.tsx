import React from 'react';
import { View, Button } from 'react-native-ui-lib';

import { Ionicons } from '@expo/vector-icons';

import { TEST_IDS } from '../constants';
import { componentStyles } from '../styles/componentStyles';
import { themeColors } from '../theme/colors';

interface NewArticleButtonProps {
  onPress: () => void;
}

export const NewArticleButton: React.FC<NewArticleButtonProps> = ({
  onPress,
}) => {
  return (
    <View marginT-20 marginB-20 center>
      <Button
        label='New Article'
        onPress={onPress}
        backgroundColor={themeColors.bgColor}
        color={themeColors.primaryColor}
        outline
        outlineColor={themeColors.primaryColor}
        iconSource={() => (
          <Ionicons name='add' size={20} color={themeColors.primaryColor} />
        )}
        iconOnRight={false}
        style={componentStyles.newArticleButton}
        testID={TEST_IDS.NEW_ARTICLE_BUTTON}
      />
    </View>
  );
};
