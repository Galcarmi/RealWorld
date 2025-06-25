import { NavioScreen } from 'rn-navio';

import { AUTH_SCREEN_TYPE } from '../../constants/app';

import { createAuthScreen } from './authScreen';

export const SignUpScreen: NavioScreen = createAuthScreen(
  AUTH_SCREEN_TYPE.SIGN_UP
);
