import { observer } from 'mobx-react';
import { Alert } from 'react-native';
import { Button, Text, View } from 'react-native-ui-lib';
import { NavioScreen } from 'rn-navio';

import { InputField } from '../../components/InputField';
import { styles } from '../../styles/globalStyles';
import { themeColors } from '../../theme/colors';
import { emailValidation } from '../../utils/validation';

export const Main: NavioScreen = observer(() => {
  return (
    <View flex center backgroundColor={themeColors.bgColor}>
      <View center style={styles.width100Percent} marginB-40>
        <Text title primaryColor marginB-70>
          Sign Up
        </Text>
        <InputField
          placeholder={'Username'}
          validationMessage={['Username is required', 'Username is too short']}
          containerStyle={{...styles.width80Percent, ...styles.height60px}}
        />
        <InputField
          placeholder={'Email'}
          validationMessage={['Email is required', 'Not a valid email']}
          validation={emailValidation}
          containerStyle={{...styles.width80Percent, ...styles.height60px}}
        />
        <InputField
          placeholder={'Password'}
          validationMessage={['Password is required', 'Password is too short']}
          containerStyle={{...styles.width80Percent, ...styles.height60px}}
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
          onPress={() => {
            Alert.alert('Sign Up pressed - implement navigation logic');
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
            Alert.alert('Sign In', 'Sign In pressed - implement navigation logic');
          }}
          link
          labelStyle={{ color: themeColors.primaryColor }}
          backgroundColor={themeColors.primaryColor}
        />
      </View>
    </View>
  );
});
