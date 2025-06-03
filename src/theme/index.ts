import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { loadColors } from './colors';
import { isExpoGo } from './constants';
import { useCustomFonts, getFontReadyState } from './fonts';
import { loadSpacings } from './spacings';
import { loadTypography } from './typography';

const loadThemeConfiguration = () => {
  loadColors();
  loadTypography();
  loadSpacings();

  const fontMethod = isExpoGo
    ? 'useFonts hook (Expo Go)'
    : 'config plugin (production build)';
  console.log(`✅ Theme initialized with custom fonts using ${fontMethod}`);
};

export const useAppTheme = () => {
  const [fontsLoaded, fontError] = useCustomFonts();
  const isReady = getFontReadyState(fontsLoaded, fontError);

  useEffect(() => {
    if (isReady) {
      loadThemeConfiguration();
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  return isReady;
};

export { fontLoadingInfo } from './constants';
export { themeColors } from './colors';
export { themeTypography } from './typography';
export { themeSpacings } from './spacings';
