import { observer } from 'mobx-react';
import { Button, Text, View } from 'react-native-ui-lib';
import { NavioScreen } from 'rn-navio';

import { InputField } from '../components/InputField';
import { styles } from '../styles/globalStyles';
import { themeColors } from '../theme/colors';
import { emailValidation } from '../utils/validation';

export const Main: NavioScreen = observer(() => {
  return (
    <View flex center backgroundColor={themeColors.bgColor}>
      <View center style={styles.width100} marginB-20>
        <Text title primaryColor>
          Sign Up
        </Text>
        <InputField
          placeholder={'Username'}
          validationMessage={['Username is required', 'Username is too short']}
          containerStyle={styles.width80}
        />
        <InputField
          placeholder={'Email'}
          validationMessage={['Email is required', 'Not a valid email']}
          validation={emailValidation}
          containerStyle={styles.width80}
        />
        <InputField
          placeholder={'Password'}
          validationMessage={['Password is required', 'Password is too short']}
          containerStyle={styles.width80}
        />
      </View>
      <View
        marginT-small
        spread
        style={{ ...styles.height25, ...styles.width80 }}
        paddingT-30
        paddingB-30
      >
        <Button
          label={'Sign Up'}
          onPress={() => {
            console.log('Sign Up pressed - implement navigation logic');
          }}
          fullWidth
          backgroundColor={themeColors.primaryColor}
        />
        <Text center color={themeColors.greyColor} marginT-small>
          Or
        </Text>
        <Button
          label={'Sign In'}
          onPress={() => {
            console.log('Sign In pressed - implement navigation logic');
          }}
          link
          labelStyle={{ color: themeColors.primaryColor }}
          backgroundColor={themeColors.primaryColor}
        />
      </View>
    </View>
  );
});
