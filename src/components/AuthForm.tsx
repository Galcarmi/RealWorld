import { ViewStyle } from 'react-native';
import { View } from 'react-native-ui-lib';

import {
  TEST_IDS,
  PLACEHOLDERS,
  VALIDATION_MESSAGES,
  INPUT_SECURITY,
} from '../constants';
import { AUTH_SCREEN_TYPE } from '../constants/app';
import { DIMENSIONS } from '../constants/styles';
import { emailValidation } from '../utils';

import { InputField } from './InputField';

interface AuthFormProps {
  email: string;
  password: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  containerStyle?: ViewStyle;
  screenType: AUTH_SCREEN_TYPE;
  username: string;
  onUsernameChange: (username: string) => void;
}

export const AuthForm = ({
  email,
  password,
  username,
  onEmailChange,
  onPasswordChange,
  containerStyle,
  screenType,
  onUsernameChange,
}: AuthFormProps) => {
  return (
    <View style={containerStyle}>
      {screenType === AUTH_SCREEN_TYPE.SIGN_UP && (
        <InputField
          placeholder={PLACEHOLDERS.USERNAME}
          value={username}
          validationMessage={[
            VALIDATION_MESSAGES.USERNAME_REQUIRED,
            VALIDATION_MESSAGES.USERNAME_TOO_SHORT,
          ]}
          containerStyle={{
            width: DIMENSIONS.WIDTH_80_PERCENT,
            height: DIMENSIONS.HEIGHT_60,
          }}
          onChangeText={onUsernameChange}
          testID={TEST_IDS.AUTH_USERNAME_INPUT}
        />
      )}
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
        testID={TEST_IDS.AUTH_EMAIL_INPUT}
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
        testID={TEST_IDS.AUTH_PASSWORD_INPUT}
      />
    </View>
  );
};
