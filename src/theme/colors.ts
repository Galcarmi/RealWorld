import { Colors } from 'react-native-ui-lib';

export const themeColors = {
  primaryColor: '#116DFF',
  secondaryColor: '#81C3D7',
  textColor: '#221D23',
  errorColor: '#E63B2E',
  successColor: '#ADC76F',
  warnColor: '#FF963C',
  bgColor: '#FFFFFF',
  placeholderColor: '#6E7881',
  greyColor: '#6E7881',
};

export const loadColors = () => {
  Colors.loadColors(themeColors);
};
