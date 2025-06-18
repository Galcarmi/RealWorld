import { observer } from 'mobx-react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, View } from 'react-native-ui-lib';
import { NavioScreen } from 'rn-navio';

import { InputField } from '../../components/InputField';
import { componentStyles } from '../../styles/componentStyles';
import { styles } from '../../styles/globalStyles';
import { themeColors } from '../../theme/colors';
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
      testID='register-screen'
    >
      <View center style={styles.width100Percent} marginB-40 marginT-40>
        <Text title primaryColor marginB-70 testID='signup-screen-title'>
          Sign Up
        </Text>
        <InputField
          placeholder={'Username'}
          value={username}
          validationMessage={['Username is required', 'Username is too short']}
          containerStyle={{ ...styles.width80Percent, ...styles.height60px }}
          onChangeText={onUsernameChange}
          testID='signup-username-input'
        />
        <InputField
          placeholder={'Email'}
          value={email}
          validationMessage={['Email is required', 'Not a valid email']}
          validation={emailValidation}
          containerStyle={{ ...styles.width80Percent, ...styles.height60px }}
          onChangeText={onEmailChange}
          testID='signup-email-input'
        />
        <InputField
          placeholder={'Password'}
          value={password}
          validationMessage={['Password is required', 'Password is too short']}
          containerStyle={{ ...styles.width80Percent, ...styles.height60px }}
          onChangeText={onPasswordChange}
          secureTextEntry={true}
          testID='signup-password-input'
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
          testID='signup-submit-button'
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
          testID='signup-signin-button'
        />
      </View>
    </SafeAreaView>
  );
});
