import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-ui-lib';

import { Ionicons } from '@expo/vector-icons';

import { TEST_IDS, APP_UI, ICON_NAMES, BUTTON_LABELS } from '../constants';
import {
  themeColors,
  DIMENSIONS,
  COMPONENT_DIMENSIONS,
} from '../constants/styles';

interface NewArticleButtonProps {
  onPress: () => void;
}

export const NewArticleButton: React.FC<NewArticleButtonProps> = ({
  onPress,
}) => {
  const styles = useMemo(() => createStyles(), []);

  return (
    <View style={styles.container}>
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
        style={styles.button}
        testID={TEST_IDS.NEW_ARTICLE_BUTTON}
      />
    </View>
  );
};

const createStyles = () =>
  StyleSheet.create({
    container: {
      marginTop: 20,
      marginBottom: 20,
      alignItems: 'center',
    },
    button: {
      borderRadius: COMPONENT_DIMENSIONS.BUTTON_BORDER_RADIUS,
      height: COMPONENT_DIMENSIONS.BUTTON_HEIGHT,
      borderWidth: DIMENSIONS.BORDER_WIDTH_THIN,
      borderColor: themeColors.primaryColor,
      width: DIMENSIONS.WIDTH_50_PERCENT,
    },
  });
