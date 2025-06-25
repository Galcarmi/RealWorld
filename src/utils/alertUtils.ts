import { Alert } from 'react-native';

import { ALERT_BUTTONS, ERROR_TYPES } from '../constants';

export const showErrorAlert = (
  title?: string,
  message?: string,
  buttons = [{ text: ALERT_BUTTONS.OK }]
) => {
  Alert.alert(title || ERROR_TYPES.GENERIC, message || '', buttons);
};
