import { useMemo } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Button, Text, View } from 'react-native-ui-lib';

import { TEST_IDS, BUTTON_LABELS } from '../constants';
import { AUTH_SCREEN_TYPE } from '../constants/app';
import { COLORS, DIMENSIONS, SPACINGS } from '../constants/styles';

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
  const styles = useMemo(() => createStyles(), []);

  const buttonLabel =
    screenType === AUTH_SCREEN_TYPE.SIGN_IN
      ? BUTTON_LABELS.SIGN_IN
      : BUTTON_LABELS.SIGN_UP;
  const buttonTestID = TEST_IDS.AUTH_SUBMIT_BUTTON;
  const buttonOnPress =
    screenType === AUTH_SCREEN_TYPE.SIGN_IN ? onLogin : onSignUp;
  const onNavigateToOtherAuthScreen =
    screenType === AUTH_SCREEN_TYPE.SIGN_IN
      ? onNavigateToSignUp
      : onNavigateToLogin;
  const otherAuthScreenButtonLabel =
    screenType === AUTH_SCREEN_TYPE.SIGN_IN
      ? BUTTON_LABELS.SIGN_UP
      : BUTTON_LABELS.SIGN_IN;
  const otherAuthScreenButtonTestID =
    screenType === AUTH_SCREEN_TYPE.SIGN_IN
      ? TEST_IDS.AUTH_SIGNUP_BUTTON
      : TEST_IDS.AUTH_SUBMIT_BUTTON;
  const buttonBackgroundColor =
    screenType === AUTH_SCREEN_TYPE.SIGN_IN
      ? isLoginFormValid && !isLoading
        ? COLORS.PRIMARY
        : COLORS.GREY
      : isSignUpFormValid && !isLoading
        ? COLORS.PRIMARY
        : COLORS.GREY;
  const buttonDisabled =
    screenType === AUTH_SCREEN_TYPE.SIGN_IN
      ? !isLoginFormValid || isLoading
      : !isSignUpFormValid || isLoading;

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

const createStyles = () =>
  StyleSheet.create({
    submitButton: {
      width: DIMENSIONS.WIDTH_80_PERCENT,
      padding: SPACINGS.MARGIN_SMALL,
    },
    otherAuthScreenButton: {
      width: DIMENSIONS.WIDTH_80_PERCENT,
    },
  });
