import { StatusBar } from 'expo-status-bar';
import { View, Text, Button } from 'react-native-ui-lib';
import { useAppTheme, fontLoadingInfo } from './src/theme';
import * as SplashScreen from 'expo-splash-screen';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function App() {
  const isThemeReady = useAppTheme();

  const renderAppTsx = () => {
    if (!isThemeReady) {
      return null;
    }

    return (
      <View flex center bg-white>
        <Text heading marginB-small>
          1. WixMadeforText-Regular
        </Text>
        <Text subheading marginB-small>
          2. WixMadeforText-Medium
        </Text>
        <Text bold marginB-small>
          3. WixMadeforText-Bold
        </Text>
        <Text marginB-small red30>
          4. System Font (Reference)
        </Text>
        
        <StatusBar style="auto" />
        <Button 
          label="Click me" 
          marginT-large
          onPress={() => alert(`Using ${fontLoadingInfo.method} for font loading!`)} 
        />
      </View>
    );
  };

  return renderAppTsx();
}
