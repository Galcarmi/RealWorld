import { useFonts } from 'expo-font';

const fontAssets = {
  'WixMadeforText-Regular': require('../../assets/fonts/WixMadeFor/static/WixMadeforText-Regular.ttf'),
  'WixMadeforText-Medium': require('../../assets/fonts/WixMadeFor/static/WixMadeforText-Medium.ttf'),
  'WixMadeforText-SemiBold': require('../../assets/fonts/WixMadeFor/static/WixMadeforText-SemiBold.ttf'),
  'WixMadeforText-Bold': require('../../assets/fonts/WixMadeFor/static/WixMadeforText-Bold.ttf'),
  'WixMadeforText-ExtraBold': require('../../assets/fonts/WixMadeFor/static/WixMadeforText-ExtraBold.ttf'),
};

export const useCustomFonts = () => {
  return useFonts(fontAssets);
};
