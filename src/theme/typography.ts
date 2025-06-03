import { Typography } from 'react-native-ui-lib';

export const themeTypography = {
  heading: { fontSize: 40, fontWeight: '600', fontFamily: 'WixMadeforText-Regular' },
  subheading: { fontSize: 28, fontWeight: '500', fontFamily: 'WixMadeforText-Medium' },
  body: { fontSize: 18, fontWeight: '400', fontFamily: 'WixMadeforText-Regular' },
};

export const loadTypography = () => {
  Typography.loadTypographies(themeTypography);
}; 