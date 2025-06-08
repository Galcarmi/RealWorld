import { Navio } from 'rn-navio';

import { LoginScreen as SignInScreen } from './screens/login/loginScreen';
import { Main as SignUpScreen } from './screens/login/signUpScreen';

const navio = Navio.build({
  screens: {
    Login: SignUpScreen,
    SignIn: SignInScreen,
  },
  stacks: {
    MainStack: ['Login', 'SignIn'],
  },
  defaultOptions: {
    stacks: {
      screen: {
        headerShown: false,
      },
    },
  },
  root: 'stacks.MainStack',
});

export { navio };
