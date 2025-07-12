import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Button, Text, View } from 'react-native-ui-lib';

import { AUTH_SCREEN_TYPE } from '../../constants/app';
import { COLORS, DIMENSIONS, SPACINGS } from '../../constants/styles';

import { TEST_IDS, BUTTON_LABELS } from '../../constants';

interface AuthActionsProps {
  onLogin: () => void;
  onSignUp: () => void;
  onNavigateToSignUp: () => void;
  isLoading: boolean;
  isLoginFormValid: boolean;
  isSignUpFormValid: boolean;
  containerStyle?: ViewStyle;
  screenType: AUTH_SCREEN_TYPE;
  onNavigateToLogin: () => void;
}

export const AuthActions = ({
  onLogin,
  onNavigateToSignUp,
  isLoading,
  isLoginFormValid,
  containerStyle,
  screenType,
  isSignUpFormValid,
  onSignUp,
  onNavigateToLogin,
}: AuthActionsProps) => {
  const isSignIn = screenType === AUTH_SCREEN_TYPE.SIGN_IN;

  const buttonLabel = isSignIn ? BUTTON_LABELS.SIGN_IN : BUTTON_LABELS.SIGN_UP;
  const buttonTestID = TEST_IDS.AUTH_SUBMIT_BUTTON;
  const buttonOnPress = isSignIn ? onLogin : onSignUp;
  const onNavigateToOtherAuthScreen = isSignIn
    ? onNavigateToSignUp
    : onNavigateToLogin;
  const otherAuthScreenButtonLabel = isSignIn
    ? BUTTON_LABELS.SIGN_UP
    : BUTTON_LABELS.SIGN_IN;
  const otherAuthScreenButtonTestID = isSignIn
    ? TEST_IDS.AUTH_SIGNUP_BUTTON
    : TEST_IDS.AUTH_SIGNIN_BUTTON;

  const isFormValid = isSignIn ? isLoginFormValid : isSignUpFormValid;
  const buttonBackgroundColor =
    isFormValid && !isLoading ? COLORS.PRIMARY : COLORS.GREY;
  const buttonDisabled = !isFormValid || isLoading;

  return (
    <View style={containerStyle}>
      <Button
        label={buttonLabel}
        onPress={buttonOnPress}
        fullWidth
        backgroundColor={buttonBackgroundColor}
        style={styles.submitButton}
        disabled={buttonDisabled}
        testID={buttonTestID}
      />
      <Text color={COLORS.GREY}>{BUTTON_LABELS.OR}</Text>
      <Button
        label={otherAuthScreenButtonLabel}
        onPress={onNavigateToOtherAuthScreen}
        link
        style={styles.otherAuthScreenButton}
        labelStyle={{ color: COLORS.PRIMARY }}
        backgroundColor={COLORS.TRANSPARENT}
        testID={otherAuthScreenButtonTestID}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    width: DIMENSIONS.WIDTH_80_PERCENT,
    padding: SPACINGS.SMALL,
  },
  otherAuthScreenButton: {
    width: DIMENSIONS.WIDTH_80_PERCENT,
  },
});
