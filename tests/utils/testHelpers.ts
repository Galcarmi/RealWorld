import React from 'react';

import { render } from '@testing-library/react-native';

import { mockUser } from '../mocks/data';
import {
  ValidationFunction,
  TestingLibraryQueries,
  MockAuthStore,
  FormValidationTestValues,
} from '../types';

export const validationTestData = {
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
};

export const expectValidationResults = (
  validationFn: ValidationFunction,
  validInputs: string[],
  invalidInputs: string[]
) => {
  validInputs.forEach(input => {
    expect(validationFn(input)).toBe(true);
  });

  invalidInputs.forEach(input => {
    expect(validationFn(input)).toBe(false);
  });
};

export const expectFormFieldExists = (
  getByTestId: TestingLibraryQueries['getByTestId'],
  testIds: string[]
) => {
  testIds.forEach(testId => {
    expect(getByTestId(testId)).toBeTruthy();
  });
};

export const simulateFieldInput = (
  getByTestId: TestingLibraryQueries['getByTestId'],
  fieldTestId: string,
  value: string
) => {
  const { fireEvent } = require('@testing-library/react-native');
  const field = getByTestId(fieldTestId);
  fireEvent.changeText(field, value);
  return field;
};

export const expectStoreFormValidation = (
  store: MockAuthStore,
  field: 'login' | 'signup',
  values: FormValidationTestValues,
  expected: boolean
) => {
  if (values.username !== undefined) store.setUsername(values.username);
  if (values.email !== undefined) store.setEmail(values.email);
  if (values.password !== undefined) store.setPassword(values.password);

  const validationProperty =
    field === 'login' ? 'isLoginFormValid' : 'isSignUpFormValid';
  expect(store[validationProperty]).toBe(expected);
};

export const expectStoreCleared = (store: MockAuthStore) => {
  expect(store.username).toBe('');
  expect(store.email).toBe('');
  expect(store.password).toBe('');
  expect(store.errors).toBeUndefined();
};

export const createMockLoginResponse = (overrides = {}) => ({
  user: {
    ...mockUser,
    ...overrides,
  },
});

export const createMockAuthError = (errors: Record<string, string[]>) => ({
  response: {
    data: { errors },
  },
});

export const renderLoginScreen = () => {
  const { SignInScreen } = require('../../src/screens/login/signInScreen');
  return render(React.createElement(SignInScreen));
};

export const renderSignUpScreen = () => {
  const { SignUpScreen } = require('../../src/screens/login/signUpScreen');
  return render(React.createElement(SignUpScreen));
};

export const renderProfileScreen = () => {
  const {
    ProfileScreen,
  } = require('../../src/screens/profileScreen/profileScreen');
  return render(React.createElement(ProfileScreen));
};
