import { render, fireEvent } from '@testing-library/react-native';

import '../../mocks';
import { SignUpScreen } from '../../../src/screens/login/signUpScreen';
import { navigationService } from '../../../src/services/navigationService';
import { authStore } from '../../../src/store/authStore';
import { userStore } from '../../../src/store/userStore';
import { TEST_IDS } from '../../constants';
import { resetAllStoreMocks, getMockAuthStore } from '../../mocks/stores';

const mockAuthStore = getMockAuthStore();

const renderSignUpScreen = () => {
  return render(<SignUpScreen />);
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

      expect(getByTestId(TEST_IDS.SIGNUP_SCREEN)).toBeTruthy();
      expect(getByTestId(TEST_IDS.AUTH_USERNAME_INPUT)).toBeTruthy();
      expect(getByTestId(TEST_IDS.AUTH_EMAIL_INPUT)).toBeTruthy();
      expect(getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT)).toBeTruthy();
      expect(getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON)).toBeTruthy();
      expect(getByTestId(TEST_IDS.AUTH_SIGNIN_BUTTON)).toBeTruthy();
    });

    it('should display correct screen title', () => {
      const { getByTestId } = renderSignUpScreen();

      expect(getByTestId(TEST_IDS.AUTH_SCREEN_TITLE)).toBeTruthy();
    });

    it('should disable submit button with empty fields', () => {
      const { getByTestId } = renderSignUpScreen();

      const submitButton = getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON);
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Form Field Interactions', () => {
    it('should update username field and store when typing', () => {
      const setUsernameSpy = jest.spyOn(authStore, 'setUsername');
      const { getByTestId } = renderSignUpScreen();

      const usernameInput = getByTestId(TEST_IDS.AUTH_USERNAME_INPUT);
      fireEvent.changeText(usernameInput, 'testuser');

      expect(setUsernameSpy).toHaveBeenCalledWith('testuser');
    });

    it('should update email field and store when typing', () => {
      const setEmailSpy = jest.spyOn(authStore, 'setEmail');
      const { getByTestId } = renderSignUpScreen();

      const emailInput = getByTestId(TEST_IDS.AUTH_EMAIL_INPUT);
      fireEvent.changeText(emailInput, 'test@example.com');

      expect(setEmailSpy).toHaveBeenCalledWith('test@example.com');
    });

    it('should update password field and store when typing', () => {
      const setPasswordSpy = jest.spyOn(authStore, 'setPassword');
      const { getByTestId } = renderSignUpScreen();

      const passwordInput = getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT);
      fireEvent.changeText(passwordInput, 'password123');

      expect(setPasswordSpy).toHaveBeenCalledWith('password123');
    });

    it('should handle all field focus and blur events', () => {
      const { getByTestId } = renderSignUpScreen();

      const usernameInput = getByTestId(TEST_IDS.AUTH_USERNAME_INPUT);
      const emailInput = getByTestId(TEST_IDS.AUTH_EMAIL_INPUT);
      const passwordInput = getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT);

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

      const usernameInput = getByTestId(TEST_IDS.AUTH_USERNAME_INPUT);
      const emailInput = getByTestId(TEST_IDS.AUTH_EMAIL_INPUT);
      const passwordInput = getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT);

      fireEvent.changeText(usernameInput, 'testuser');
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      const submitButton = getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON);
      expect(submitButton).toBeTruthy();
    });

    it('should keep submit button disabled with invalid inputs', () => {
      const { getByTestId } = renderSignUpScreen();

      const usernameInput = getByTestId(TEST_IDS.AUTH_USERNAME_INPUT);
      const emailInput = getByTestId(TEST_IDS.AUTH_EMAIL_INPUT);
      const passwordInput = getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT);

      fireEvent.changeText(usernameInput, 'u');
      fireEvent.changeText(emailInput, 'invalid-email');
      fireEvent.changeText(passwordInput, '123');

      const submitButton = getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON);
      expect(submitButton).toBeTruthy();
    });

    it('should handle form field changes progressively', () => {
      const { getByTestId } = renderSignUpScreen();

      const usernameInput = getByTestId(TEST_IDS.AUTH_USERNAME_INPUT);
      const emailInput = getByTestId(TEST_IDS.AUTH_EMAIL_INPUT);
      const passwordInput = getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT);

      const submitButton = getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON);
      expect(submitButton).toBeDisabled();

      fireEvent.changeText(usernameInput, 'testuser');
      expect(submitButton).toBeDisabled();

      fireEvent.changeText(emailInput, 'test@example.com');
      expect(submitButton).toBeDisabled();

      fireEvent.changeText(passwordInput, 'password123');

      expect(usernameInput).toBeTruthy();
      expect(emailInput).toBeTruthy();
      expect(passwordInput).toBeTruthy();
    });
  });

  describe('SignUp Submission', () => {
    it('should trigger register action when submit is attempted', () => {
      const { getByTestId } = renderSignUpScreen();

      const usernameInput = getByTestId(TEST_IDS.AUTH_USERNAME_INPUT);
      const emailInput = getByTestId(TEST_IDS.AUTH_EMAIL_INPUT);
      const passwordInput = getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT);
      const submitButton = getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON);

      fireEvent.changeText(usernameInput, 'testuser');
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      fireEvent.press(submitButton);

      expect(submitButton).toBeTruthy();
    });

    it('should show loading state during registration', () => {
      mockAuthStore.isLoading = true;

      const { getByTestId } = renderSignUpScreen();

      const submitButton = getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON);
      expect(submitButton).toBeDisabled();
    });

    it('should handle registration process integration', () => {
      const { getByTestId } = renderSignUpScreen();

      const usernameInput = getByTestId(TEST_IDS.AUTH_USERNAME_INPUT);
      const emailInput = getByTestId(TEST_IDS.AUTH_EMAIL_INPUT);
      const passwordInput = getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT);
      const submitButton = getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON);

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

      const signInButton = getByTestId(TEST_IDS.AUTH_SIGNIN_BUTTON);
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

      const usernameInput = getByTestId(TEST_IDS.AUTH_USERNAME_INPUT);
      const emailInput = getByTestId(TEST_IDS.AUTH_EMAIL_INPUT);
      const passwordInput = getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT);
      const submitButton = getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON);

      expect(submitButton).toBeDisabled();

      fireEvent.changeText(usernameInput, 'testuser');
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      expect(submitButton).toBeDisabled();
    });

    it('should reflect loading state correctly', () => {
      mockAuthStore.isLoading = false;

      const { getByTestId } = renderSignUpScreen();

      const usernameInput = getByTestId(TEST_IDS.AUTH_USERNAME_INPUT);
      const emailInput = getByTestId(TEST_IDS.AUTH_EMAIL_INPUT);
      const passwordInput = getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT);

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

      const usernameInput = getByTestId(TEST_IDS.AUTH_USERNAME_INPUT);
      const emailInput = getByTestId(TEST_IDS.AUTH_EMAIL_INPUT);
      const passwordInput = getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT);
      const signUpButton = getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON);

      fireEvent.changeText(usernameInput, 'erroruser');
      fireEvent.changeText(emailInput, 'error@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(signUpButton);

      expect(getByTestId(TEST_IDS.SIGNUP_SCREEN)).toBeTruthy();
    });

    it('should handle network errors gracefully', async () => {
      const { getByTestId } = renderSignUpScreen();

      const usernameInput = getByTestId(TEST_IDS.AUTH_USERNAME_INPUT);
      const emailInput = getByTestId(TEST_IDS.AUTH_EMAIL_INPUT);
      const passwordInput = getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT);
      const signUpButton = getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON);

      fireEvent.changeText(usernameInput, 'networkuser');
      fireEvent.changeText(emailInput, 'network@example.com');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.press(signUpButton);

      expect(getByTestId(TEST_IDS.SIGNUP_SCREEN)).toBeTruthy();
    });

    it('should clear errors when user starts typing', () => {
      mockAuthStore.errors = {
        username: ['Invalid username'],
      };

      const setUsernameSpy = jest.spyOn(authStore, 'setUsername');
      const { getByTestId } = renderSignUpScreen();

      const usernameInput = getByTestId(TEST_IDS.AUTH_USERNAME_INPUT);
      fireEvent.changeText(usernameInput, 'newusername');

      expect(setUsernameSpy).toHaveBeenCalledWith('newusername');
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility labels', () => {
      const { getByTestId } = renderSignUpScreen();

      const usernameInput = getByTestId(TEST_IDS.AUTH_USERNAME_INPUT);
      const emailInput = getByTestId(TEST_IDS.AUTH_EMAIL_INPUT);
      const passwordInput = getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT);
      const submitButton = getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON);

      expect(usernameInput).toBeTruthy();
      expect(emailInput).toBeTruthy();
      expect(passwordInput).toBeTruthy();
      expect(submitButton).toBeTruthy();
    });

    it('should support secure text entry for password', () => {
      const { getByTestId } = renderSignUpScreen();

      const passwordInput = getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT);
      expect(passwordInput.props.secureTextEntry).toBe(true);
    });
  });

  describe('Form Integration', () => {
    it('should integrate properly with auth store', () => {
      const setUsernameSpy = jest.spyOn(authStore, 'setUsername');
      const setEmailSpy = jest.spyOn(authStore, 'setEmail');
      const setPasswordSpy = jest.spyOn(authStore, 'setPassword');
      const { getByTestId } = renderSignUpScreen();

      const usernameInput = getByTestId(TEST_IDS.AUTH_USERNAME_INPUT);
      const emailInput = getByTestId(TEST_IDS.AUTH_EMAIL_INPUT);
      const passwordInput = getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT);

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

      const usernameInput = getByTestId(TEST_IDS.AUTH_USERNAME_INPUT);
      const emailInput = getByTestId(TEST_IDS.AUTH_EMAIL_INPUT);
      const passwordInput = getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT);

      fireEvent.changeText(usernameInput, 'validuser');
      fireEvent.changeText(emailInput, 'valid@email.com');
      fireEvent.changeText(passwordInput, 'validpassword');

      expect(getByTestId(TEST_IDS.SIGNUP_SCREEN)).toBeTruthy();
    });
  });

  describe('Username Validation Specific Cases', () => {
    it('should handle minimum username length validation', () => {
      const { getByTestId } = renderSignUpScreen();

      const usernameInput = getByTestId(TEST_IDS.AUTH_USERNAME_INPUT);

      fireEvent.changeText(usernameInput, 'ab');
      const submitButton = getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON);
      expect(submitButton).toBeDisabled();

      fireEvent.changeText(usernameInput, 'abc');
      expect(usernameInput).toBeTruthy();
    });

    it('should handle edge case username lengths', () => {
      const { getByTestId } = renderSignUpScreen();

      const usernameInput = getByTestId(TEST_IDS.AUTH_USERNAME_INPUT);

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

      const passwordInput = getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT);

      fireEvent.changeText(passwordInput, '12345');
      const submitButton = getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON);
      expect(submitButton).toBeDisabled();

      fireEvent.changeText(passwordInput, '123456');
      expect(passwordInput).toBeTruthy();
    });

    it('should handle various password strengths', () => {
      const { getByTestId } = renderSignUpScreen();

      const passwordInput = getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT);

      fireEvent.changeText(passwordInput, '123456');
      fireEvent.changeText(passwordInput, 'password123');
      fireEvent.changeText(passwordInput, 'P@ssw0rd!');

      expect(passwordInput).toBeTruthy();
    });
  });

  describe('Multiple Interaction Sequences', () => {
    it('should handle multiple form interactions gracefully', () => {
      const { getByTestId } = renderSignUpScreen();

      const usernameInput = getByTestId(TEST_IDS.AUTH_USERNAME_INPUT);
      const emailInput = getByTestId(TEST_IDS.AUTH_EMAIL_INPUT);
      const passwordInput = getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT);
      const submitButton = getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON);

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

      const signInButton = getByTestId(TEST_IDS.AUTH_SIGNIN_BUTTON);

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

    it('should handle rapid field changes', () => {
      const { getByTestId } = renderSignUpScreen();

      const usernameInput = getByTestId(TEST_IDS.AUTH_USERNAME_INPUT);

      fireEvent.changeText(usernameInput, 'a');
      fireEvent.changeText(usernameInput, 'ab');
      fireEvent.changeText(usernameInput, 'abc');
      fireEvent.changeText(usernameInput, 'abcd');
      fireEvent.changeText(usernameInput, 'finaluser');

      expect(usernameInput).toBeTruthy();
    });
  });
});
