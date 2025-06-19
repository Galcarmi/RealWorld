import { ThemeManager } from 'react-native-ui-lib';

import { TYPOGRAPHY } from '../constants/styles';

import { loadFoundationPresets } from './loadFoundationPresets';

export const configureTextDefaults = () => {
  ThemeManager.setComponentTheme('Text', {
    style: {
      fontFamily: TYPOGRAPHY.BOLD.fontFamily,
    },
  });
};

export const configureButtonDefaults = () => {
  ThemeManager.setComponentTheme('Button', {
    style: {
      fontFamily: TYPOGRAPHY.BOLD.fontFamily,
    },
  });
};

export const configureTextFieldDefaults = () => {
  ThemeManager.setComponentTheme('TextField', {
    style: {
      fontFamily: TYPOGRAPHY.BODY.fontFamily,
    },
  });
};

export const initializeComponentThemes = () => {
  loadFoundationPresets();

  configureTextDefaults();
  configureButtonDefaults();
  configureTextFieldDefaults();
};
