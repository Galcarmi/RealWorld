import { Alert } from 'react-native';

export const showErrorAlert = (title?: string, message?: string) => {
  Alert.alert(
    title || 'Error',
    message || 'Something went wrong, please try again',
    [{ text: 'OK' }]
  );
};

export const showInfoAlert = (title: string, message?: string) => {
  Alert.alert(title, message, [{ text: 'OK' }]);
};

export const showConfirmAlert = (
  title: string,
  message?: string,
  onConfirm?: () => void,
  onCancel?: () => void
) => {
  Alert.alert(title, message, [
    { text: 'Cancel', onPress: onCancel, style: 'cancel' },
    { text: 'OK', onPress: onConfirm },
  ]);
};
