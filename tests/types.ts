import { RouteProp } from '@react-navigation/native';
import React from 'react';

import { RootStackParamList } from '../src/navigation/types';
import { Article, Profile, ResponseErrors } from '../src/services/types';
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

export type TestingLibraryQueries = {
  getByTestId: (testId: string) => any;
  findByTestId: (testId: string) => Promise<any>;
  queryByTestId: (testId: string) => any;
  getAllByTestId: (testId: string) => any[];
  queryAllByTestId: (testId: string) => any[];
  findAllByTestId: (testId: string) => Promise<any[]>;
  getByText: (text: string) => any;
  findByText: (text: string) => Promise<any>;
  queryByText: (text: string) => any;
};

export type UseAuthorProfileReturn = {
  authorProfile: Profile | null;
  authorArticles: Article[];
  isLoading: boolean;
  onFollowToggle: () => Promise<void>;
  onToggleFavorite: (slug: string, favorited: boolean) => Promise<void>;
  refreshAuthorArticles: () => Promise<void>;
};

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

export type UtilitiesModule = {
  showErrorModals: (errors: ResponseErrors) => void;
  lengthValidation: (
    minLength: number,
    maxLength: number
  ) => (value?: string) => boolean;
  emailValidation: (value?: string) => boolean;
  showErrorAlert: (title?: string, message?: string) => void;
  showInfoAlert: (title: string, message?: string) => void;
  showConfirmAlert: (
    title: string,
    message?: string,
    onConfirm?: () => void,
    onCancel?: () => void
  ) => void;
  getInitials: (name: string, count: number) => string;
  getUserInitial: (username: string) => string;
  formatDate: (dateString: string) => string;
};
