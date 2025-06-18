import { renderHook, act } from '@testing-library/react-native';
import { Keyboard } from 'react-native';

import useAuth from '../../../../src/screens/login/useAuth';
import { navigationService } from '../../../../src/services/navigationService';
import { authStore } from '../../../../src/store/authStore';
import { mockUser } from '../../../mocks/data';

jest.mock('react-native', () => ({
  Keyboard: {
    dismiss: jest.fn(),
  },
}));

jest.mock('../../../../src/store/authStore');
jest.mock('../../../../src/services/navigationService');
jest.mock('../../../../src/utils');

const mockKeyboard = Keyboard as jest.Mocked<typeof Keyboard>;

const mockAuthValues = {
  email: mockUser.email,
  username: mockUser.username,
  password: 'password123',
};

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    authStore.setUsername = jest.fn();
    authStore.setEmail = jest.fn();
    authStore.setPassword = jest.fn();
    authStore.login = jest.fn();
    authStore.register = jest.fn();
    authStore.clear = jest.fn();

    Object.defineProperty(authStore, 'isLoginFormValid', {
      value: true,
      writable: true,
      configurable: true,
    });

    Object.defineProperty(authStore, 'isSignUpFormValid', {
      value: true,
      writable: true,
      configurable: true,
    });

    Object.defineProperty(authStore, 'authValues', {
      value: mockAuthValues,
      writable: true,
      configurable: true,
    });
  });

  it('should handle username change', () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.onUsernameChange('newusername');
    });

    expect(authStore.setUsername).toHaveBeenCalledWith('newusername');
  });

  it('should handle email change', () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.onEmailChange('newemail@example.com');
    });

    expect(authStore.setEmail).toHaveBeenCalledWith('newemail@example.com');
  });

  it('should handle password change', () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.onPasswordChange('newpassword');
    });

    expect(authStore.setPassword).toHaveBeenCalledWith('newpassword');
  });

  it('should handle login with keyboard dismiss', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.onLogin();
    });

    expect(mockKeyboard.dismiss).toHaveBeenCalled();
    expect(authStore.login).toHaveBeenCalled();
  });

  it('should handle sign up with keyboard dismiss', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.onSignUp();
    });

    expect(mockKeyboard.dismiss).toHaveBeenCalled();
    expect(authStore.register).toHaveBeenCalled();
  });

  it('should handle navigation to login screen', () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.onNavigateToLogin();
    });

    expect(navigationService.navigateToLoginScreen).toHaveBeenCalled();
  });

  it('should handle navigation to sign up screen', () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.onNavigateToSignUp();
    });

    expect(navigationService.navigateToSignUpScreen).toHaveBeenCalled();
  });

  it('should clear auth store on unmount', () => {
    const { unmount } = renderHook(() => useAuth());

    unmount();

    expect(authStore.clear).toHaveBeenCalled();
  });

  it('should provide form validation states', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.isLoginFormValid).toBe(true);
    expect(result.current.isSignUpFormValid).toBe(true);
  });

  it('should provide user data from auth values', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual(mockAuthValues);
  });
});
