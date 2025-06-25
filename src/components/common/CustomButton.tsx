import React, { useMemo } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
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
  textStyle?: StyleProp<TextStyle>;
  buttonContentStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  testID?: string;
  iconTextGap?: number;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  iconName,
  iconSize = 18,
  iconColor = COLORS.PRIMARY,
  containerStyle,
  textStyle,
  buttonContentStyle,
  disabled = false,
  testID,
  iconTextGap,
}) => {
  const styles = useMemo(
    () => createStyles(disabled, iconTextGap),
    [disabled, iconTextGap]
  );

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
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
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (disabled?: boolean, iconTextGap?: number) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: disabled ? COLORS.GREY : COLORS.BACKGROUND,
      borderColor: disabled ? COLORS.GREY : COLORS.PRIMARY,
      borderWidth: DIMENSIONS.BORDER_WIDTH_THIN,
      borderRadius: DIMENSIONS.BORDER_RADIUS_LARGE,
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: iconTextGap,
    },
    text: {
      fontSize: FONT_SIZES.MEDIUM,
      color: disabled ? COLORS.GREY : COLORS.PRIMARY,
      fontWeight: FONT_WEIGHTS.MEDIUM,
    },
  });
