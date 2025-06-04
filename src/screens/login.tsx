import {Text, View} from 'react-native-ui-lib';
import {observer} from 'mobx-react';
import {NavioScreen} from 'rn-navio';

export const Main: NavioScreen = observer(({}) => {
  return (
    <View flex center bg-white>
      <Text>Login</Text>
    </View>
  );
});
