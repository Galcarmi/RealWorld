import { ViewStyle } from 'react-native';
import { View } from 'react-native-ui-lib';

import {
  TEST_IDS,
  PLACEHOLDERS,
  VALIDATION_MESSAGES,
  INPUT_SECURITY,
} from '../constants';
import { DIMENSIONS } from '../constants/styles';
import { emailValidation } from '../utils';

import { InputField } from './InputField';

interface LoginFormProps {
  email: string;
  password: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  containerStyle?: ViewStyle;
}

export const LoginForm = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  containerStyle,
}: LoginFormProps) => {
  return (
    <View style={containerStyle}>
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
  );
};
