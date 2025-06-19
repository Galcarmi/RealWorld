import React from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Text } from 'react-native-ui-lib';

import { Ionicons } from '@expo/vector-icons';

import { TOUCH_OPACITY, APP_UI, ICON_NAMES } from '../constants';
import { themeColors } from '../constants/styles';
import { NavigationInstance } from '../navigation/types';
import { componentStyles } from '../styles/componentStyles';

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

  return (
    <View
      backgroundColor={themeColors.primaryColor}
      style={[
        componentStyles.screenHeaderContainer,
        { paddingTop: insets.top },
      ]}
    >
      <View
        row
        centerV
        paddingH-20
        paddingV-12
        style={componentStyles.screenHeader}
      >
        {shouldShowBackButton ? (
          <TouchableOpacity
            onPress={handleBackPress}
            activeOpacity={TOUCH_OPACITY.DEFAULT}
          >
            <View row centerV>
              <Ionicons
                name={ICON_NAMES.CHEVRON_BACK}
                size={APP_UI.ICON_SIZES.LARGE}
                color={themeColors.bgColor}
              />
              <Text text70 color={themeColors.bgColor} marginL-4>
                Back
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={componentStyles.screenHeaderLeftSpacer} />
        )}

        {title && (
          <View flex center>
            <Text
              text60
              color={themeColors.bgColor}
              style={componentStyles.screenHeaderTitle}
            >
              {title}
            </Text>
          </View>
        )}

        <View style={componentStyles.screenHeaderRightContainer} />
      </View>
    </View>
  );
};
