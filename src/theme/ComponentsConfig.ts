import { ThemeManager } from 'react-native-ui-lib';

import { TYPOGRAPHY } from '../constants/styles';

export const configureTextDefaults = () => {
  ThemeManager.setComponentTheme('Text', {
    fontFamily: TYPOGRAPHY.BODY.fontFamily,
    body: true,
    fontSize: TYPOGRAPHY.BODY.fontSize,
    fontWeight: '400',
  });
};

export const configureButtonDefaults = () => {
  ThemeManager.setComponentTheme('Button', {
    label: {
      fontFamily: TYPOGRAPHY.BOLD.fontFamily,
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
};

export const configureTextFieldDefaults = () => {
  ThemeManager.setComponentTheme('TextField', {
    text: {
      fontFamily: TYPOGRAPHY.BODY.fontFamily,
      fontSize: TYPOGRAPHY.BODY.fontSize,
      fontWeight: '400',
    },
    placeholder: {
      fontFamily: TYPOGRAPHY.BODY.fontFamily,
      fontSize: TYPOGRAPHY.BODY.fontSize,
      fontWeight: '400',
    },
  });
};

export const configureViewDefaults = () => {
  ThemeManager.setComponentTheme('View', {});
};

export const initializeComponentThemes = () => {
  configureTextDefaults();
  configureButtonDefaults();
  configureTextFieldDefaults();
  configureViewDefaults();
};
