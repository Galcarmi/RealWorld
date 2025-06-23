import { useEffect, useMemo } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { observer } from 'mobx-react';

import './src/locales';
import { COLORS } from './src/constants/styles';
import { navio } from './src/navigation/navio';
import { userStore } from './src/store/userStore';
import { useAppTheme } from './src/theme';

SplashScreen.preventAutoHideAsync();

const AppWrapper = observer(() => {
  const isThemeReady = useAppTheme();
  const isUserStoreInitialized = userStore.isInitialized;
  const isAuthenticated = userStore.isAuthenticated();

  const isAppReady = useMemo(
    () => isThemeReady && isUserStoreInitialized,
    [isThemeReady, isUserStoreInitialized]
  );

  useEffect(() => {
    if (isAppReady) {
      if (isAuthenticated) {
        navio.setRoot('tabs', 'MainTabs');
      } else {
        navio.setRoot('tabs', 'AuthTabs');
      }

      SplashScreen.hideAsync();
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
