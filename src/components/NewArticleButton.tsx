import React from 'react';
import { View, Button } from 'react-native-ui-lib';

import { Ionicons } from '@expo/vector-icons';

import { TEST_IDS, APP_UI, ICON_NAMES, BUTTON_LABELS } from '../constants';
import { themeColors } from '../constants/styles';
import { componentStyles } from '../styles/componentStyles';

interface NewArticleButtonProps {
  onPress: () => void;
}

export const NewArticleButton: React.FC<NewArticleButtonProps> = ({
  onPress,
}) => {
  return (
    <View marginT-20 marginB-20 center>
      <Button
        label={BUTTON_LABELS.NEW_ARTICLE}
        onPress={onPress}
        backgroundColor={themeColors.bgColor}
        color={themeColors.primaryColor}
        outline
        outlineColor={themeColors.primaryColor}
        iconSource={() => (
          <Ionicons
            name={ICON_NAMES.ADD}
            size={APP_UI.ICON_SIZES.MEDIUM}
            color={themeColors.primaryColor}
          />
        )}
        iconOnRight={false}
        style={componentStyles.newArticleButton}
        testID={TEST_IDS.NEW_ARTICLE_BUTTON}
      />
    </View>
  );
};
