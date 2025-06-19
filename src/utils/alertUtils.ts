import { Alert } from 'react-native';

import { ALERT_BUTTONS, ERROR_TYPES } from '../constants';

export const showErrorAlert = (
  title?: string,
  message?: string,
  buttons = [{ text: ALERT_BUTTONS.OK }]
) => {
  Alert.alert(title || ERROR_TYPES.GENERIC, message || '', buttons);
};

export const showInfoAlert = (title: string, message: string) => {
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
      style: "cancel",
    },
    { text: ALERT_BUTTONS.OK, onPress: onConfirm },
  ]);
};
