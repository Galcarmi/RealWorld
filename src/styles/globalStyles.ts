import { StyleSheet } from 'react-native';

import { DIMENSIONS } from '../constants/styles';

const styles = StyleSheet.create({
  width100Percent: {
    width: DIMENSIONS.WIDTH_FULL,
  },
  width80Percent: {
    width: DIMENSIONS.WIDTH_80_PERCENT,
  },
  height25Percent: {
    height: DIMENSIONS.HEIGHT_25_PERCENT,
  },
  height60px: {
    height: DIMENSIONS.HEIGHT_60,
  },
});

export { styles };
