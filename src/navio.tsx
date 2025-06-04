import { Main as LoginScreen } from './screens/login';
import { Navio } from 'rn-navio';

const navio = Navio.build({
    screens: {
      Login: LoginScreen,
    },
    stacks: {
      MainStack: ['Login'],
    },
    root: 'stacks.MainStack',
  });

export {
    navio
}