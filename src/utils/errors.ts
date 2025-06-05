import { Alert } from 'react-native';

import { ResponseErrors } from '../services/types';

export const showErrorModals = (errors: ResponseErrors) => {
  Object.entries(errors).forEach(([key, value]) => {
    Alert.alert(`${key} ${value}`);
  });
};
