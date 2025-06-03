import { Colors, Typography, Spacings } from 'react-native-ui-lib';

// Initialize UI Library theme configurations
export const initializeTheme = () => {
  Colors.loadColors({
    primaryColor: '#2364AA',
    secondaryColor: '#81C3D7',
    textColor: '##221D23',
    errorColor: '#E63B2E',
    successColor: '#ADC76F',
    warnColor: '#FF963C'
  });

  Typography.loadTypographies({
    heading: { fontSize: 40, fontWeight: '600', fontFamily: 'WixMadeforText-Regular' },
    subheading: { fontSize: 28, fontWeight: '500', fontFamily: 'WixMadeforText-Medium' },
    body: { fontSize: 18, fontWeight: '400', fontFamily: 'WixMadeforText-Regular' },
  });

  Spacings.loadSpacings({
    page: 20,
    card: 12,
    gridGutter: 16
  });
};

// Export individual configurations for direct access if needed
export const themeColors = {
  primaryColor: '#2364AA',
  secondaryColor: '#81C3D7',
  textColor: '##221D23',
  errorColor: '#E63B2E',
  successColor: '#ADC76F',
  warnColor: '#FF963C'
};

export const themeTypography = {
  heading: { fontSize: 40, fontWeight: '600', fontFamily: 'WixMadeforText-Regular' },
  subheading: { fontSize: 28, fontWeight: '500', fontFamily: 'WixMadeforText-Medium' },
  body: { fontSize: 18, fontWeight: '400', fontFamily: 'WixMadeforText-Regular' },
};

export const themeSpacings = {
  page: 20,
  card: 12,
  gridGutter: 16
}; 