import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  COLORS,
  FONT_SIZES,
  DIMENSIONS,
  FONT_WEIGHTS,
} from '../../constants/styles';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  iconColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  buttonContentStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  testID?: string;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  iconName,
  iconSize = 18,
  iconColor = COLORS.PRIMARY,
  containerStyle,
  buttonContentStyle,
  disabled = false,
  testID,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        disabled && styles.disabledContainer,
        containerStyle,
      ]}
      onPress={onPress}
      disabled={disabled}
      testID={testID}
    >
      <View style={[styles.buttonContent, buttonContentStyle]}>
        {iconName && (
          <Ionicons
            name={iconName}
            size={iconSize}
            color={disabled ? COLORS.GREY : iconColor}
          />
        )}
        <Text style={[styles.text, disabled && styles.disabledText]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.BACKGROUND,
    borderColor: COLORS.PRIMARY,
    borderWidth: DIMENSIONS.BORDER_WIDTH_THIN,
    borderRadius: DIMENSIONS.BORDER_RADIUS_LARGE,
  },
  disabledContainer: {
    backgroundColor: COLORS.GREY,
    borderColor: COLORS.GREY,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.PRIMARY,
    fontWeight: FONT_WEIGHTS.MEDIUM,
  },
  disabledText: {
    color: COLORS.GREY,
  },
});
