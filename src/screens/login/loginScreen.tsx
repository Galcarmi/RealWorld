import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, View } from 'react-native-ui-lib';

import { observer } from 'mobx-react';
import { NavioScreen } from 'rn-navio';

import { themeColors } from '../../constants/styles';

import { styles as globalStyles } from '../../styles/globalStyles';

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
            ...globalStyles.width80Percent,
            ...globalStyles.height60px,
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
            ...globalStyles.width80Percent,
            ...globalStyles.height60px,
          }}
          onChangeText={onPasswordChange}
          secureTextEntry={INPUT_SECURITY.SECURE_TEXT_ENTRY}
          testID={TEST_IDS.LOGIN_PASSWORD_INPUT}
        />
      </View>
      <View
        marginT-small
        spread
        style={[globalStyles.height25Percent, globalStyles.width80Percent]}
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
        <Text center color={themeColors.greyColor} marginT-small>
          {BUTTON_LABELS.OR}
        </Text>
        <Button
          label={BUTTON_LABELS.SIGN_UP}
          onPress={onNavigateToSignUp}
          link
          labelStyle={styles.authButtonLabel}
          backgroundColor={themeColors.primaryColor}
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
      backgroundColor: themeColors.bgColor,
    },
    formContainer: {
      width: '100%',
      marginBottom: 40,
      marginTop: 40,
    },
    submitButton: {
      backgroundColor:
        isLoginFormValid && !isLoading
          ? themeColors.primaryColor
          : themeColors.greyColor,
    },
    authButtonLabel: {
      color: themeColors.primaryColor,
    },
  });
