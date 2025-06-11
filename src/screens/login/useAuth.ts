import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';
import { Keyboard } from 'react-native';

import type { RootStackParamList } from '../../navigation/types';
import { authStore } from '../../store/authStore';
import { showErrorModals } from '../../utils';

import { useStore } from './useStore';
import { navigationService } from '../../services';

type NavigationProps = NavigationProp<RootStackParamList>;

const useAuth = () => {
  const { isLoading, user, errors } = useStore();
  const navigation = useNavigation<NavigationProps>();

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
    Keyboard.dismiss();
    authStore.register();
  }, []);

  const onLogin = useCallback(async () => {
    Keyboard.dismiss();
    authStore.login();
  }, []);

  const onNavigateToLogin = useCallback(() => {
    navigationService.navigateToLoginScreen();
  }, [navigation]);

  const onNavigateToSignUp = useCallback(() => {
    navigationService.navigateToSignUpScreen();
  }, [navigation]);

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
    onNavigateToLogin,
    onNavigateToSignUp,
  };
};

export default useAuth;
