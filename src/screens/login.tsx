import { observer } from 'mobx-react';
import { Text, View } from 'react-native-ui-lib';
import { NavioScreen } from 'rn-navio';

import { InputField } from '../components/InputField';
import { themeColors } from '../theme/colors';
import { emailValidation } from '../utils/validation';

export const Main: NavioScreen = observer(() => {
  return (
    <View flex center bg-white width-80 backgroundColor={themeColors.bgColor}>
      <Text title primaryColor marginB-small>
        Sign Up
      </Text>
      <InputField
        placeholder={'Username'}
        validationMessage={['Username is required', 'Username is too short']}
      />
      <InputField
        placeholder={'Email'}
        validationMessage={['Email is required', 'Not a valid email']}
        validation={emailValidation}
      />
      <InputField
        placeholder={'Password'}
        validationMessage={['Password is required', 'Password is too short']}
      />
    </View>
  );
});
