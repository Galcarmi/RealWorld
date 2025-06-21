import React, { useMemo } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { observer } from 'mobx-react';

import {
  COLORS,
  FONT_WEIGHTS,
  SPACINGS,
  TYPOGRAPHY,
  FONT_SIZES,
  DIMENSIONS,
} from '../../constants/styles';

import { NavigationInstance } from '../../navigation/types';

import { APP_UI, ICON_NAMES } from '../../constants';
import { useTranslation } from '../../hooks/useTranslation';

import { useScreenHeader } from './useScreenHeader';

interface ScreenHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  navigation?: NavigationInstance;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = observer(
  ({ title, showBackButton = false, onBackPress, navigation }) => {
    const { t } = useTranslation();
    const { insets, handleBackPress, shouldShowBackButton } = useScreenHeader({
      showBackButton,
      onBackPress,
      navigation,
    });

    const styles = useMemo(() => createStyles(insets.top), [insets.top]);

    const backButton = useMemo(
      () =>
        shouldShowBackButton ? (
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
            <Text style={styles.backButtonText}>{t('common.back')}</Text>
          </TouchableOpacity>
        ) : undefined,
      [
        shouldShowBackButton,
        handleBackPress,
        styles.backButton,
        styles.backButtonText,
        t,
      ]
    );

    return (
      <>
        <View style={styles.insets} />
        <View style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            {backButton}
            {title && <Text style={styles.title}>{title}</Text>}
          </View>
        </View>
      </>
    );
  }
);

const createStyles = (paddingTop: number) =>
  StyleSheet.create({
    insets: {
      paddingTop,
      backgroundColor: COLORS.PRIMARY,
    },
    headerContainer: {
      backgroundColor: COLORS.PRIMARY,
      position: 'relative',
      height: DIMENSIONS.HEIGHT_30,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      position: 'absolute',
      left: 6,
    },
    backButtonText: {
      fontSize: FONT_SIZES.MEDIUM,
      color: COLORS.BACKGROUND,
      marginLeft: SPACINGS.EXTRA_SMALL,
    },
    titleContainer: {
      width: DIMENSIONS.WIDTH_FULL,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: TYPOGRAPHY.BODY.fontSize,
      color: COLORS.BACKGROUND,
      fontWeight: FONT_WEIGHTS.SEMIBOLD,
    },
  });
