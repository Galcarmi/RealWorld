import { RouteProp } from '@react-navigation/native';
import React from 'react';
import { ReactTestInstance } from 'react-test-renderer';

import { RootStackParamList } from '../src/navigation/types';
import { ResponseErrors } from '../src/services/types';
import { IAuthStore, IUserStore, User } from '../src/store/types';

export interface TestDataConfig {
  validEmails: string[];
  invalidEmails: string[];
  validDates: string[];
  invalidDates: string[];
  mockUser: User;
  mockAuthValues: MockAuthValues;
}

export interface MockAuthValues {
  email: string;
  username: string;
  password: string;
}

export interface MockAuthStore
  extends Omit<
    IAuthStore,
    'authValues' | 'isLoginFormValid' | 'isSignUpFormValid'
  > {
  authValues: MockAuthValues;
  isLoginFormValid: boolean;
  isSignUpFormValid: boolean;
}

export interface MockUserStore extends IUserStore {
  user: User | null;
  token: string | null;
}

export interface MockStoreSetup {
  authStore: MockAuthStore;
  userStore: MockUserStore;
}

export interface AuthStorePropertyMockValues {
  isLoginFormValid?: boolean;
  isSignUpFormValid?: boolean;
  authValues?: MockAuthValues;
}

export interface FormValidationTestValues {
  username?: string;
  email?: string;
  password?: string;
}

export interface MockLoginResponseOverrides extends Partial<User> {}

export interface MockAuthErrorData {
  errors: ResponseErrors;
}

export interface MockAuthError {
  response: {
    data: MockAuthErrorData;
  };
}

export interface MockNavigationFunctions {
  goBack: jest.Mock;
  navigate: jest.Mock;
}

export interface MockRouteConfig {
  key: string;
  name: keyof RootStackParamList;
  params?: RootStackParamList[keyof RootStackParamList];
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

export interface MockAuthService {
  login: jest.Mock;
  register: jest.Mock;
  get: jest.Mock;
  put: jest.Mock;
}

export interface MockAxiosInstance {
  interceptors: {
    request: { use: jest.Mock; eject: jest.Mock; clear: jest.Mock };
    response: { use: jest.Mock; eject: jest.Mock; clear: jest.Mock };
  };
  defaults: { headers: { common: Record<string, string> } };
  get: jest.Mock;
  post: jest.Mock;
  put: jest.Mock;
  delete: jest.Mock;
  create: jest.Mock;
  getUri: jest.Mock;
  request: jest.Mock;
  head: jest.Mock;
  options: jest.Mock;
  patch: jest.Mock;
  postForm: jest.Mock;
  putForm: jest.Mock;
  patchForm: jest.Mock;
}

export type ValidationFunction = (input: string) => boolean;

export interface ValidationTestConfig {
  validInputs: string[];
  invalidInputs: string[];
  expectedValid?: boolean;
  expectedInvalid?: boolean;
}

export interface FormFieldInteractionResult {
  field: ReactTestInstance;
  setValue: string;
  expectedAction: jest.Mock;
}

export type TestSetupFunction = () => void;
export type AsyncTestAction = () => Promise<void>;
export type LoadingCheckFunction = () => boolean;
