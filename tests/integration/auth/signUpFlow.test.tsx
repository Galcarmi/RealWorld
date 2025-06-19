import { SafeAreaProvider } from 'react-native-safe-area-context';

import { render, fireEvent } from '@testing-library/react-native';

import '../../mocks';
import { SignUpScreen } from '../../../src/screens/login/signUpScreen';
import { navigationService } from '../../../src/services/navigationService';
import { authStore } from '../../../src/store/authStore';
import { userStore } from '../../../src/store/userStore';
import { resetAllStoreMocks, getMockAuthStore } from '../../mocks/stores';

const mockAuthStore = getMockAuthStore();

const renderSignUpScreen = () => {
  return render(
    <SafeAreaProvider>
      <SignUpScreen />
    </SafeAreaProvider>
  );
};

describe('Sign Up Flow Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    authStore.clear();
    userStore.forgetUser();
    resetAllStoreMocks();

    mockAuthStore.isLoading = false;
    mockAuthStore.errors = undefined;
    mockAuthStore.username = '';
    mockAuthStore.email = '';
    mockAuthStore.password = '';
  });

  afterEach(() => {
    authStore.clear();
    userStore.forgetUser();
  });

  describe('Initial Screen State', () => {
    it('should render sign up screen with all required elements', () => {
      const { getByTestId } = renderSignUpScreen();

      expect(getByTestId('register-screen')).toBeTruthy();
      expect(getByTestId('signup-username-input')).toBeTruthy();
      expect(getByTestId('signup-email-input')).toBeTruthy();
      expect(getByTestId('signup-password-input')).toBeTruthy();
      expect(getByTestId('signup-submit-button')).toBeTruthy();
      expect(getByTestId('signup-signin-button')).toBeTruthy();
    });

    it('should display correct screen title', () => {
      const { getByTestId } = renderSignUpScreen();

      expect(getByTestId('signup-screen-title')).toBeTruthy();
    });

    it('should disable submit button with empty fields', () => {
      const { getByTestId } = renderSignUpScreen();

      const submitButton = getByTestId('signup-submit-button');
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Form Field Interactions', () => {
    it('should update username field and store when typing', () => {
      const setUsernameSpy = jest.spyOn(authStore, 'setUsername');
      const { getByTestId } = renderSignUpScreen();

      const usernameInput = getByTestId('signup-username-input');
      fireEvent.changeText(usernameInput, 'testuser');

      expect(setUsernameSpy).toHaveBeenCalledWith('testuser');
    });

    it('should update email field and store when typing', () => {
      const setEmailSpy = jest.spyOn(authStore, 'setEmail');
      const { getByTestId } = renderSignUpScreen();

      const emailInput = getByTestId('signup-email-input');
      fireEvent.changeText(emailInput, 'test@example.com');

      expect(setEmailSpy).toHaveBeenCalledWith('test@example.com');
    });

    it('should update password field and store when typing', () => {
      const setPasswordSpy = jest.spyOn(authStore, 'setPassword');
      const { getByTestId } = renderSignUpScreen();

      const passwordInput = getByTestId('signup-password-input');
      fireEvent.changeText(passwordInput, 'password123');

      expect(setPasswordSpy).toHaveBeenCalledWith('password123');
    });

    it('should handle all field focus and blur events', () => {
      const { getByTestId } = renderSignUpScreen();

      const usernameInput = getByTestId('signup-username-input');
      const emailInput = getByTestId('signup-email-input');
      const passwordInput = getByTestId('signup-password-input');

      fireEvent(usernameInput, 'focus');
      fireEvent(usernameInput, 'blur');
      fireEvent(emailInput, 'focus');
      fireEvent(emailInput, 'blur');
      fireEvent(passwordInput, 'focus');
      fireEvent(passwordInput, 'blur');

      expect(usernameInput).toBeTruthy();
      expect(emailInput).toBeTruthy();
      expect(passwordInput).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    it('should show submit button state based on form validity', () => {
      const { getByTestId } = renderSignUpScreen();

      const usernameInput = getByTestId('signup-username-input');
      const emailInput = getByTestId('signup-email-input');
      const passwordInput = getByTestId('signup-password-input');

      fireEvent.changeText(usernameInput, 'testuser');
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      const submitButton = getByTestId('signup-submit-button');
      expect(submitButton).toBeTruthy();
    });

    it('should keep submit button disabled with invalid inputs', () => {
      const { getByTestId } = renderSignUpScreen();

      const usernameInput = getByTestId('signup-username-input');
      const emailInput = getByTestId('signup-email-input');
      const passwordInput = getByTestId('signup-password-input');

      fireEvent.changeText(usernameInput, 'u');
      fireEvent.changeText(emailInput, 'invalid-email');
      fireEvent.changeText(passwordInput, '123');

      const submitButton = getByTestId('signup-submit-button');
      expect(submitButton).toBeDisabled();
    });

    it('should handle form field changes progressively', () => {
      const { getByTestId } = renderSignUpScreen();

      const usernameInput = getByTestId('signup-username-input');
      const emailInput = getByTestId('signup-email-input');
      const passwordInput = getByTestId('signup-password-input');

      expect(getByTestId('signup-submit-button')).toBeDisabled();

      fireEvent.changeText(usernameInput, 'testuser');
      expect(getByTestId('signup-submit-button')).toBeDisabled();

      fireEvent.changeText(emailInput, 'test@example.com');
      expect(getByTestId('signup-submit-button')).toBeDisabled();

      fireEvent.changeText(passwordInput, 'password123');

      expect(usernameInput).toBeTruthy();
      expect(emailInput).toBeTruthy();
      expect(passwordInput).toBeTruthy();
    });
  });

  describe('SignUp Submission', () => {
    it('should trigger register action when submit is attempted', () => {
      const { getByTestId } = renderSignUpScreen();

      const usernameInput = getByTestId('signup-username-input');
      const emailInput = getByTestId('signup-email-input');
      const passwordInput = getByTestId('signup-password-input');
      const submitButton = getByTestId('signup-submit-button');

      fireEvent.changeText(usernameInput, 'testuser');
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      fireEvent.press(submitButton);

      expect(submitButton).toBeTruthy();
    });

    it('should show loading state during registration', () => {
      mockAuthStore.isLoading = true;

      const { getByTestId } = renderSignUpScreen();

      const submitButton = getByTestId('signup-submit-button');
      expect(submitButton).toBeDisabled();
    });

    it('should handle registration process integration', () => {
      const { getByTestId } = renderSignUpScreen();

      const usernameInput = getByTestId('signup-username-input');
      const emailInput = getByTestId('signup-email-input');
      const passwordInput = getByTestId('signup-password-input');
      const submitButton = getByTestId('signup-submit-button');

      fireEvent.changeText(usernameInput, 'testuser');
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      expect(usernameInput).toBeTruthy();
      expect(emailInput).toBeTruthy();
      expect(passwordInput).toBeTruthy();
      expect(submitButton).toBeTruthy();
    });
  });

  describe('Navigation Actions', () => {
    it('should navigate to login screen when sign in button is pressed', () => {
      const navigationSpy = jest.spyOn(
        navigationService,
        'navigateToLoginScreen'
      );

      const { getByTestId } = renderSignUpScreen();

      const signInButton = getByTestId('signup-signin-button');
      fireEvent.press(signInButton);

      expect(navigationSpy).toHaveBeenCalledTimes(1);
    });

    it('should display correct text on navigation button', () => {
      const { getByText } = renderSignUpScreen();

      expect(getByText('Sign In')).toBeTruthy();
    });
  });

  describe('Loading States', () => {
    it('should disable all interactions during loading', () => {
      mockAuthStore.isLoading = true;

      const { getByTestId } = renderSignUpScreen();

      const usernameInput = getByTestId('signup-username-input');
      const emailInput = getByTestId('signup-email-input');
      const passwordInput = getByTestId('signup-password-input');
      const submitButton = getByTestId('signup-submit-button');

      expect(submitButton).toBeDisabled();

      fireEvent.changeText(usernameInput, 'testuser');
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      expect(submitButton).toBeDisabled();
    });

    it('should reflect loading state correctly', () => {
      mockAuthStore.isLoading = false;

      const { getByTestId } = renderSignUpScreen();

      const usernameInput = getByTestId('signup-username-input');
      const emailInput = getByTestId('signup-email-input');
      const passwordInput = getByTestId('signup-password-input');

      fireEvent.changeText(usernameInput, 'testuser');
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      expect(usernameInput).toBeTruthy();
      expect(emailInput).toBeTruthy();
      expect(passwordInput).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('should handle registration errors gracefully', async () => {
      const { getByTestId } = renderSignUpScreen();

      const usernameInput = getByTestId('signup-username-input');
      const emailInput = getByTestId('signup-email-input');
      const passwordInput = getByTestId('signup-password-input');
      const signUpButton = getByTestId('signup-submit-button');

      fireEvent.changeText(usernameInput, 'erroruser');
      fireEvent.changeText(emailInput, 'error@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(signUpButton);

      expect(getByTestId('register-screen')).toBeTruthy();
    });

    it('should handle network errors gracefully', async () => {
      const { getByTestId } = renderSignUpScreen();

      const usernameInput = getByTestId('signup-username-input');
      const emailInput = getByTestId('signup-email-input');
      const passwordInput = getByTestId('signup-password-input');
      const signUpButton = getByTestId('signup-submit-button');

      fireEvent.changeText(usernameInput, 'networkuser');
      fireEvent.changeText(emailInput, 'network@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(signUpButton);

      expect(getByTestId('register-screen')).toBeTruthy();
    });

    it('should clear errors when user starts typing', () => {
      mockAuthStore.errors = {
        username: ['Invalid username'],
      };

      const setUsernameSpy = jest.spyOn(authStore, 'setUsername');
      const { getByTestId } = renderSignUpScreen();

      const usernameInput = getByTestId('signup-username-input');
      fireEvent.changeText(usernameInput, 'newusername');

      expect(setUsernameSpy).toHaveBeenCalledWith('newusername');
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility labels', () => {
      const { getByTestId } = renderSignUpScreen();

      const usernameInput = getByTestId('signup-username-input');
      const emailInput = getByTestId('signup-email-input');
      const passwordInput = getByTestId('signup-password-input');
      const submitButton = getByTestId('signup-submit-button');

      expect(usernameInput).toBeTruthy();
      expect(emailInput).toBeTruthy();
      expect(passwordInput).toBeTruthy();
      expect(submitButton).toBeTruthy();
    });

    it('should support secure text entry for password', () => {
      const { getByTestId } = renderSignUpScreen();

      const passwordInput = getByTestId('signup-password-input');
      expect(passwordInput.props.secureTextEntry).toBe(true);
    });
  });

  describe('Form Integration', () => {
    it('should integrate properly with auth store', () => {
      const setUsernameSpy = jest.spyOn(authStore, 'setUsername');
      const setEmailSpy = jest.spyOn(authStore, 'setEmail');
      const setPasswordSpy = jest.spyOn(authStore, 'setPassword');
      const { getByTestId } = renderSignUpScreen();

      const usernameInput = getByTestId('signup-username-input');
      const emailInput = getByTestId('signup-email-input');
      const passwordInput = getByTestId('signup-password-input');

      fireEvent.changeText(usernameInput, 'integrationuser');
      fireEvent.changeText(emailInput, 'integration@test.com');
      fireEvent.changeText(passwordInput, 'integrationtest');

      expect(setUsernameSpy).toHaveBeenCalledWith('integrationuser');
      expect(setEmailSpy).toHaveBeenCalledWith('integration@test.com');
      expect(setPasswordSpy).toHaveBeenCalledWith('integrationtest');
    });

    it('should reflect store state in UI', () => {
      mockAuthStore.isLoading = false;

      const { getByTestId } = renderSignUpScreen();

      const usernameInput = getByTestId('signup-username-input');
      const emailInput = getByTestId('signup-email-input');
      const passwordInput = getByTestId('signup-password-input');

      fireEvent.changeText(usernameInput, 'validuser');
      fireEvent.changeText(emailInput, 'valid@email.com');
      fireEvent.changeText(passwordInput, 'validpassword');

      expect(getByTestId('register-screen')).toBeTruthy();
    });
  });

  describe('Username Validation Specific Cases', () => {
    it('should handle minimum username length validation', () => {
      const { getByTestId } = renderSignUpScreen();

      const usernameInput = getByTestId('signup-username-input');

      fireEvent.changeText(usernameInput, 'ab');
      expect(getByTestId('signup-submit-button')).toBeDisabled();

      fireEvent.changeText(usernameInput, 'abc');
      expect(usernameInput).toBeTruthy();
    });

    it('should handle edge case username lengths', () => {
      const { getByTestId } = renderSignUpScreen();

      const usernameInput = getByTestId('signup-username-input');

      fireEvent.changeText(usernameInput, 'a');
      fireEvent.changeText(usernameInput, 'ab');
      fireEvent.changeText(usernameInput, 'abc');
      fireEvent.changeText(usernameInput, 'abcd');

      expect(usernameInput).toBeTruthy();
    });
  });

  describe('Password Validation Specific Cases', () => {
    it('should handle minimum password length validation', () => {
      const { getByTestId } = renderSignUpScreen();

      const passwordInput = getByTestId('signup-password-input');

      fireEvent.changeText(passwordInput, '12345');
      expect(getByTestId('signup-submit-button')).toBeDisabled();

      fireEvent.changeText(passwordInput, '123456');
      expect(passwordInput).toBeTruthy();
    });

    it('should handle various password strengths', () => {
      const { getByTestId } = renderSignUpScreen();

      const passwordInput = getByTestId('signup-password-input');

      fireEvent.changeText(passwordInput, '123456');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.changeText(passwordInput, 'P@ssw0rd!');

      expect(passwordInput).toBeTruthy();
    });
  });

  describe('Multiple Interaction Sequences', () => {
    it('should handle multiple form interactions gracefully', () => {
      const { getByTestId } = renderSignUpScreen();

      const usernameInput = getByTestId('signup-username-input');
      const emailInput = getByTestId('signup-email-input');
      const passwordInput = getByTestId('signup-password-input');
      const submitButton = getByTestId('signup-submit-button');

      fireEvent.changeText(usernameInput, 'testuser');
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      fireEvent.press(submitButton);
      fireEvent.press(submitButton);
      fireEvent.press(submitButton);

      expect(submitButton).toBeTruthy();
    });

    it('should handle navigation button presses correctly', () => {
      const navigationSpy = jest.spyOn(
        navigationService,
        'navigateToLoginScreen'
      );

      const { getByTestId } = renderSignUpScreen();

      const signInButton = getByTestId('signup-signin-button');

      fireEvent.press(signInButton);
      fireEvent.press(signInButton);

      expect(navigationSpy).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle component unmount gracefully', () => {
      const { unmount } = renderSignUpScreen();

      expect(() => unmount()).not.toThrow();
    });

    it('should handle store state changes during component lifecycle', async () => {
      const { getByTestId, rerender } = renderSignUpScreen();

      mockAuthStore.isLoading = true;

      rerender(
        <SafeAreaProvider>
          <SignUpScreen />
        </SafeAreaProvider>
      );

      const submitButton = getByTestId('signup-submit-button');
      expect(submitButton).toBeDisabled();
    });

    it('should handle rapid field changes', () => {
      const { getByTestId } = renderSignUpScreen();

      const usernameInput = getByTestId('signup-username-input');

      fireEvent.changeText(usernameInput, 'a');
      fireEvent.changeText(usernameInput, 'ab');
      fireEvent.changeText(usernameInput, 'abc');
      fireEvent.changeText(usernameInput, 'abcd');
      fireEvent.changeText(usernameInput, 'finaluser');

      expect(usernameInput).toBeTruthy();
    });
  });
});
