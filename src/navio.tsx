import { Navio } from 'rn-navio';

import { HomeScreen } from './screens/homeScreen/homeScreen';
import { LoginScreen as SignInScreen } from './screens/login/loginScreen';
import { Main as SignUpScreen } from './screens/login/signUpScreen';

const navio = Navio.build({
  screens: {
    Login: SignUpScreen,
    SignIn: SignInScreen,
    Home: HomeScreen,
  },
  stacks: {
    AuthStack: ['Login', 'SignIn'],
    MainStack: ['Home'],
  },
  defaultOptions: {
    stacks: {
      screen: {
        headerShown: false,
      },
    },
  },
  root: 'stacks.AuthStack',
});

export { navio };
