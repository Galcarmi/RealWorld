import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Text } from 'react-native-ui-lib';

import { componentStyles } from '../styles/componentStyles';
import { themeColors } from '../theme/colors';

import { useScreenHeader } from './useScreenHeader';

interface ScreenHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
}) => {
  const { insets, handleBackPress, shouldShowBackButton } = useScreenHeader({
    showBackButton,
    onBackPress,
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
          <TouchableOpacity onPress={handleBackPress} activeOpacity={0.7}>
            <View row centerV>
              <Ionicons
                name='chevron-back'
                size={24}
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
