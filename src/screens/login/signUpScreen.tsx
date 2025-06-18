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

export const Main: NavioScreen = observer(() => {
  const {
    onUsernameChange,
    onEmailChange,
    onPasswordChange,
    onSignUp,
    onNavigateToLogin,
    isLoading,
    isSignUpFormValid,
    email,
    password,
    username,
  } = useAuth();

  return (
    <SafeAreaView
      style={componentStyles.homeScreenSafeArea}
      testID={TEST_IDS.REGISTER_SCREEN}
    >
      <View center style={styles.width100Percent} marginB-40 marginT-40>
        <Text
          title
          primaryColor
          marginB-70
          testID={TEST_IDS.SIGNUP_SCREEN_TITLE}
        >
          Sign Up
        </Text>
        <InputField
          placeholder={'Username'}
          value={username}
          validationMessage={['Username is required', 'Username is too short']}
          containerStyle={{ ...styles.width80Percent, ...styles.height60px }}
          onChangeText={onUsernameChange}
          testID={TEST_IDS.SIGNUP_USERNAME_INPUT}
        />
        <InputField
          placeholder={'Email'}
          value={email}
          validationMessage={['Email is required', 'Not a valid email']}
          validation={emailValidation}
          containerStyle={{ ...styles.width80Percent, ...styles.height60px }}
          onChangeText={onEmailChange}
          testID={TEST_IDS.SIGNUP_EMAIL_INPUT}
        />
        <InputField
          placeholder={'Password'}
          value={password}
          validationMessage={['Password is required', 'Password is too short']}
          containerStyle={{ ...styles.width80Percent, ...styles.height60px }}
          onChangeText={onPasswordChange}
          secureTextEntry={true}
          testID={TEST_IDS.SIGNUP_PASSWORD_INPUT}
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
          label={'Sign Up'}
          onPress={onSignUp}
          fullWidth
          backgroundColor={
            isSignUpFormValid && !isLoading
              ? themeColors.primaryColor
              : themeColors.greyColor
          }
          disabled={!isSignUpFormValid || isLoading}
          testID={TEST_IDS.SIGNUP_SUBMIT_BUTTON}
        />
        <Text center color={themeColors.greyColor} marginT-small>
          Or
        </Text>
        <Button
          label={'Sign In'}
          onPress={onNavigateToLogin}
          link
          labelStyle={componentStyles.authButtonLabel}
          backgroundColor={themeColors.primaryColor}
          testID={TEST_IDS.SIGNUP_SIGNIN_BUTTON}
        />
      </View>
    </SafeAreaView>
  );
});
