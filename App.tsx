import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Button } from 'react-native-ui-lib';

import { useAppTheme } from './src/theme';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function App() {
  const isThemeReady = useAppTheme();

  if (!isThemeReady) {
    return null;
  }

  return (
    <View flex center bg-white>
      <Text heading marginB-small>
        1. Typography: heading (should be Regular)
      </Text>
      <Text subheading marginB-small>
        2. Typography: subheading (should be Medium)
      </Text>
      <Text bold marginB-small>
        3. Typography: bold (should be Bold)
      </Text>
      <Text marginB-small red30>
        7. System Font (Reference)
      </Text>

      <StatusBar style='auto' />
      <Button label='Click me' marginT-large onPress={() => alert(`Clicked`)} />
    </View>
  );
}
