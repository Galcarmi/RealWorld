import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native-ui-lib';

import { observer } from 'mobx-react';

import { AUTH_SCREEN_TYPE } from '../../constants/app';
import { COLORS, SPACINGS } from '../../constants/styles';

import { AuthActions, AuthForm, AuthHeader } from '../../components';
import { TEST_IDS } from '../../constants';

import useAuth from './useAuth';

export const createAuthScreen: (screenType: AUTH_SCREEN_TYPE) => React.FC = (
  screenType: AUTH_SCREEN_TYPE
) =>
  observer(() => {
    const {
      onEmailChange,
      onPasswordChange,
      onNavigateToSignUp,
      onLogin,
      isLoading,
      isLoginFormValid,
      email,
      password,
      username,
      onUsernameChange,
      isSignUpFormValid,
      onSignUp,
      onNavigateToLogin,
    } = useAuth();

    const screenTestId =
      screenType === AUTH_SCREEN_TYPE.SIGN_IN
        ? TEST_IDS.SIGNIN_SCREEN
        : TEST_IDS.SIGNUP_SCREEN;

    return (
      <SafeAreaView style={screenStyles.container} testID={screenTestId}>
        <View style={screenStyles.topSpacer} />
        <View style={screenStyles.middleSpacer}>
          <AuthHeader
            containerStyle={screenStyles.headerContainer}
            screenType={screenType}
          />

          <AuthForm
            email={email}
            password={password}
            onEmailChange={onEmailChange}
            onPasswordChange={onPasswordChange}
            containerStyle={screenStyles.formContainer}
            screenType={screenType}
            username={username}
            onUsernameChange={onUsernameChange}
          />

          <AuthActions
            onLogin={onLogin}
            onNavigateToSignUp={onNavigateToSignUp}
            isLoading={isLoading}
            isLoginFormValid={isLoginFormValid}
            containerStyle={screenStyles.actionsContainer}
            screenType={screenType}
            isSignUpFormValid={isSignUpFormValid}
            onSignUp={onSignUp}
            onNavigateToLogin={onNavigateToLogin}
          />
        </View>
        <View style={screenStyles.bottomSpacer} />
      </SafeAreaView>
    );
  });

const screenStyles = StyleSheet.create({
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
    marginBottom: SPACINGS.GIGANTIC,
  },
  formContainer: {
    alignItems: 'center',
  },
  actionsContainer: {
    flex: 1,
    alignItems: 'center',
    gap: SPACINGS.LARGE,
    paddingVertical: SPACINGS['2_EXTRA_LARGE'],
    marginTop: SPACINGS.MASSIVE,
  },
});
