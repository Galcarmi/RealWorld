import { SPACINGS } from '../constants/styles';

import { loadColors } from './colors';
import { componentsConfigurator } from './ComponentsConfig';
import { loadTypography, themeTypography } from './typography';

export const initializeTheme = () => {
  loadTypography();
  loadColors();

  componentsConfigurator.initializeComponentThemes();
};

export { SPACINGS, themeTypography };
