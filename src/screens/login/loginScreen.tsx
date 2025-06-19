import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, View } from 'react-native-ui-lib';

import { observer } from 'mobx-react';
import { NavioScreen } from 'rn-navio';

import { themeColors } from '../../constants/styles';

import { componentStyles } from '../../styles/componentStyles';
import { styles } from '../../styles/globalStyles';

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

  return (
    <SafeAreaView
      style={componentStyles.homeScreenSafeArea}
      testID={TEST_IDS.LOGIN_SCREEN}
    >
      <View center style={styles.width100Percent} marginB-40 marginT-40>
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
          containerStyle={{ ...styles.width80Percent, ...styles.height60px }}
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
          containerStyle={{ ...styles.width80Percent, ...styles.height60px }}
          onChangeText={onPasswordChange}
          secureTextEntry={INPUT_SECURITY.SECURE_TEXT_ENTRY}
          testID={TEST_IDS.LOGIN_PASSWORD_INPUT}
        />
      </View>
      <View
        marginT-small
        spread
        style={{ ...styles.height25Percent, ...styles.width80Percent }}
        paddingT-30
        paddingB-30
        marginL-40
      >
        <Button
          label={BUTTON_LABELS.SIGN_IN}
          onPress={onLogin}
          fullWidth
          backgroundColor={
            isLoginFormValid && !isLoading
              ? themeColors.primaryColor
              : themeColors.greyColor
          }
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
          labelStyle={componentStyles.authButtonLabel}
          backgroundColor={themeColors.primaryColor}
          testID={TEST_IDS.LOGIN_SIGNUP_BUTTON}
        />
      </View>
    </SafeAreaView>
  );
});
