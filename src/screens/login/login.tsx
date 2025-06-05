import { observer } from 'mobx-react';
import { Button, Text, View } from 'react-native-ui-lib';
import { NavioScreen } from 'rn-navio';

import { InputField } from '../../components/InputField';
import { styles } from '../../styles/globalStyles';
import { themeColors } from '../../theme/colors';
import { emailValidation } from '../../utils/validation';

import useAuth from './useAuth';

export const Main: NavioScreen = observer(() => {
  const { onNameChange, onEmailChange, onPasswordChange, onSignUp, onLogin } =
    useAuth();

  return (
    <View flex center backgroundColor={themeColors.bgColor}>
      <View center style={styles.width100Percent} marginB-40>
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
        />
      </View>
      <View
        marginT-small
        spread
        style={{ ...styles.height25Percent, ...styles.width80Percent }}
        paddingT-30
        paddingB-30
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
          onPress={onLogin}
          link
          labelStyle={{ color: themeColors.primaryColor }}
          backgroundColor={themeColors.primaryColor}
        />
      </View>
    </View>
  );
});
