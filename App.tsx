import { useEffect, useMemo, useRef } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { observer } from 'mobx-react';

import './src/locales';
import { COLORS } from './src/constants/styles';
import { navio } from './src/navigation/navio';
import { navigationService } from './src/services';
import { userStore } from './src/store/userStore';
import { useAppTheme } from './src/theme';

SplashScreen.preventAutoHideAsync();

const AppWrapper = observer(() => {
  const isThemeReady = useAppTheme();
  const isUserStoreInitialized = userStore.isInitialized;
  const isAuthenticated = userStore.isAuthenticated();
  const navigationHandledRef = useRef(false);

  const isAppReady = useMemo(
    () => isThemeReady && isUserStoreInitialized,
    [isThemeReady, isUserStoreInitialized]
  );

  useEffect(() => {
    if (isAppReady && !navigationHandledRef.current) {
      const handleNavigation = () => {
        navigationHandledRef.current = true;

        if (isAuthenticated) {
          navigationService.navigateToMainTabs();
        } else {
          navigationService.navigateToAuthTabs();
        }

        SplashScreen.hideAsync();
      };

      requestAnimationFrame(handleNavigation);
    }
  }, [isAppReady, isAuthenticated]);

  if (!isAppReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style='light' backgroundColor={COLORS.PRIMARY} />
      <navio.App />
    </SafeAreaProvider>
  );
});

export default AppWrapper;
