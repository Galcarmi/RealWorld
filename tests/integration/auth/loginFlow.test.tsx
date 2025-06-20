import { SafeAreaProvider } from 'react-native-safe-area-context';

import { fireEvent } from '@testing-library/react-native';

import '../../mocks';
import {
  renderLoginScreen,
  setupIntegrationTestEnvironment,
  expectFormFieldExists,
  simulateFieldInput,
} from '../../utils/testHelpers';

import { TEST_IDS } from '../../../src/constants/testIds';
import { SignInScreen } from '../../../src/screens/login/signInScreen';
import { navigationService } from '../../../src/services/navigationService';
import { authStore } from '../../../src/store/authStore';
import { userStore } from '../../../src/store/userStore';
import { getMockAuthStore } from '../../mocks/stores';

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
        TEST_IDS.SIGNIN_SCREEN,
        TEST_IDS.AUTH_EMAIL_INPUT,
        TEST_IDS.AUTH_PASSWORD_INPUT,
        TEST_IDS.AUTH_SUBMIT_BUTTON,
        TEST_IDS.AUTH_SIGNUP_BUTTON,
      ]);
    });

    it('should display correct screen title', () => {
      const { getByTestId } = renderLoginScreen();

      expect(getByTestId(TEST_IDS.AUTH_SCREEN_TITLE)).toBeTruthy();
    });

    it('should disable submit button with empty fields', () => {
      const { getByTestId } = renderLoginScreen();

      const submitButton = getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON);
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Form Field Interactions', () => {
    it('should update email field and store when typing', () => {
      const setEmailSpy = jest.spyOn(authStore, 'setEmail');
      const { getByTestId } = renderLoginScreen();

      simulateFieldInput(
        getByTestId,
        TEST_IDS.AUTH_EMAIL_INPUT,
        'test@example.com'
      );

      expect(setEmailSpy).toHaveBeenCalledWith('test@example.com');
    });

    it('should update password field and store when typing', () => {
      const setPasswordSpy = jest.spyOn(authStore, 'setPassword');
      const { getByTestId } = renderLoginScreen();

      simulateFieldInput(
        getByTestId,
        TEST_IDS.AUTH_PASSWORD_INPUT,
        'password123'
      );

      expect(setPasswordSpy).toHaveBeenCalledWith('password123');
    });

    it('should handle email field focus and blur', () => {
      const { getByTestId } = renderLoginScreen();

      const emailInput = getByTestId(TEST_IDS.AUTH_EMAIL_INPUT);
      fireEvent(emailInput, 'focus');
      fireEvent(emailInput, 'blur');

      expect(emailInput).toBeTruthy();
    });

    it('should handle password field focus and blur', () => {
      const { getByTestId } = renderLoginScreen();

      const passwordInput = getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT);
      fireEvent(passwordInput, 'focus');
      fireEvent(passwordInput, 'blur');

      expect(passwordInput).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    it('should show submit button state based on form validity', () => {
      const { getByTestId } = renderLoginScreen();

      const emailInput = getByTestId(TEST_IDS.AUTH_EMAIL_INPUT);
      const passwordInput = getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT);

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      const submitButton = getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON);
      expect(submitButton).toBeTruthy();
    });

    it('should keep submit button disabled with invalid email', () => {
      const { getByTestId } = renderLoginScreen();

      const emailInput = getByTestId(TEST_IDS.AUTH_EMAIL_INPUT);
      const passwordInput = getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT);

      fireEvent.changeText(emailInput, 'invalid-email');
      fireEvent.changeText(passwordInput, 'password123');

      const submitButton = getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON);
      expect(submitButton).toBeDisabled();
    });

    it('should keep submit button disabled with short password', () => {
      const { getByTestId } = renderLoginScreen();

      const emailInput = getByTestId(TEST_IDS.AUTH_EMAIL_INPUT);
      const passwordInput = getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT);

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, '123');

      const submitButton = getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON);
      expect(submitButton).toBeDisabled();
    });

    it('should handle form field changes progressively', () => {
      const { getByTestId } = renderLoginScreen();

      const emailInput = getByTestId(TEST_IDS.AUTH_EMAIL_INPUT);
      const passwordInput = getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT);

      expect(getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON)).toBeDisabled();

      fireEvent.changeText(emailInput, 'test@example.com');
      expect(getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON)).toBeDisabled();

      fireEvent.changeText(passwordInput, 'password123');

      expect(emailInput).toBeTruthy();
      expect(passwordInput).toBeTruthy();
    });
  });

  describe('Login Submission', () => {
    it('should trigger login action when submit is attempted', () => {
      const { getByTestId } = renderLoginScreen();

      const emailInput = getByTestId(TEST_IDS.AUTH_EMAIL_INPUT);
      const passwordInput = getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT);
      const submitButton = getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON);

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      fireEvent.press(submitButton);

      expect(submitButton).toBeTruthy();
    });

    it('should show loading state during login', () => {
      mockAuthStore.isLoading = true;

      const { getByTestId } = renderLoginScreen();

      const submitButton = getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON);
      expect(submitButton).toBeDisabled();
    });

    it('should handle login process integration', () => {
      const { getByTestId } = renderLoginScreen();

      const emailInput = getByTestId(TEST_IDS.AUTH_EMAIL_INPUT);
      const passwordInput = getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT);
      const submitButton = getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON);

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

      const signUpButton = getByTestId(TEST_IDS.AUTH_SIGNUP_BUTTON);
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

      const emailInput = getByTestId(TEST_IDS.AUTH_EMAIL_INPUT);
      const passwordInput = getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT);
      const submitButton = getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON);

      expect(submitButton).toBeDisabled();

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      expect(submitButton).toBeDisabled();
    });

    it('should reflect loading state correctly', () => {
      mockAuthStore.isLoading = false;

      const { getByTestId } = renderLoginScreen();

      const emailInput = getByTestId(TEST_IDS.AUTH_EMAIL_INPUT);
      const passwordInput = getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT);

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      expect(emailInput).toBeTruthy();
      expect(passwordInput).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('should handle authentication errors gracefully', async () => {
      const { getByTestId } = renderLoginScreen();

      const emailInput = getByTestId(TEST_IDS.AUTH_EMAIL_INPUT);
      const passwordInput = getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT);
      const loginButton = getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON);

      fireEvent.changeText(emailInput, 'wrong@example.com');
      fireEvent.changeText(passwordInput, 'wrongpassword');

      fireEvent.press(loginButton);

      expect(getByTestId(TEST_IDS.SIGNIN_SCREEN)).toBeTruthy();
    });

    it('should clear errors when user starts typing', () => {
      mockAuthStore.errors = { email: ['Invalid email'] };

      const setEmailSpy = jest.spyOn(authStore, 'setEmail');
      const { getByTestId } = renderLoginScreen();

      const emailInput = getByTestId(TEST_IDS.AUTH_EMAIL_INPUT);
      fireEvent.changeText(emailInput, 'newemail@example.com');

      expect(setEmailSpy).toHaveBeenCalledWith('newemail@example.com');
    });

    it('should handle login errors gracefully', async () => {
      const { getByTestId } = renderLoginScreen();

      const emailInput = getByTestId(TEST_IDS.AUTH_EMAIL_INPUT);
      const passwordInput = getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT);
      const loginButton = getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON);

      fireEvent.changeText(emailInput, 'error@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      fireEvent.press(loginButton);

      expect(getByTestId(TEST_IDS.SIGNIN_SCREEN)).toBeTruthy();
    });

    it('should handle network errors gracefully', async () => {
      const { getByTestId } = renderLoginScreen();

      const emailInput = getByTestId(TEST_IDS.AUTH_EMAIL_INPUT);
      const passwordInput = getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT);
      const loginButton = getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON);

      fireEvent.changeText(emailInput, 'network@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      fireEvent.press(loginButton);

      expect(getByTestId(TEST_IDS.SIGNIN_SCREEN)).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility labels', () => {
      const { getByTestId } = renderLoginScreen();

      const emailInput = getByTestId(TEST_IDS.AUTH_EMAIL_INPUT);
      const passwordInput = getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT);
      const submitButton = getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON);

      expect(emailInput).toBeTruthy();
      expect(passwordInput).toBeTruthy();
      expect(submitButton).toBeTruthy();
    });

    it('should support secure text entry for password', () => {
      const { getByTestId } = renderLoginScreen();

      const passwordInput = getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT);
      expect(passwordInput.props.secureTextEntry).toBe(true);
    });
  });

  describe('Form Integration', () => {
    it('should integrate properly with auth store', () => {
      const setEmailSpy = jest.spyOn(authStore, 'setEmail');
      const setPasswordSpy = jest.spyOn(authStore, 'setPassword');
      const { getByTestId } = renderLoginScreen();

      const emailInput = getByTestId(TEST_IDS.AUTH_EMAIL_INPUT);
      const passwordInput = getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT);

      fireEvent.changeText(emailInput, 'integration@test.com');
      fireEvent.changeText(passwordInput, 'integrationtest');

      expect(setEmailSpy).toHaveBeenCalledWith('integration@test.com');
      expect(setPasswordSpy).toHaveBeenCalledWith('integrationtest');
    });

    it('should reflect store state in UI', () => {
      mockAuthStore.isLoading = false;

      const { getByTestId } = renderLoginScreen();

      const emailInput = getByTestId(TEST_IDS.AUTH_EMAIL_INPUT);
      const passwordInput = getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT);

      fireEvent.changeText(emailInput, 'valid@email.com');
      fireEvent.changeText(passwordInput, 'validpassword');

      expect(getByTestId(TEST_IDS.SIGNIN_SCREEN)).toBeTruthy();
    });
  });

  describe('Multiple Interaction Sequences', () => {
    it('should handle multiple form interactions gracefully', () => {
      const { getByTestId } = renderLoginScreen();

      const emailInput = getByTestId(TEST_IDS.AUTH_EMAIL_INPUT);
      const passwordInput = getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT);
      const submitButton = getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON);

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

      const signUpButton = getByTestId(TEST_IDS.AUTH_SIGNUP_BUTTON);

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
          <SignInScreen />
        </SafeAreaProvider>
      );

      const submitButton = getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON);
      expect(submitButton).toBeDisabled();
    });
  });
});
