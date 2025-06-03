import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { View, Text, Button } from 'react-native-ui-lib';
import { initializeTheme } from './src/config/theme';

initializeTheme();

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, fontFamily: 'WixMadeforText-Regular', marginBottom: 10 }}>
        1. WixMadeforText-Regular (config plugin)
      </Text>
      <Text style={{ fontSize: 20, fontFamily: 'WixMadeforText-Medium', marginBottom: 10 }}>
        2. WixMadeforText-Medium (config plugin)
      </Text>
      <Text style={{ fontSize: 20, fontFamily: 'WixMadeforText-Bold', marginBottom: 10 }}>
        3. WixMadeforText-Bold (config plugin)
      </Text>
      <Text style={{ fontSize: 20, fontFamily: 'System', marginBottom: 10, color: 'red' }}>
        4. System Font (Reference)
      </Text>
      <StatusBar style="auto" />
      <Button 
        label="Click me" 
        labelStyle={{ fontFamily: 'WixMadeforText-Medium' }}
        onPress={() => alert('Button pressed')} 
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
