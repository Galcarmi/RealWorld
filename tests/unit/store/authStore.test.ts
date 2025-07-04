import { when } from 'mobx';

import {
  createMockLoginResponse,
  createMockAuthError,
  expectStoreFormValidation,
  expectStoreCleared,
} from '../../utils/testHelpers';

import { authService } from '../../../src/services';
import { authStore } from '../../../src/store/authStore';
import { userStore } from '../../../src/store/userStore';

jest.mock('../../../src/services');
jest.mock('../../../src/store/userStore');

describe('AuthStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    authStore.clear();
  });

  describe('initial state', () => {
    it('should initialize with default values', () => {
      expect(authStore.isLoading).toBe(false);
      expect(authStore.errors).toBeUndefined();
      expect(authStore.username).toBe('');
      expect(authStore.email).toBe('');
      expect(authStore.password).toBe('');
    });
  });

  describe('setters', () => {
    it('should set username correctly', () => {
      authStore.setUsername('testuser');
      expect(authStore.username).toBe('testuser');
    });

    it('should set email correctly', () => {
      authStore.setEmail('test@example.com');
      expect(authStore.email).toBe('test@example.com');
    });

    it('should set password correctly', () => {
      authStore.setPassword('password123');
      expect(authStore.password).toBe('password123');
    });
  });

  describe('authValues getter', () => {
    it('should return current auth values', () => {
      authStore.setUsername('testuser');
      authStore.setEmail('test@example.com');
      authStore.setPassword('password123');

      expect(authStore.authValues).toEqual({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  describe('form validation', () => {
    describe('isLoginFormValid', () => {
      it('should return false for empty fields', () => {
        expectStoreFormValidation(
          authStore,
          'login',
          { email: '', password: '' },
          false
        );
      });

      it('should return false for invalid email', () => {
        expectStoreFormValidation(
          authStore,
          'login',
          { email: 'invalid-email', password: 'password123' },
          false
        );
      });

      it('should return false for empty password', () => {
        expectStoreFormValidation(
          authStore,
          'login',
          { email: 'test@example.com', password: '' },
          false
        );
      });

      it('should return true for valid email and password', () => {
        expectStoreFormValidation(
          authStore,
          'login',
          { email: 'test@example.com', password: 'password123' },
          true
        );
      });
    });

    describe('isSignUpFormValid', () => {
      it('should return false for incomplete form', () => {
        expectStoreFormValidation(
          authStore,
          'signup',
          { username: '', email: '', password: '' },
          false
        );
      });

      it('should return false for short username', () => {
        expectStoreFormValidation(
          authStore,
          'signup',
          {
            username: 'ab',
            email: 'test@example.com',
            password: 'password123',
          },
          false
        );
      });

      it('should return false for short password', () => {
        expectStoreFormValidation(
          authStore,
          'signup',
          {
            username: 'testuser',
            email: 'test@example.com',
            password: '12345',
          },
          false
        );
      });

      it('should return true for valid signup form', () => {
        expectStoreFormValidation(
          authStore,
          'signup',
          {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
          },
          true
        );
      });
    });
  });

  describe('clear method', () => {
    it('should reset all form fields and errors', () => {
      authStore.setUsername('testuser');
      authStore.setEmail('test@example.com');
      authStore.setPassword('password123');
      authStore.errors = { general: ['Some error'] };

      authStore.clear();

      expectStoreCleared(authStore);
    });
  });

  describe('login method', () => {
    beforeEach(() => {
      authStore.setEmail('test@example.com');
      authStore.setPassword('password123');
    });

    it('should set loading state and call auth service', () => {
      const mockResponse = createMockLoginResponse();
      (authService.login as jest.Mock).mockResolvedValue(mockResponse);

      authStore.login();

      expect(authStore.isLoading).toBe(true);
      expect(authStore.errors).toBeUndefined();
      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should handle successful login', async () => {
      const mockResponse = createMockLoginResponse();
      (authService.login as jest.Mock).mockResolvedValue(mockResponse);

      authStore.login();

      await when(() => !authStore.isLoading);

      expect(userStore.setUser).toHaveBeenCalledWith(mockResponse.user);
      expect(authStore.username).toBe('');
      expect(authStore.email).toBe('');
      expect(authStore.password).toBe('');
      expect(authStore.errors).toBeUndefined();
      expect(authStore.isLoading).toBe(false);
    });

    it('should handle login error', async () => {
      const mockError = createMockAuthError({ email: ['Invalid email'] });
      (authService.login as jest.Mock).mockRejectedValue(mockError);

      authStore.login();

      await when(() => !authStore.isLoading);

      expect(authStore.errors).toEqual({ email: ['Invalid email'] });
      expect(authStore.isLoading).toBe(false);
    });
  });

  describe('register method', () => {
    beforeEach(() => {
      authStore.setUsername('testuser');
      authStore.setEmail('test@example.com');
      authStore.setPassword('password123');
    });

    it('should call auth service with correct values', () => {
      const mockResponse = createMockLoginResponse();
      (authService.register as jest.Mock).mockResolvedValue(mockResponse);

      authStore.register();

      expect(authService.register).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});
