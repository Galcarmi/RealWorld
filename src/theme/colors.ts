import { Colors } from 'react-native-ui-lib';

export const themeColors = {
  primaryColor: '#2364AA',
  secondaryColor: '#81C3D7',
  textColor: '#221D23',
  errorColor: '#E63B2E',
  successColor: '#ADC76F',
  warnColor: '#FF963C'
};

export const loadColors = () => {
  Colors.loadColors(themeColors);
}; 