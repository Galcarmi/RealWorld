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
    onNameChange,
    onEmailChange,
    onPasswordChange,
    onSignUp,
    onNavigateToLogin,
  } = useAuth();

  return (
    <SafeAreaView style={componentStyles.homeScreenSafeArea}>
      <View center style={styles.width100Percent} marginB-40 marginT-40>
        <Text title primaryColor marginB-70>
          Sign Up
        </Text>
        <InputField
          placeholder={'Username'}
          validationMessage={['Username is required', 'Username is too short']}
          containerStyle={{ ...styles.width80Percent, ...styles.height60px }}
          onChangeText={onNameChange}
        />
        <InputField
          placeholder={'Email'}
          validationMessage={['Email is required', 'Not a valid email']}
          validation={emailValidation}
          containerStyle={{ ...styles.width80Percent, ...styles.height60px }}
          onChangeText={onEmailChange}
        />
        <InputField
          placeholder={'Password'}
          validationMessage={['Password is required', 'Password is too short']}
          containerStyle={{ ...styles.width80Percent, ...styles.height60px }}
          onChangeText={onPasswordChange}
          secureTextEntry={true}
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
          backgroundColor={themeColors.primaryColor}
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
        />
      </View>
    </SafeAreaView>
  );
});
