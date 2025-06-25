import React, { useMemo } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import { COLORS, DIMENSIONS } from '../../constants/styles';

import { TEST_IDS, ICON_NAMES, BUTTON_LABELS } from '../../constants';
import { CustomButton } from '../common/CustomButton';

interface NewArticleButtonProps {
  onPress: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

export const NewArticleButton: React.FC<NewArticleButtonProps> = ({
  onPress,
  containerStyle,
}) => {
  const styles = useMemo(() => createStyles(), []);

  return (
    <View style={containerStyle}>
      <CustomButton
        title={BUTTON_LABELS.NEW_ARTICLE}
        onPress={onPress}
        iconName={ICON_NAMES.ADD}
        iconSize={18}
        iconColor={COLORS.PRIMARY}
        testID={TEST_IDS.NEW_ARTICLE_BUTTON}
        buttonContentStyle={styles.button}
        containerStyle={styles.buttonContainer}
      />
    </View>
  );
};

const createStyles = () =>
  StyleSheet.create({
    button: {
      width: DIMENSIONS.WIDTH_150,
      height: DIMENSIONS.HEIGHT_45,
    },
    buttonContainer: {
      height: DIMENSIONS.HEIGHT_30,
    },
  });
