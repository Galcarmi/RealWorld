import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-ui-lib';

import { Ionicons } from '@expo/vector-icons';

import { TEST_IDS, APP_UI, ICON_NAMES, BUTTON_LABELS } from '../constants';
import {
  COLORS,
  DIMENSIONS,
  COMPONENT_DIMENSIONS,
  SPACINGS,
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
        backgroundColor={COLORS.BACKGROUND}
        color={COLORS.PRIMARY}
        outline
        outlineColor={COLORS.PRIMARY}
        iconSource={() => (
          <Ionicons
            name={ICON_NAMES.ADD}
            size={APP_UI.ICON_SIZES.MEDIUM}
            color={COLORS.PRIMARY}
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
      marginTop: SPACINGS.MARGIN_LARGE,
      marginBottom: SPACINGS.MARGIN_LARGE,
      alignItems: 'center',
    },
    button: {
      borderRadius: COMPONENT_DIMENSIONS.BUTTON_BORDER_RADIUS,
      height: COMPONENT_DIMENSIONS.BUTTON_HEIGHT,
      borderWidth: DIMENSIONS.BORDER_WIDTH_THIN,
      borderColor: COLORS.PRIMARY,
      width: DIMENSIONS.WIDTH_50_PERCENT,
    },
  });
