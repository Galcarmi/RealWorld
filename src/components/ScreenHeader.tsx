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
      <View style={styles.headerContent}>
        {shouldShowBackButton ? (
          <TouchableOpacity onPress={handleBackPress} activeOpacity={0.7}>
            <View style={styles.backButton}>
              <Ionicons
                name={ICON_NAMES.CHEVRON_BACK}
                size={APP_UI.ICON_SIZES.LARGE}
                color={COLORS.BACKGROUND}
              />
              <Text style={styles.backButtonText}>Back</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.leftSpacer} />
        )}

        {title && (
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
          </View>
        )}

        <View style={styles.rightContainer} />
      </View>
    </View>
  );
};

const createStyles = (paddingTop: number) =>
  StyleSheet.create({
    headerContainer: {
      backgroundColor: COLORS.PRIMARY,
      paddingTop,
    },
    headerContent: {
      minHeight: DIMENSIONS.HEIGHT_45,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: SPACINGS.SCREEN_PADDING_HORIZONTAL,
      paddingVertical: SPACINGS.TAB_PADDING_VERTICAL,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    backButtonText: {
      fontSize: FONT_SIZES.MEDIUM,
      color: COLORS.BACKGROUND,
      marginLeft: SPACINGS.PADDING_EXTRA_SMALL,
    },
    leftSpacer: {
      width: DIMENSIONS.SMALL,
    },
    titleContainer: {
      flex: 1,
      alignItems: 'center',
    },
    title: {
      fontSize: TYPOGRAPHY.BODY.fontSize,
      color: COLORS.BACKGROUND,
      fontWeight: FONT_WEIGHTS.SEMIBOLD,
    },
    rightContainer: {
      width: DIMENSIONS.SMALL,
      alignItems: 'flex-end',
    },
  });
