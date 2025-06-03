import { Typography } from 'react-native-ui-lib';

export const themeTypography = {
  heading: { fontSize: 40, fontFamily: 'WixMadeforText-Regular' },
  subheading: { fontSize: 28,fontFamily: 'WixMadeforText-Medium' },
  body: { fontSize: 18, fontFamily: 'WixMadeforText-Regular' },
  bold: { fontSize: 20, fontFamily: 'WixMadeforText-Bold' },
};

export const loadTypography = () => {
  Typography.loadTypographies(themeTypography);
}; 