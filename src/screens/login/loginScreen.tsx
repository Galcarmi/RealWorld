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
      testID='login-screen'
    >
      <View center style={styles.width100Percent} marginB-40 marginT-40>
        <Text title primaryColor marginB-70 testID='login-screen-title'>
          Sign In
        </Text>
        <InputField
          placeholder={'Email'}
          value={email}
          validationMessage={['Email is required', 'Not a valid email']}
          validation={emailValidation}
          containerStyle={{ ...styles.width80Percent, ...styles.height60px }}
          onChangeText={onEmailChange}
          testID='login-email-input'
        />
        <InputField
          placeholder={'Password'}
          value={password}
          validationMessage={['Password is required', 'Password is too short']}
          containerStyle={{ ...styles.width80Percent, ...styles.height60px }}
          onChangeText={onPasswordChange}
          secureTextEntry={true}
          testID='login-password-input'
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
          testID='login-submit-button'
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
          testID='login-signup-button'
        />
      </View>
    </SafeAreaView>
  );
});
