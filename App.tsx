import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import {View, Text, Button, Colors, Spacings, Typography} from 'react-native-ui-lib';
import * as Font from 'expo-font';

Colors.loadColors({
  primaryColor: '#2364AA',
  secondaryColor: '#81C3D7',
  textColor: '##221D23',
  errorColor: '#E63B2E',
  successColor: '#ADC76F',
  warnColor: '#FF963C'
});

Typography.loadTypographies({
  heading: { fontSize: 40, fontWeight: '600', fontFamily: 'WixMadeforText-Regular' },
  subheading: { fontSize: 28, fontWeight: '500', fontFamily: 'WixMadeforText-Medium' },
  body: { fontSize: 18, fontWeight: '400', fontFamily: 'WixMadeforText-Regular' },
});

Spacings.loadSpacings({
  page: 20,
  card: 12,
  gridGutter: 16
});

export default function App() {
  // Debug: Log all loaded fonts (should include config plugin fonts)
  const loadedFonts = Font.getLoadedFonts();
  console.log('🔤 Loaded fonts:', loadedFonts);
  
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
      <Text>Loaded fonts count: {loadedFonts.length}</Text>
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
