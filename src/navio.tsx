import { Navio } from 'rn-navio';

import { Main as LoginScreen } from './screens/login';

const navio = Navio.build({
  screens: {
    Login: LoginScreen,
  },
  stacks: {
    MainStack: ['Login'],
  },
  root: 'stacks.MainStack',
});

export { navio };
