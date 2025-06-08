import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';
import { Keyboard } from 'react-native';

import type { RootStackParamList } from '../../navigation/types';
import { authStore } from '../../store/authStore';
import { showErrorModals } from '../../utils';

import { useStore } from './useStore';

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
    console.log('onSignUp');
    Keyboard.dismiss();
    authStore.register();
  }, []);

  const onLogin = useCallback(async () => {
    Keyboard.dismiss();
    authStore.login();
  }, []);

  const onNavigateToLogin = useCallback(() => {
    navigation.navigate('SignIn');
  }, [navigation]);

  const onNavigateToSignUp = useCallback(() => {
    navigation.navigate('Login');
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
