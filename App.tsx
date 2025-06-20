import { useEffect, useMemo } from 'react';

import * as SplashScreen from 'expo-splash-screen';

import { observer } from 'mobx-react';

import './src/locales';
import { navio } from './src/navigation/navio';
import { userStore } from './src/store/userStore';
import { useAppTheme } from './src/theme';

SplashScreen.preventAutoHideAsync();

const AppWrapper = observer(() => {
  const isThemeReady = useAppTheme();
  const isUserStoreInitialized = userStore.isInitialized;
  const isAuthenticated = userStore.isAuthenticated();

  const isAppReady = useMemo(() => isThemeReady && isUserStoreInitialized, [isThemeReady, isUserStoreInitialized]);

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

  return <navio.App />;
});

export default AppWrapper;
