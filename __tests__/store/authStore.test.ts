import { when } from 'mobx';

import { authStore } from '../../src/store/authStore';
import { userStore } from '../../src/store/userStore';

// Mock the dependencies
jest.mock('../../src/services');
jest.mock('../../src/store/userStore');
jest.mock('../../src/services/navigationService');

describe('AuthStore', () => {
  let mockAuthService: {
    login: jest.Mock;
    register: jest.Mock;
    get: jest.Mock;
    put: jest.Mock;
  };

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Mock the AuthService with all required methods
    mockAuthService = {
      login: jest.fn(),
      register: jest.fn(),
      get: jest.fn(),
      put: jest.fn(),
    };

    // Replace the internal service with our mock using object property assignment
    Object.defineProperty(authStore, '_authService', {
      value: mockAuthService,
      writable: true,
      configurable: true,
    });
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
        authStore.setEmail('');
        authStore.setPassword('');
        expect(authStore.isLoginFormValid).toBe(false);
      });

      it('should return false for invalid email', () => {
        authStore.setEmail('invalid-email');
        authStore.setPassword('password123');
        expect(authStore.isLoginFormValid).toBe(false);
      });

      it('should return false for empty password', () => {
        authStore.setEmail('test@example.com');
        authStore.setPassword('');
        expect(authStore.isLoginFormValid).toBe(false);
      });

      it('should return true for valid email and password', () => {
        authStore.setEmail('test@example.com');
        authStore.setPassword('password123');
        expect(authStore.isLoginFormValid).toBe(true);
      });
    });

    describe('isSignUpFormValid', () => {
      it('should return false for incomplete form', () => {
        authStore.setUsername('');
        authStore.setEmail('');
        authStore.setPassword('');
        expect(authStore.isSignUpFormValid).toBe(false);
      });

      it('should return false for short username', () => {
        authStore.setUsername('ab');
        authStore.setEmail('test@example.com');
        authStore.setPassword('password123');
        expect(authStore.isSignUpFormValid).toBe(false);
      });

      it('should return false for short password', () => {
        authStore.setUsername('testuser');
        authStore.setEmail('test@example.com');
        authStore.setPassword('12345');
        expect(authStore.isSignUpFormValid).toBe(false);
      });

      it('should return true for valid signup form', () => {
        authStore.setUsername('testuser');
        authStore.setEmail('test@example.com');
        authStore.setPassword('password123');
        expect(authStore.isSignUpFormValid).toBe(true);
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

      expect(authStore.username).toBe('');
      expect(authStore.email).toBe('');
      expect(authStore.password).toBe('');
      expect(authStore.errors).toBeUndefined();
    });
  });

  describe('login method', () => {
    beforeEach(() => {
      authStore.setEmail('test@example.com');
      authStore.setPassword('password123');
    });

    it('should set loading state and call auth service', () => {
      const mockResponse = {
        user: {
          id: '1',
          email: 'test@example.com',
          token: 'token123',
          username: 'testuser',
        },
      };
      mockAuthService.login.mockResolvedValue(mockResponse);

      authStore.login();

      expect(authStore.isLoading).toBe(true);
      expect(authStore.errors).toBeUndefined();
      expect(mockAuthService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should handle successful login', async () => {
      const mockResponse = {
        user: {
          id: '1',
          email: 'test@example.com',
          token: 'token123',
          username: 'testuser',
        },
      };
      mockAuthService.login.mockResolvedValue(mockResponse);

      authStore.login();

      // Wait for the async operation to complete
      await when(() => !authStore.isLoading);

      expect(userStore.setUser).toHaveBeenCalledWith(mockResponse.user);
      expect(authStore.username).toBe('');
      expect(authStore.email).toBe('');
      expect(authStore.password).toBe('');
    });

    it('should handle login error', async () => {
      const mockError = {
        response: {
          data: {
            errors: { email: ['Invalid email'] },
          },
        },
      };
      mockAuthService.login.mockRejectedValue(mockError);

      authStore.login();

      // Wait for the async operation to complete
      await when(() => !authStore.isLoading);

      expect(authStore.errors).toEqual({ email: ['Invalid email'] });
      expect(authStore.isLoading).toBe(false);
    });
  });
});
