import React, { useMemo } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { APP_UI, ICON_NAMES } from '../constants';
import {
  COLORS,
  FONT_WEIGHTS,
  SPACINGS,
  TYPOGRAPHY,
  FONT_SIZES,
  DIMENSIONS,
} from '../constants/styles';
import { NavigationInstance } from '../navigation/types';

import { useScreenHeader } from './useScreenHeader';

interface ScreenHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  navigation?: NavigationInstance;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  navigation,
}) => {
  const { insets, handleBackPress, shouldShowBackButton } = useScreenHeader({
    showBackButton,
    onBackPress,
    navigation,
  });

  const styles = useMemo(() => createStyles(insets.top), [insets.top]);

  return (
    <View style={styles.headerContainer}>
      {shouldShowBackButton ? (
        <TouchableOpacity
          onPress={handleBackPress}
          activeOpacity={0.7}
          style={styles.backButton}
        >
          <Ionicons
            name={ICON_NAMES.CHEVRON_BACK}
            size={APP_UI.ICON_SIZES.LARGE}
            color={COLORS.BACKGROUND}
          />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      ) : undefined}

      {title && (
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
        </View>
      )}
    </View>
  );
};

const createStyles = (paddingTop: number) =>
  StyleSheet.create({
    headerContainer: {
      backgroundColor: COLORS.PRIMARY,
      paddingTop,
      minHeight: DIMENSIONS.HEIGHT_45,
      flexDirection: 'row',
      paddingVertical: SPACINGS.SCREEN_TAB_PADDING_VERTICAL,
      position: 'relative',
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      position: 'absolute',
      left: 6,
      bottom: 6,
    },
    backButtonText: {
      fontSize: FONT_SIZES.MEDIUM,
      color: COLORS.BACKGROUND,
      marginLeft: SPACINGS.PADDING_EXTRA_SMALL,
    },
    titleContainer: {
      position: 'absolute',
      left: DIMENSIONS.SCREEN_WIDTH / 2,
      transform: [{ translateX: '-50%' }],
      bottom: 6,
    },
    title: {
      fontSize: TYPOGRAPHY.BODY.fontSize,
      color: COLORS.BACKGROUND,
      fontWeight: FONT_WEIGHTS.SEMIBOLD,
    },
  });
