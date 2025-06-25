import { Colors, Typography } from 'react-native-ui-lib';

import { COLORS, TYPOGRAPHY } from '../constants/styles';

export const loadFoundationPresets = () => {
  Typography.loadTypographies({
    heading: {
      fontSize: TYPOGRAPHY.HEADING.fontSize,
      fontWeight: '600',
      fontFamily: TYPOGRAPHY.HEADING.fontFamily,
    },
    subheading: {
      fontSize: TYPOGRAPHY.SUBHEADING.fontSize,
      fontWeight: '500',
      fontFamily: TYPOGRAPHY.SUBHEADING.fontFamily,
    },
    body: {
      fontSize: TYPOGRAPHY.BODY.fontSize,
      fontWeight: '400',
      fontFamily: TYPOGRAPHY.BODY.fontFamily,
    },
    bold: {
      fontSize: TYPOGRAPHY.BOLD.fontSize,
      fontWeight: 'bold',
      fontFamily: TYPOGRAPHY.BOLD.fontFamily,
    },
    title: {
      fontSize: TYPOGRAPHY.TITLE.fontSize,
      fontWeight: '700',
      fontFamily: TYPOGRAPHY.TITLE.fontFamily,
    },
  });

  Colors.loadColors({
    primary: COLORS.PRIMARY,
    secondary: COLORS.SECONDARY,
    text: COLORS.TEXT,
    error: COLORS.ERROR,
    success: COLORS.SUCCESS,
    warn: COLORS.WARN,
    background: COLORS.BACKGROUND,
    placeholder: COLORS.PLACEHOLDER,
    grey: COLORS.GREY,
    black: COLORS.BLACK,
    transparent: COLORS.TRANSPARENT,
  });
};
