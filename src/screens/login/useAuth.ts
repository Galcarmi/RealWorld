import { useCallback, useEffect } from 'react';
import { Keyboard } from 'react-native';

import { authStore } from '../../store/authStore';
import { showErrorModals } from '../../utils/errors';

import { useStore } from './useStore';

const useAuth = () => {
  const { isLoading, user, errors } = useStore();

  const onNameChange = useCallback((value: string) => {
    authStore.setUsername(value);
  }, []);

  const onEmailChange = useCallback((value: string) => {
    authStore.setEmail(value);
  }, []);

  const onPasswordChange = useCallback((value: string) => {
    authStore.setPassword(value);
  }, []);

  const onSignUp = useCallback(async () => {
    console.log('onSignUp');
    Keyboard.dismiss();
    authStore.register();
  }, []);

  const onLogin = useCallback(async () => {
    Keyboard.dismiss();
    authStore.login();
  }, []);

  useEffect(() => {
    if (errors) {
      showErrorModals(errors);
    }
  }, [errors]);

  useEffect(() => () => authStore.clear(), []);

  return {
    user,
    isLoading,
    onNameChange,
    onEmailChange,
    onPasswordChange,
    onLogin,
    onSignUp,
  };
};

export default useAuth;
