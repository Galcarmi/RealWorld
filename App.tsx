import { useEffect } from 'react';

import * as SplashScreen from 'expo-splash-screen';

import { observer } from 'mobx-react';

import { navio } from './src/navigation/navio';
import { userStore } from './src/store/userStore';
import { useAppTheme } from './src/theme';

SplashScreen.preventAutoHideAsync();

const AppWrapper = observer(() => {
  const isThemeReady = useAppTheme();
  const isAuthenticated = userStore.isAuthenticated();

  useEffect(() => {
    if (isThemeReady) {
      if (isAuthenticated) {
        navio.setRoot('tabs', 'MainTabs');
      } else {
        navio.setRoot('tabs', 'AuthTabs');
      }
    }
  }, [isThemeReady, isAuthenticated]);

  if (!isThemeReady) {
    return null;
  }

  return <navio.App />;
});

export default AppWrapper;
