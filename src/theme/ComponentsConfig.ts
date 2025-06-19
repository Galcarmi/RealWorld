import { ThemeManager } from 'react-native-ui-lib';

import { TYPOGRAPHY, COLORS } from '../constants/styles';

import { loadFoundationPresets } from './loadFoundationPresets';

export const configureTextDefaults = () => {
  ThemeManager.setComponentTheme('Text', {
    body: true,
    text: true,
  });
};

export const configureButtonDefaults = () => {
  ThemeManager.setComponentTheme('Button', {
    style: {
      fontFamily: TYPOGRAPHY.BOLD.fontFamily,
    },
    labelStyle: {
      fontWeight: 'bold',
      fontSize: 16,
      fontFamily: TYPOGRAPHY.BOLD.fontFamily,
    },
    primary: true,
  });
};

export const configureTextFieldDefaults = () => {
  ThemeManager.setComponentTheme('TextField', {
    style: {
      fontFamily: TYPOGRAPHY.BODY.fontFamily,
      fontSize: TYPOGRAPHY.BODY.fontSize,
      fontWeight: '400',
    },
    placeholderTextColor: COLORS.PLACEHOLDER,
  });
};

export const initializeComponentThemes = () => {
  loadFoundationPresets();

  configureTextDefaults();
  configureButtonDefaults();
  configureTextFieldDefaults();
};
