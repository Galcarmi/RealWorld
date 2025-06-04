import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { navio } from './src/navio';
import { useAppTheme } from './src/theme';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function AppWrapper() {
  const isThemeReady = useAppTheme();

  if (!isThemeReady) {
    return null;
  }

  return (
    <>
      <navio.App />
      <StatusBar style='auto' />
    </>
  );
}
