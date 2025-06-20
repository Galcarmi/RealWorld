import { ViewStyle } from 'react-native';
import { View } from 'react-native-ui-lib';

import { observer } from 'mobx-react';

import { TEST_IDS, INPUT_SECURITY } from '../constants';
import { AUTH_SCREEN_TYPE } from '../constants/app';
import { DIMENSIONS } from '../constants/styles';
import { useTranslation } from '../hooks/useTranslation';
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

export const AuthForm = observer(
  ({
    email,
    password,
    username,
    onEmailChange,
    onPasswordChange,
    containerStyle,
    screenType,
    onUsernameChange,
  }: AuthFormProps) => {
    const { t } = useTranslation();

    return (
      <View style={containerStyle}>
        {screenType === AUTH_SCREEN_TYPE.SIGN_UP && (
          <InputField
            placeholder={t('placeholders.username')}
            value={username}
            validationMessage={[
              t('validation.usernameRequired'),
              t('validation.usernameTooShort'),
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
          placeholder={t('placeholders.email')}
          value={email}
          validationMessage={[
            t('validation.emailRequired'),
            t('validation.emailInvalid'),
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
          placeholder={t('placeholders.password')}
          value={password}
          validationMessage={[
            t('validation.passwordRequired'),
            t('validation.passwordTooShort'),
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
  }
);
