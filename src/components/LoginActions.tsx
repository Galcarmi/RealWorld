import { useMemo } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Button, Text, View } from 'react-native-ui-lib';

import { TEST_IDS, BUTTON_LABELS } from '../constants';
import { COLORS, DIMENSIONS } from '../constants/styles';

interface LoginActionsProps {
  onLogin: () => void;
  onNavigateToSignUp: () => void;
  isLoading: boolean;
  isLoginFormValid: boolean;
  containerStyle?: ViewStyle;
}

export const LoginActions = ({
  onLogin,
  onNavigateToSignUp,
  isLoading,
  isLoginFormValid,
  containerStyle,
}: LoginActionsProps) => {
  const styles = useMemo(() => createStyles(), []);

  return (
    <View style={containerStyle}>
      <Button
        label={BUTTON_LABELS.SIGN_IN}
        onPress={onLogin}
        fullWidth
        backgroundColor={
          isLoginFormValid && !isLoading ? COLORS.PRIMARY : COLORS.GREY
        }
        style={styles.loginButton}
        disabled={!isLoginFormValid || isLoading}
        testID={TEST_IDS.LOGIN_SUBMIT_BUTTON}
      />
      <Text color={COLORS.GREY}>{BUTTON_LABELS.OR}</Text>
      <Button
        label={BUTTON_LABELS.SIGN_UP}
        onPress={onNavigateToSignUp}
        link
        labelStyle={{ color: COLORS.PRIMARY }}
        backgroundColor={COLORS.PRIMARY}
        testID={TEST_IDS.LOGIN_SIGNUP_BUTTON}
      />
    </View>
  );
};

const createStyles = () =>
  StyleSheet.create({
    loginButton: {
      width: DIMENSIONS.WIDTH_80_PERCENT,
    },
  });
