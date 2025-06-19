import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native-ui-lib';

import { observer } from 'mobx-react';
import { NavioScreen } from 'rn-navio';

import { COLORS, SPACINGS } from '../../constants/styles';

import { LoginActions } from '../../components/LoginActions';
import { LoginForm } from '../../components/LoginForm';
import { LoginHeader } from '../../components/LoginHeader';
import { TEST_IDS } from '../../constants';

import useAuth from './useAuth';

export const LoginScreen: NavioScreen = observer(() => {
  const {
    onEmailChange,
    onPasswordChange,
    onNavigateToSignUp,
    onLogin,
    isLoading,
    isLoginFormValid,
    email,
    password,
  } = useAuth();

  const screenStyles = useMemo(() => createScreenStyles(), []);

  return (
    <SafeAreaView style={screenStyles.container} testID={TEST_IDS.LOGIN_SCREEN}>
      <View style={screenStyles.topSpacer} />
      <View style={screenStyles.middleSpacer}>
        <LoginHeader containerStyle={screenStyles.headerContainer} />

        <LoginForm
          email={email}
          password={password}
          onEmailChange={onEmailChange}
          onPasswordChange={onPasswordChange}
          containerStyle={screenStyles.formContainer}
        />

        <LoginActions
          onLogin={onLogin}
          onNavigateToSignUp={onNavigateToSignUp}
          isLoading={isLoading}
          isLoginFormValid={isLoginFormValid}
          containerStyle={screenStyles.actionsContainer}
        />
      </View>
      <View style={screenStyles.bottomSpacer} />
    </SafeAreaView>
  );
});

const createScreenStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.BACKGROUND,
    },
    topSpacer: {
      flex: 0.2,
    },
    bottomSpacer: {
      flex: 0.2,
    },
    middleSpacer: {
      flex: 0.6,
    },
    headerContainer: {
      marginBottom: SPACINGS.MARGIN_HUGE,
    },
    formContainer: {
      alignItems: 'center',
    },
    actionsContainer: {
      flex: 1,
      alignItems: 'center',
      gap: SPACINGS.MARGIN_LARGE,
      paddingVertical: SPACINGS.MARGIN_2X_EXTRA_LARGE,
      marginTop: SPACINGS.MARGIN_3X_EXTRA_LARGE,
    },
  });
