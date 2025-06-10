import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { observer } from 'mobx-react';
import { useEffect } from 'react';

import { navio } from './src/navigation/navio';
import { userStore } from './src/store/userStore';
import { useAppTheme } from './src/theme';

SplashScreen.preventAutoHideAsync();

const AppWrapper = observer(() => {
  const isThemeReady = useAppTheme();

  useEffect(() => {
    if (isThemeReady) {
      if (userStore.isAuthenticated()) {
        navio.setRoot('tabs', 'MainTabs');
      } else {
        navio.setRoot('tabs', 'AuthTabs');
      }
    }
  }, [isThemeReady, userStore.isAuthenticated()]);

  if (!isThemeReady) {
    return null;
  }

  return (
    <>
      <navio.App />
      <StatusBar style='auto' />
    </>
  );
});

export default AppWrapper;
