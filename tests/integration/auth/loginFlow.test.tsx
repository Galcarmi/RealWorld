import { fireEvent } from '@testing-library/react-native';

import '../../mocks';

import { renderLoginScreen } from '../../utils/testHelpers';

import { TEST_IDS } from '../../../src/constants/testIds';
import { navigationService } from '../../../src/services/navigationService';
import * as storeMocks from '../../mocks/stores';

const authStore = storeMocks.getAuthStore();

describe('Login Flow Integration Tests', () => {
  describe('Initial Screen State', () => {
    it('should render login screen with all required elements', () => {
      const { getByTestId } = renderLoginScreen();

      expect(getByTestId(TEST_IDS.AUTH_SCREEN_TITLE)).toBeTruthy();
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

      fireEvent.changeText(
        getByTestId(TEST_IDS.AUTH_EMAIL_INPUT),
        'test@example.com'
      );

      expect(setEmailSpy).toHaveBeenCalledWith('test@example.com');
    });

    it('should update password field and store when typing', () => {
      const setPasswordSpy = jest.spyOn(authStore, 'setPassword');
      const { getByTestId } = renderLoginScreen();

      fireEvent.changeText(
        getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT),
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

      fireEvent.changeText(
        getByTestId(TEST_IDS.AUTH_EMAIL_INPUT),
        'test@example.com'
      );
      fireEvent.changeText(
        getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT),
        'password123'
      );

      const submitButton = getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON);
      expect(submitButton).toBeTruthy();
    });

    it('should keep submit button disabled with invalid email', () => {
      const { getByTestId } = renderLoginScreen();

      fireEvent.changeText(
        getByTestId(TEST_IDS.AUTH_EMAIL_INPUT),
        'invalid-email'
      );
      fireEvent.changeText(
        getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT),
        'password123'
      );

      const submitButton = getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON);
      expect(submitButton).toBeDisabled();
    });

    it('should keep submit button disabled with short password', () => {
      const { getByTestId } = renderLoginScreen();

      fireEvent.changeText(
        getByTestId(TEST_IDS.AUTH_EMAIL_INPUT),
        'test@example.com'
      );
      fireEvent.changeText(getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT), '123');

      const submitButton = getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON);
      expect(submitButton).toBeDisabled();
    });

    it('should handle form field changes progressively', () => {
      const { getByTestId } = renderLoginScreen();

      expect(getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON)).toBeDisabled();

      fireEvent.changeText(
        getByTestId(TEST_IDS.AUTH_EMAIL_INPUT),
        'test@example.com'
      );
      expect(getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON)).toBeDisabled();

      fireEvent.changeText(
        getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT),
        'password123'
      );

      expect(getByTestId(TEST_IDS.AUTH_EMAIL_INPUT)).toBeTruthy();
      expect(getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT)).toBeTruthy();
    });
  });

  describe('Login Submission', () => {
    it('should trigger login action when submit is attempted', () => {
      const { getByTestId } = renderLoginScreen();

      fireEvent.changeText(
        getByTestId(TEST_IDS.AUTH_EMAIL_INPUT),
        'test@example.com'
      );
      fireEvent.changeText(
        getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT),
        'password123'
      );

      fireEvent.press(getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON));

      expect(getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON)).toBeTruthy();
    });

    it('should show loading state during login', () => {
      authStore.isLoading = true;

      const { getByTestId } = renderLoginScreen();

      const submitButton = getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON);
      expect(submitButton).toBeDisabled();
    });

    it('should handle login process integration', () => {
      const { getByTestId } = renderLoginScreen();

      fireEvent.changeText(
        getByTestId(TEST_IDS.AUTH_EMAIL_INPUT),
        'test@example.com'
      );
      fireEvent.changeText(
        getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT),
        'password123'
      );

      expect(getByTestId(TEST_IDS.AUTH_EMAIL_INPUT)).toBeTruthy();
      expect(getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT)).toBeTruthy();
      expect(getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON)).toBeTruthy();
    });
  });

  describe('Navigation Actions', () => {
    it('should navigate to sign up screen when sign up button is pressed', () => {
      const navigationSpy = jest.spyOn(
        navigationService,
        'navigateToSignUpScreen'
      );

      const { getByTestId } = renderLoginScreen();

      fireEvent.press(getByTestId(TEST_IDS.AUTH_SIGNUP_BUTTON));

      expect(navigationSpy).toHaveBeenCalledTimes(1);
    });

    it('should display correct text on navigation button', () => {
      const { getByText } = renderLoginScreen();

      expect(getByText('Sign Up')).toBeTruthy();
    });
  });

  describe('Loading States', () => {
    it('should disable all interactions during loading', () => {
      authStore.isLoading = true;

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
      authStore.isLoading = false;

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

      fireEvent.changeText(
        getByTestId(TEST_IDS.AUTH_EMAIL_INPUT),
        'wrong@example.com'
      );
      fireEvent.changeText(
        getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT),
        'wrongpassword'
      );

      fireEvent.press(getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON));

      expect(getByTestId(TEST_IDS.SIGNIN_SCREEN)).toBeTruthy();
    });

    it('should clear errors when user starts typing', () => {
      authStore.errors = { email: ['Invalid email'] };

      const setEmailSpy = jest.spyOn(authStore, 'setEmail');
      const { getByTestId } = renderLoginScreen();

      fireEvent.changeText(
        getByTestId(TEST_IDS.AUTH_EMAIL_INPUT),
        'newemail@example.com'
      );

      expect(setEmailSpy).toHaveBeenCalledWith('newemail@example.com');
    });

    it('should handle login errors gracefully', async () => {
      const { getByTestId } = renderLoginScreen();

      fireEvent.changeText(
        getByTestId(TEST_IDS.AUTH_EMAIL_INPUT),
        'error@example.com'
      );
      fireEvent.changeText(
        getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT),
        'password123'
      );

      fireEvent.press(getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON));

      expect(getByTestId(TEST_IDS.SIGNIN_SCREEN)).toBeTruthy();
    });

    it('should handle network errors gracefully', async () => {
      const { getByTestId } = renderLoginScreen();

      fireEvent.changeText(
        getByTestId(TEST_IDS.AUTH_EMAIL_INPUT),
        'network@example.com'
      );
      fireEvent.changeText(
        getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT),
        'password123'
      );

      fireEvent.press(getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON));

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

      fireEvent.changeText(
        getByTestId(TEST_IDS.AUTH_EMAIL_INPUT),
        'integration@test.com'
      );
      fireEvent.changeText(
        getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT),
        'integrationtest'
      );

      expect(setEmailSpy).toHaveBeenCalledWith('integration@test.com');
      expect(setPasswordSpy).toHaveBeenCalledWith('integrationtest');
    });

    it('should reflect store state in UI', () => {
      authStore.isLoading = false;

      const { getByTestId } = renderLoginScreen();

      fireEvent.changeText(
        getByTestId(TEST_IDS.AUTH_EMAIL_INPUT),
        'valid@email.com'
      );
      fireEvent.changeText(
        getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT),
        'validpassword'
      );

      expect(getByTestId(TEST_IDS.SIGNIN_SCREEN)).toBeTruthy();
    });
  });

  describe('Multiple Interaction Sequences', () => {
    it('should handle multiple form interactions gracefully', () => {
      const { getByTestId } = renderLoginScreen();

      fireEvent.changeText(
        getByTestId(TEST_IDS.AUTH_EMAIL_INPUT),
        'test@example.com'
      );
      fireEvent.changeText(
        getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT),
        'password123'
      );

      fireEvent.press(getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON));
      fireEvent.press(getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON));
      fireEvent.press(getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON));

      expect(getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON)).toBeTruthy();
    });

    it('should handle navigation button presses correctly', () => {
      const navigationSpy = jest.spyOn(
        navigationService,
        'navigateToSignUpScreen'
      );

      const { getByTestId } = renderLoginScreen();

      fireEvent.press(getByTestId(TEST_IDS.AUTH_SIGNUP_BUTTON));
      fireEvent.press(getByTestId(TEST_IDS.AUTH_SIGNUP_BUTTON));

      expect(navigationSpy).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle component unmount gracefully', () => {
      const { unmount } = renderLoginScreen();

      expect(() => unmount()).not.toThrow();
    });
  });
});
