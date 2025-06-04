import { Navio } from 'rn-navio';

import { Main as LoginScreen } from './screens/login/login';

const navio = Navio.build({
  screens: {
    Login: LoginScreen,
  },
  stacks: {
    MainStack: ['Login'],
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
