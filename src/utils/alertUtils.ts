import { Alert } from 'react-native';

import { ALERT_BUTTONS, ALERT_BUTTON_STYLES, ERROR_TYPES } from '../constants';

export const showErrorAlert = (
  title?: string,
  message?: string,
  buttons = [{ text: ALERT_BUTTONS.OK }]
) => {
  Alert.alert(title || ERROR_TYPES.GENERIC, message || '', buttons);
};

export const showAlert = (title: string, message: string) => {
  Alert.alert(title, message, [{ text: ALERT_BUTTONS.OK }]);
};

export const showConfirmAlert = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
) => {
  Alert.alert(title, message, [
    {
      text: ALERT_BUTTONS.CANCEL,
      onPress: onCancel,
      style: ALERT_BUTTON_STYLES.CANCEL,
    },
    { text: ALERT_BUTTONS.OK, onPress: onConfirm },
  ]);
};
