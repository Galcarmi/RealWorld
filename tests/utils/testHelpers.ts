import React from 'react';

export const testData = {
  validEmails: [
    'test@example.com',
    'user.name@domain.co.uk',
    'user+tag@example.org',
    'user123@test-domain.com',
    'a@b.co',
  ],
  invalidEmails: [
    '',
    'invalid',
    '@example.com',
    'user@',
    'user@@example.com',
    'user@.com',
    'user@example.',
    'user name@example.com',
    'user@ex ample.com',
  ],
  validDates: [
    '2024-01-15T10:30:00.000Z',
    '2024-01-15',
    '2024-12-25T00:00:00.000Z',
  ],
  invalidDates: ['invalid-date', ''],
  mockUser: {
    id: '1',
    email: 'test@example.com',
    token: 'token123',
    username: 'testuser',
  },
  mockAuthValues: {
    email: 'test@example.com',
    username: 'testuser',
    password: 'password123',
  },
};

export const setupMockAuthService = () => {
  return {
    login: jest.fn(),
    register: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
  };
};

export const setupMockAxiosInstance = () => {
  return {
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn(), clear: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn(), clear: jest.fn() },
    },
    defaults: { headers: { common: {} } },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
    getUri: jest.fn(),
    request: jest.fn(),
    head: jest.fn(),
    options: jest.fn(),
    patch: jest.fn(),
    postForm: jest.fn(),
    putForm: jest.fn(),
    patchForm: jest.fn(),
  };
};

export const expectValidationResults = (
  validationFn: (input: string) => boolean,
  validInputs: string[],
  invalidInputs: string[],
  expectedValid: boolean = true,
  expectedInvalid: boolean = false
) => {
  validInputs.forEach(input => {
    expect(validationFn(input)).toBe(expectedValid);
  });

  invalidInputs.forEach(input => {
    expect(validationFn(input)).toBe(expectedInvalid);
  });
};

export const expectStringResult = (result: string) => {
  expect(typeof result).toBe('string');
  expect(result.length).toBeGreaterThan(0);
};

export const setupAuthStorePropertyMocks = (
  authStore: any,
  values: any = {}
) => {
  Object.defineProperty(authStore, 'isLoginFormValid', {
    value: values.isLoginFormValid || true,
    writable: true,
    configurable: true,
  });

  Object.defineProperty(authStore, 'isSignUpFormValid', {
    value: values.isSignUpFormValid || true,
    writable: true,
    configurable: true,
  });

  Object.defineProperty(authStore, 'authValues', {
    value: values.authValues || testData.mockAuthValues,
    writable: true,
    configurable: true,
  });
};

export const expectFormFieldInteraction = (
  getByTestId: any,
  fieldTestId: string,
  setValue: string,
  expectedAction: jest.Mock
) => {
  const field = getByTestId(fieldTestId);
  expect(field).toBeTruthy();
  return { field, setValue, expectedAction };
};

export const createMockStoreSetup = () => {
  return {
    authStore: {
      isLoading: false,
      errors: undefined,
      username: '',
      email: '',
      password: '',
      authValues: { email: '', username: '', password: '' },
      isLoginFormValid: false,
      isSignUpFormValid: false,
      clear: jest.fn(),
      setUsername: jest.fn(),
      setEmail: jest.fn(),
      setPassword: jest.fn(),
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    },
    userStore: {
      user: null,
      token: null,
      forgetUser: jest.fn(),
      setUser: jest.fn(),
      getToken: jest.fn(),
      isAuthenticated: jest.fn(),
    },
  };
};

export const expectFormValidation = (
  formValidFn: () => boolean,
  expected: boolean,
  setupFn?: () => void
) => {
  if (setupFn) setupFn();
  expect(formValidFn()).toBe(expected);
};

export const expectAsyncStoreAction = async (
  actionFn: () => Promise<void>,
  loadingCheck: () => boolean,
  expectation: jest.Mock
) => {
  actionFn();
  expect(loadingCheck()).toBe(true);
  expect(expectation).toHaveBeenCalled();
};

export const renderWithSafeArea = (Component: React.ComponentType) => {
  const { SafeAreaProvider } = require('react-native-safe-area-context');
  const { render } = require('@testing-library/react-native');
  const React = require('react');

  return render(
    React.createElement(SafeAreaProvider, {}, React.createElement(Component))
  );
};

export const setupFormValidationTest = (
  store: any,
  field: 'login' | 'signup',
  values: { username?: string; email?: string; password?: string },
  expected: boolean
) => {
  if (values.username !== undefined) store.setUsername(values.username);
  if (values.email !== undefined) store.setEmail(values.email);
  if (values.password !== undefined) store.setPassword(values.password);

  const validationProperty =
    field === 'login' ? 'isLoginFormValid' : 'isSignUpFormValid';
  expect(store[validationProperty]).toBe(expected);
};

export const expectStoreCleared = (store: any) => {
  expect(store.username).toBe('');
  expect(store.email).toBe('');
  expect(store.password).toBe('');
  expect(store.errors).toBeUndefined();
};

export const expectStoreSetterAction = (
  store: any,
  setterFn: string,
  value: string,
  propertyName: string
) => {
  store[setterFn](value);
  expect(store[propertyName]).toBe(value);
};

export const createMockLoginResponse = (overrides: any = {}) => {
  return {
    user: {
      ...testData.mockUser,
      ...overrides,
    },
  };
};

export const createMockAuthError = (errors: any) => {
  return {
    response: {
      data: { errors },
    },
  };
};

export const testLengthValidation = (
  minLength: number,
  maxLength: number,
  validInputs: string[],
  invalidInputs: string[]
) => {
  const validate = require('../../src/utils').lengthValidation(
    minLength,
    maxLength
  );

  validInputs.forEach(input => {
    expect(validate(input)).toBe(true);
  });

  invalidInputs.forEach(input => {
    expect(validate(input)).toBe(false);
  });
};

export const createLengthValidator = (minLength: number, maxLength: number) => {
  return require('../../src/utils').lengthValidation(minLength, maxLength);
};

export const renderLoginScreen = () => {
  const { render } = require('@testing-library/react-native');
  const { SafeAreaProvider } = require('react-native-safe-area-context');
  const React = require('react');
  const { LoginScreen } = require('../../src/screens/login/loginScreen');

  return render(
    React.createElement(SafeAreaProvider, {}, React.createElement(LoginScreen))
  );
};

export const setupIntegrationTestEnvironment = () => {
  const { authStore } = require('../../src/store/authStore');
  const { userStore } = require('../../src/store/userStore');
  const { resetAllStoreMocks } = require('../mocks/stores');

  jest.clearAllMocks();
  authStore.clear();
  userStore.forgetUser();
  resetAllStoreMocks();
};

export const expectFormFieldExists = (getByTestId: any, testIds: string[]) => {
  testIds.forEach(testId => {
    expect(getByTestId(testId)).toBeTruthy();
  });
};

export const simulateFieldInput = (
  getByTestId: any,
  fieldTestId: string,
  value: string
) => {
  const { fireEvent } = require('@testing-library/react-native');
  const field = getByTestId(fieldTestId);
  fireEvent.changeText(field, value);
  return field;
};
