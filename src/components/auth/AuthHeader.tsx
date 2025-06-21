import { ViewStyle, TextStyle } from 'react-native';
import { Text, View } from 'react-native-ui-lib';

import { AUTH_SCREEN_TYPE } from '../../constants/app';

import { TEST_IDS, SCREEN_TITLES } from '../../constants';

interface AuthHeaderProps {
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  screenType: AUTH_SCREEN_TYPE;
}

export const AuthHeader = ({
  containerStyle,
  textStyle,
  screenType,
}: AuthHeaderProps) => {
  const title =
    screenType === AUTH_SCREEN_TYPE.SIGN_IN
      ? SCREEN_TITLES.SIGN_IN
      : SCREEN_TITLES.SIGN_UP;

  return (
    <View center style={containerStyle}>
      <Text
        title
        primaryColor
        style={textStyle}
        testID={TEST_IDS.AUTH_SCREEN_TITLE}
      >
        {title}
      </Text>
    </View>
  );
};
