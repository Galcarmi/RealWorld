import { Spacings } from 'react-native-ui-lib';

export const themeSpacings = {
  page: 20,
  card: 12,
  gridGutter: 16
};

export const loadSpacings = () => {
  Spacings.loadSpacings(themeSpacings);
}; 