import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, View } from 'react-native-ui-lib';

import { observer } from 'mobx-react';
import { NavioScreen } from 'rn-navio';

import { themeColors } from '../../theme/colors';

import { componentStyles } from '../../styles/componentStyles';
import { styles } from '../../styles/globalStyles';

import { InputField } from '../../components/InputField';
import { TEST_IDS } from '../../constants';
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
          Sign In
        </Text>
        <InputField
          placeholder={'Email'}
          value={email}
          validationMessage={['Email is required', 'Not a valid email']}
          validation={emailValidation}
          containerStyle={{ ...styles.width80Percent, ...styles.height60px }}
          onChangeText={onEmailChange}
          testID={TEST_IDS.LOGIN_EMAIL_INPUT}
        />
        <InputField
          placeholder={'Password'}
          value={password}
          validationMessage={['Password is required', 'Password is too short']}
          containerStyle={{ ...styles.width80Percent, ...styles.height60px }}
          onChangeText={onPasswordChange}
          secureTextEntry={true}
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
          label={'Sign In'}
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
          Or
        </Text>
        <Button
          label={'Sign Up'}
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
