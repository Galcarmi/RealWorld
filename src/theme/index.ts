import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { loadColors } from './colors';
import { useCustomFonts } from './fonts';
import { loadSpacings } from './spacings';
import { loadTypography } from './typography';

export const loadThemeConfiguration = () => {
  loadColors();
  loadTypography();
  loadSpacings();
};

export const useAppTheme = () => {
  const [fontsLoaded, fontError] = useCustomFonts();
  const isReady = fontsLoaded || !!fontError;
  loadThemeConfiguration();

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  return isReady;
};
