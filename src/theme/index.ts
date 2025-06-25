import { useEffect } from 'react';

import * as SplashScreen from 'expo-splash-screen';

import { initializeTheme } from './config';
import { useCustomFonts } from './fonts';

export const useAppTheme = () => {
  const [fontsLoaded, fontError] = useCustomFonts();
  const isReady = fontsLoaded || !!fontError;

  initializeTheme();

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  return isReady;
};

export { initializeTheme };
export { componentsConfigurator } from './ComponentsConfig';
