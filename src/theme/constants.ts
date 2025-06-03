import Constants from 'expo-constants';

export const isExpoGo = Constants.executionEnvironment === 'storeClient';

export const fontLoadingInfo = {
  isExpoGo,
  method: isExpoGo ? 'useFonts' : 'config-plugin',
  environment: isExpoGo ? 'development (Expo Go)' : 'production/development build'
}; 