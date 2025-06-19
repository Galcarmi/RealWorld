import { SPACINGS, themeTypography } from '../constants/styles';

import { loadColors } from './colors';
import { loadTypography } from './typography';

export const initializeTheme = () => {
  loadTypography();
  loadColors();
};

export { SPACINGS, themeTypography };
