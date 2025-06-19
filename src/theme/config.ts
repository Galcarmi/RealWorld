import { SPACINGS, themeTypography } from '../constants/styles';

import { loadColors } from './colors';
import { initializeComponentThemes } from './ComponentsConfig';
import { loadTypography } from './typography';

export const initializeTheme = () => {
  loadTypography();
  loadColors();

  initializeComponentThemes();
};

export { SPACINGS, themeTypography };
