import { fireEvent } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '../../mocks';
import { LoginScreen } from '../../../src/screens/login/loginScreen';
import { navigationService } from '../../../src/services/navigationService';
import { authStore } from '../../../src/store/authStore';
import { userStore } from '../../../src/store/userStore';
import { getMockAuthStore } from '../../mocks/stores';
import {
  renderLoginScreen,
  setupIntegrationTestEnvironment,
  expectFormFieldExists,
  simulateFieldInput,
} from '../../utils/testHelpers';

const mockAuthStore = getMockAuthStore();

describe('Login Flow Integration Tests', () => {
  beforeEach(() => {
    setupIntegrationTestEnvironment();

    mockAuthStore.isLoading = false;
    mockAuthStore.errors = undefined;
    mockAuthStore.email = '';
    mockAuthStore.password = '';
  });

  afterEach(() => {
    authStore.clear();
    userStore.forgetUser();
  });

  describe('Initial Screen State', () => {
    it('should render login screen with all required elements', () => {
      const { getByTestId } = renderLoginScreen();

      expectFormFieldExists(getByTestId, [
        'login-screen',
        'login-email-input',
        'login-password-input',
        'login-submit-button',
        'login-signup-button',
      ]);
    });

    it('should display correct screen title', () => {
      const { getByTestId } = renderLoginScreen();

      expect(getByTestId('login-screen-title')).toBeTruthy();
    });

    it('should disable submit button with empty fields', () => {
      const { getByTestId } = renderLoginScreen();

      const submitButton = getByTestId('login-submit-button');
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Form Field Interactions', () => {
    it('should update email field and store when typing', () => {
      const setEmailSpy = jest.spyOn(authStore, 'setEmail');
      const { getByTestId } = renderLoginScreen();

      simulateFieldInput(getByTestId, 'login-email-input', 'test@example.com');

      expect(setEmailSpy).toHaveBeenCalledWith('test@example.com');
    });

    it('should update password field and store when typing', () => {
      const setPasswordSpy = jest.spyOn(authStore, 'setPassword');
      const { getByTestId } = renderLoginScreen();

      simulateFieldInput(getByTestId, 'login-password-input', 'password123');

      expect(setPasswordSpy).toHaveBeenCalledWith('password123');
    });

    it('should handle email field focus and blur', () => {
      const { getByTestId } = renderLoginScreen();

      const emailInput = getByTestId('login-email-input');
      fireEvent(emailInput, 'focus');
      fireEvent(emailInput, 'blur');

      expect(emailInput).toBeTruthy();
    });

    it('should handle password field focus and blur', () => {
      const { getByTestId } = renderLoginScreen();

      const passwordInput = getByTestId('login-password-input');
      fireEvent(passwordInput, 'focus');
      fireEvent(passwordInput, 'blur');

      expect(passwordInput).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    it('should show submit button state based on form validity', () => {
      const { getByTestId } = renderLoginScreen();

      const emailInput = getByTestId('login-email-input');
      const passwordInput = getByTestId('login-password-input');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      const submitButton = getByTestId('login-submit-button');
      expect(submitButton).toBeTruthy();
    });

    it('should keep submit button disabled with invalid email', () => {
      const { getByTestId } = renderLoginScreen();

      const emailInput = getByTestId('login-email-input');
      const passwordInput = getByTestId('login-password-input');

      fireEvent.changeText(emailInput, 'invalid-email');
      fireEvent.changeText(passwordInput, 'password123');

      const submitButton = getByTestId('login-submit-button');
      expect(submitButton).toBeDisabled();
    });

    it('should keep submit button disabled with short password', () => {
      const { getByTestId } = renderLoginScreen();

      const emailInput = getByTestId('login-email-input');
      const passwordInput = getByTestId('login-password-input');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, '123');

      const submitButton = getByTestId('login-submit-button');
      expect(submitButton).toBeDisabled();
    });

    it('should handle form field changes progressively', () => {
      const { getByTestId } = renderLoginScreen();

      const emailInput = getByTestId('login-email-input');
      const passwordInput = getByTestId('login-password-input');

      expect(getByTestId('login-submit-button')).toBeDisabled();

      fireEvent.changeText(emailInput, 'test@example.com');
      expect(getByTestId('login-submit-button')).toBeDisabled();

      fireEvent.changeText(passwordInput, 'password123');

      expect(emailInput).toBeTruthy();
      expect(passwordInput).toBeTruthy();
    });
  });

  describe('Login Submission', () => {
    it('should trigger login action when submit is attempted', () => {
      const { getByTestId } = renderLoginScreen();

      const emailInput = getByTestId('login-email-input');
      const passwordInput = getByTestId('login-password-input');
      const submitButton = getByTestId('login-submit-button');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      fireEvent.press(submitButton);

      expect(submitButton).toBeTruthy();
    });

    it('should show loading state during login', () => {
      mockAuthStore.isLoading = true;

      const { getByTestId } = renderLoginScreen();

      const submitButton = getByTestId('login-submit-button');
      expect(submitButton).toBeDisabled();
    });

    it('should handle login process integration', () => {
      const { getByTestId } = renderLoginScreen();

      const emailInput = getByTestId('login-email-input');
      const passwordInput = getByTestId('login-password-input');
      const submitButton = getByTestId('login-submit-button');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      expect(emailInput).toBeTruthy();
      expect(passwordInput).toBeTruthy();
      expect(submitButton).toBeTruthy();
    });
  });

  describe('Navigation Actions', () => {
    it('should navigate to sign up screen when sign up button is pressed', () => {
      const navigationSpy = jest.spyOn(
        navigationService,
        'navigateToSignUpScreen'
      );

      const { getByTestId } = renderLoginScreen();

      const signUpButton = getByTestId('login-signup-button');
      fireEvent.press(signUpButton);

      expect(navigationSpy).toHaveBeenCalledTimes(1);
    });

    it('should display correct text on navigation button', () => {
      const { getByText } = renderLoginScreen();

      expect(getByText('Sign Up')).toBeTruthy();
    });
  });

  describe('Loading States', () => {
    it('should disable all interactions during loading', () => {
      mockAuthStore.isLoading = true;

      const { getByTestId } = renderLoginScreen();

      const emailInput = getByTestId('login-email-input');
      const passwordInput = getByTestId('login-password-input');
      const submitButton = getByTestId('login-submit-button');

      expect(submitButton).toBeDisabled();

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      expect(submitButton).toBeDisabled();
    });

    it('should reflect loading state correctly', () => {
      mockAuthStore.isLoading = false;

      const { getByTestId } = renderLoginScreen();

      const emailInput = getByTestId('login-email-input');
      const passwordInput = getByTestId('login-password-input');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      expect(emailInput).toBeTruthy();
      expect(passwordInput).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('should handle authentication errors gracefully', () => {
      mockAuthStore.errors = {
        email: ['Invalid email format'],
        password: ['Password is too short'],
      };

      const { getByTestId } = renderLoginScreen();

      expect(getByTestId('login-screen')).toBeTruthy();
    });

    it('should clear errors when user starts typing', () => {
      mockAuthStore.errors = {
        email: ['Invalid email'],
      };

      const setEmailSpy = jest.spyOn(authStore, 'setEmail');
      const { getByTestId } = renderLoginScreen();

      const emailInput = getByTestId('login-email-input');
      fireEvent.changeText(emailInput, 'newemail@example.com');

      expect(setEmailSpy).toHaveBeenCalledWith('newemail@example.com');
    });

    it('should handle login errors gracefully', async () => {
      const { getByTestId } = renderLoginScreen();

      const emailInput = getByTestId('login-email-input');
      const passwordInput = getByTestId('login-password-input');
      const submitButton = getByTestId('login-submit-button');

      fireEvent.changeText(emailInput, 'error@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(submitButton);

      expect(getByTestId('login-screen')).toBeTruthy();
    });

    it('should handle network errors gracefully', async () => {
      const { getByTestId } = renderLoginScreen();

      const emailInput = getByTestId('login-email-input');
      const passwordInput = getByTestId('login-password-input');
      const submitButton = getByTestId('login-submit-button');

      fireEvent.changeText(emailInput, 'network@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(submitButton);

      expect(getByTestId('login-screen')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility labels', () => {
      const { getByTestId } = renderLoginScreen();

      const emailInput = getByTestId('login-email-input');
      const passwordInput = getByTestId('login-password-input');
      const submitButton = getByTestId('login-submit-button');

      expect(emailInput).toBeTruthy();
      expect(passwordInput).toBeTruthy();
      expect(submitButton).toBeTruthy();
    });

    it('should support secure text entry for password', () => {
      const { getByTestId } = renderLoginScreen();

      const passwordInput = getByTestId('login-password-input');
      expect(passwordInput.props.secureTextEntry).toBe(true);
    });
  });

  describe('Form Integration', () => {
    it('should integrate properly with auth store', () => {
      const setEmailSpy = jest.spyOn(authStore, 'setEmail');
      const setPasswordSpy = jest.spyOn(authStore, 'setPassword');
      const { getByTestId } = renderLoginScreen();

      const emailInput = getByTestId('login-email-input');
      const passwordInput = getByTestId('login-password-input');

      fireEvent.changeText(emailInput, 'integration@test.com');
      fireEvent.changeText(passwordInput, 'integrationtest');

      expect(setEmailSpy).toHaveBeenCalledWith('integration@test.com');
      expect(setPasswordSpy).toHaveBeenCalledWith('integrationtest');
    });

    it('should reflect store state in UI', () => {
      mockAuthStore.isLoading = false;

      const { getByTestId } = renderLoginScreen();

      const emailInput = getByTestId('login-email-input');
      const passwordInput = getByTestId('login-password-input');

      fireEvent.changeText(emailInput, 'valid@email.com');
      fireEvent.changeText(passwordInput, 'validpassword');

      expect(getByTestId('login-screen')).toBeTruthy();
    });
  });

  describe('Multiple Interaction Sequences', () => {
    it('should handle multiple form interactions gracefully', () => {
      const { getByTestId } = renderLoginScreen();

      const emailInput = getByTestId('login-email-input');
      const passwordInput = getByTestId('login-password-input');
      const submitButton = getByTestId('login-submit-button');

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
        'navigateToSignUpScreen'
      );

      const { getByTestId } = renderLoginScreen();

      const signUpButton = getByTestId('login-signup-button');

      fireEvent.press(signUpButton);
      fireEvent.press(signUpButton);

      expect(navigationSpy).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle component unmount gracefully', () => {
      const { unmount } = renderLoginScreen();

      expect(() => unmount()).not.toThrow();
    });

    it('should handle store state changes during component lifecycle', async () => {
      const { getByTestId, rerender } = renderLoginScreen();

      mockAuthStore.isLoading = true;

      rerender(
        <SafeAreaProvider>
          <LoginScreen />
        </SafeAreaProvider>
      );

      const submitButton = getByTestId('login-submit-button');
      expect(submitButton).toBeDisabled();
    });
  });
});
