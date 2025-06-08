import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { observer } from 'mobx-react';

import { navio } from './src/navio';
import { userStore } from './src/store/userStore';
import { useAppTheme } from './src/theme';

SplashScreen.preventAutoHideAsync();

const AppWrapper = observer(() => {
  const isThemeReady = useAppTheme();

  if (!isThemeReady) {
    return null;
  }

  if (userStore.isAuthenticated()) {
    navio.setRoot('tabs', 'MainTabs');
  } else {
    navio.setRoot('stacks', 'AuthStack');
  }

  return (
    <>
      <navio.App />
      <StatusBar style='auto' />
    </>
  );
});

export default AppWrapper;
