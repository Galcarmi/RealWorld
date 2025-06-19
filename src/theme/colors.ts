import { Colors } from 'react-native-ui-lib';

import { COLORS } from '../constants/styles';

export const themeColors = {
  primaryColor: COLORS.PRIMARY,
  secondaryColor: COLORS.SECONDARY,
  textColor: COLORS.TEXT,
  errorColor: COLORS.ERROR,
  successColor: COLORS.SUCCESS,
  warnColor: COLORS.WARN,
  bgColor: COLORS.BACKGROUND,
  placeholderColor: COLORS.PLACEHOLDER,
  greyColor: COLORS.GREY,
  tabBarActiveTint: COLORS.TAB_BAR_ACTIVE_TINT,
  tabBarInactiveTint: COLORS.TAB_BAR_INACTIVE_TINT,
  tabBarBorder: COLORS.TAB_BAR_BORDER,
  blackColor: COLORS.BLACK,
};

export const loadColors = () => {
  Colors.loadColors(themeColors);
};
