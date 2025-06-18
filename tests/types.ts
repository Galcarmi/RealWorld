import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { ReactTestInstance } from 'react-test-renderer';

import { RootStackParamList } from '../src/navigation/types';
import { ResponseErrors } from '../src/services/types';
import { IAuthStore, IUserStore, User } from '../src/store/types';

export interface MockAuthStore
  extends Omit<
    IAuthStore,
    'authValues' | 'isLoginFormValid' | 'isSignUpFormValid'
  > {
  authValues: {
    email: string;
    username: string;
    password: string;
  };
  isLoginFormValid: boolean;
  isSignUpFormValid: boolean;
}

export interface MockUserStore extends IUserStore {
  user: User | null;
  token: string | null;
}

export interface FormValidationTestValues {
  username?: string;
  email?: string;
  password?: string;
}

export interface MockNavigationFunctions {
  goBack: jest.Mock;
  navigate: jest.Mock;
}

export type MockRoute = RouteProp<RootStackParamList, keyof RootStackParamList>;

export interface TestingLibraryQueries {
  getByTestId: (testId: string) => ReactTestInstance;
  queryByTestId: (testId: string) => ReactTestInstance | null;
  findByTestId: (testId: string) => Promise<ReactTestInstance>;
}

export interface RenderResult extends TestingLibraryQueries {
  rerender: (component: React.ReactElement) => void;
  unmount: () => void;
}

export type ValidationFunction = (input: string) => boolean;

export interface MockAuthError {
  response: {
    data: {
      errors: ResponseErrors;
    };
  };
}
