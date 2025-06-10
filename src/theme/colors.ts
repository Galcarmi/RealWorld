import { Colors } from 'react-native-ui-lib';

export const themeColors = {
  primaryColor: '#116DFF',
  secondaryColor: '#007AFF14',
  textColor: '#221D23',
  errorColor: '#E63B2E',
  successColor: '#ADC76F',
  warnColor: '#FF963C',
  bgColor: '#FFFFFF',
  placeholderColor: '#6E7881',
  greyColor: '#6E7881',
  tabBarActiveTint: '#007AFF',
  tabBarInactiveTint: '#8E8E93',
  tabBarBorder: '#E5E5E7',
  blackColor: '#000000',
};

export const loadColors = () => {
  Colors.loadColors(themeColors);
};
