import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { View, Text, Button } from 'react-native-ui-lib';
import { useAppTheme, fontLoadingInfo } from './src/theme';
import * as SplashScreen from 'expo-splash-screen';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function App() {
  const isThemeReady = useAppTheme();

  if (!isThemeReady) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 16, marginBottom: 15, textAlign: 'center', color: '#666' }}>
        Font Loading: {fontLoadingInfo.method} ({fontLoadingInfo.environment})
      </Text>
      
      <Text style={{ fontSize: 20, fontFamily: 'WixMadeforText-Regular', marginBottom: 10 }}>
        1. WixMadeforText-Regular
      </Text>
      <Text style={{ fontSize: 20, fontFamily: 'WixMadeforText-Medium', marginBottom: 10 }}>
        2. WixMadeforText-Medium
      </Text>
      <Text style={{ fontSize: 20, fontFamily: 'WixMadeforText-Bold', marginBottom: 10 }}>
        3. WixMadeforText-Bold
      </Text>
      <Text style={{ fontSize: 20, fontFamily: 'System', marginBottom: 10, color: 'red' }}>
        4. System Font (Reference)
      </Text>
      
      <StatusBar style="auto" />
      <Button 
        label="Click me" 
        labelStyle={{ fontFamily: 'WixMadeforText-Medium' }}
        onPress={() => alert(`Using ${fontLoadingInfo.method} for font loading!`)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
