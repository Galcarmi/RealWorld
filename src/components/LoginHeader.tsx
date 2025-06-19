import { ViewStyle, TextStyle } from 'react-native';
import { Text, View } from 'react-native-ui-lib';

import { TEST_IDS, SCREEN_TITLES } from '../constants';

interface LoginHeaderProps {
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
}

export const LoginHeader = ({
  containerStyle,
  textStyle,
}: LoginHeaderProps = {}) => {
  return (
    <View center style={containerStyle}>
      <Text
        title
        primaryColor
        style={textStyle}
        testID={TEST_IDS.LOGIN_SCREEN_TITLE}
      >
        {SCREEN_TITLES.SIGN_IN}
      </Text>
    </View>
  );
};
