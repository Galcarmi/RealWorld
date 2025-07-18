import { useCallback, useEffect } from 'react';
import { Keyboard } from 'react-native';

import { authStore } from '../../store/authStore';

import { navigationService } from '../../services';
import { showErrorModals } from '../../utils';

import { useStore } from './useStore';

const useAuth = () => {
  const { isLoading, user, errors } = useStore();

  const onUsernameChange = useCallback((value: string) => {
    authStore.setUsername(value);
  }, []);

  const onEmailChange = useCallback((value: string) => {
    authStore.setEmail(value);
  }, []);

  const onPasswordChange = useCallback((value: string) => {
    authStore.setPassword(value);
  }, []);

  const onSignUp = useCallback(async () => {
    Keyboard.dismiss();
    await authStore.register();
  }, []);

  const onLogin = useCallback(async () => {
    Keyboard.dismiss();
    await authStore.login();
  }, []);

  const onNavigateToLogin = useCallback(() => {
    navigationService.navigateToLoginScreen();
  }, []);

  const onNavigateToSignUp = useCallback(() => {
    navigationService.navigateToSignUpScreen();
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
    email: authStore.email,
    password: authStore.password,
    username: authStore.username,
    isLoginFormValid: authStore.isLoginFormValid,
    isSignUpFormValid: authStore.isSignUpFormValid,
    onUsernameChange,
    onEmailChange,
    onPasswordChange,
    onLogin,
    onSignUp,
    onNavigateToLogin,
    onNavigateToSignUp,
  };
};

export default useAuth;
