import { Typography } from 'react-native-ui-lib';

import { TYPOGRAPHY } from '../constants/styles';

export const themeTypography = {
  heading: TYPOGRAPHY.HEADING,
  subheading: TYPOGRAPHY.SUBHEADING,
  body: TYPOGRAPHY.BODY,
  bold: TYPOGRAPHY.BOLD,
  title: TYPOGRAPHY.TITLE,
};

export const loadTypography = () => {
  Typography.loadTypographies(themeTypography);
};
