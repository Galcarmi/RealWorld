import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, View } from 'react-native-ui-lib';

import { observer } from 'mobx-react';
import { NavioScreen } from 'rn-navio';

import { COLORS, SPACINGS, DIMENSIONS } from '../../constants/styles';

import { InputField } from '../../components/InputField';
import {
  TEST_IDS,
  SCREEN_TITLES,
  PLACEHOLDERS,
  VALIDATION_MESSAGES,
  BUTTON_LABELS,
  INPUT_SECURITY,
} from '../../constants';
import { emailValidation } from '../../utils';

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

  const styles = useMemo(
    () => createStyles(isLoginFormValid, isLoading),
    [isLoginFormValid, isLoading]
  );

  return (
    <SafeAreaView style={styles.container} testID={TEST_IDS.LOGIN_SCREEN}>
      <View center style={styles.formContainer}>
        <Text
          title
          primaryColor
          marginB-70
          testID={TEST_IDS.LOGIN_SCREEN_TITLE}
        >
          {SCREEN_TITLES.SIGN_IN}
        </Text>
        <InputField
          placeholder={PLACEHOLDERS.EMAIL}
          value={email}
          validationMessage={[
            VALIDATION_MESSAGES.EMAIL_REQUIRED,
            VALIDATION_MESSAGES.EMAIL_INVALID,
          ]}
          validation={emailValidation}
          containerStyle={{
            width: DIMENSIONS.WIDTH_80_PERCENT,
            height: DIMENSIONS.HEIGHT_60,
          }}
          onChangeText={onEmailChange}
          testID={TEST_IDS.LOGIN_EMAIL_INPUT}
        />
        <InputField
          placeholder={PLACEHOLDERS.PASSWORD}
          value={password}
          validationMessage={[
            VALIDATION_MESSAGES.PASSWORD_REQUIRED,
            VALIDATION_MESSAGES.PASSWORD_TOO_SHORT,
          ]}
          containerStyle={{
            width: DIMENSIONS.WIDTH_80_PERCENT,
            height: DIMENSIONS.HEIGHT_60,
          }}
          onChangeText={onPasswordChange}
          secureTextEntry={INPUT_SECURITY.SECURE_TEXT_ENTRY}
          testID={TEST_IDS.LOGIN_PASSWORD_INPUT}
        />
      </View>
      <View
        marginT-small
        spread
        style={{
          height: DIMENSIONS.HEIGHT_25_PERCENT,
          width: DIMENSIONS.WIDTH_80_PERCENT,
        }}
        paddingT-30
        paddingB-30
        marginL-40
      >
        <Button
          label={BUTTON_LABELS.SIGN_IN}
          onPress={onLogin}
          fullWidth
          backgroundColor={styles.submitButton.backgroundColor}
          disabled={!isLoginFormValid || isLoading}
          testID={TEST_IDS.LOGIN_SUBMIT_BUTTON}
        />
        <Text center color={COLORS.GREY} marginT-small>
          {BUTTON_LABELS.OR}
        </Text>
        <Button
          label={BUTTON_LABELS.SIGN_UP}
          onPress={onNavigateToSignUp}
          link
          labelStyle={styles.authButtonLabel}
          backgroundColor={COLORS.PRIMARY}
          testID={TEST_IDS.LOGIN_SIGNUP_BUTTON}
        />
      </View>
    </SafeAreaView>
  );
});

const createStyles = (isLoginFormValid: boolean, isLoading: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.BACKGROUND,
    },
    formContainer: {
      width: DIMENSIONS.WIDTH_FULL,
      marginBottom: SPACINGS.MARGIN_XXL,
      marginTop: SPACINGS.MARGIN_XXL,
    },
    submitButton: {
      backgroundColor:
        isLoginFormValid && !isLoading ? COLORS.PRIMARY : COLORS.GREY,
    },
    authButtonLabel: {
      color: COLORS.PRIMARY,
    },
  });
