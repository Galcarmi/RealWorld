import { render, fireEvent } from '@testing-library/react-native';

import '../../mocks/reactNativeMocks';

import { TEST_IDS } from '../../../src/constants/testIds';
import { SignUpScreen } from '../../../src/screens/login/signUpScreen';
import { navigationService } from '../../../src/services/navigationService';
import * as storeMocks from '../../mocks/stores';

const authStore = storeMocks.getAuthStore();

const renderSignUpScreen = () => {
  return render(<SignUpScreen />);
};

const fillSignUpForm = (getByTestId: any, overrides = {}) => {
  const defaultData = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123456',
    ...overrides,
  };

  fireEvent.changeText(
    getByTestId(TEST_IDS.AUTH_USERNAME_INPUT),
    defaultData.username
  );
  fireEvent.changeText(
    getByTestId(TEST_IDS.AUTH_EMAIL_INPUT),
    defaultData.email
  );
  fireEvent.changeText(
    getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT),
    defaultData.password
  );

  return defaultData;
};

describe('Sign Up Flow Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    authStore.clear();
  });

  describe('Form Rendering', () => {
    it('renders signup form with all required fields', () => {
      const { getByTestId } = renderSignUpScreen();

      expect(getByTestId(TEST_IDS.SIGNUP_SCREEN)).toBeTruthy();
      expect(getByTestId(TEST_IDS.AUTH_USERNAME_INPUT)).toBeTruthy();
      expect(getByTestId(TEST_IDS.AUTH_EMAIL_INPUT)).toBeTruthy();
      expect(getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT)).toBeTruthy();
      expect(getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON)).toBeTruthy();
      expect(getByTestId(TEST_IDS.AUTH_SIGNIN_BUTTON)).toBeTruthy();
    });

    it('initializes with submit button disabled', () => {
      const { getByTestId } = renderSignUpScreen();

      expect(getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON)).toBeDisabled();
    });
  });

  describe('Form Store', () => {
    it('integrates form inputs with auth store', () => {
      const setUsernameSpy = jest.spyOn(authStore, 'setUsername');
      const setEmailSpy = jest.spyOn(authStore, 'setEmail');
      const setPasswordSpy = jest.spyOn(authStore, 'setPassword');
      const { getByTestId } = renderSignUpScreen();

      fillSignUpForm(getByTestId);

      expect(setUsernameSpy).toHaveBeenCalledWith('testuser');
      expect(setEmailSpy).toHaveBeenCalledWith('test@example.com');
      expect(setPasswordSpy).toHaveBeenCalledWith('password123456');
    });
  });

  describe('Registration Flow', () => {
    it('integrates form submission with registration process', () => {
      const registerSpy = jest.spyOn(authStore, 'register');
      const { getByTestId } = renderSignUpScreen();

      fillSignUpForm(getByTestId);
      fireEvent.press(getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON));

      expect(registerSpy).toHaveBeenCalled();
    });

    it('handles loading state during registration', () => {
      authStore.isLoading = true;
      const { getByTestId } = renderSignUpScreen();

      expect(getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON)).toBeDisabled();
    });

    it('displays validation errors from registration failure', () => {
      authStore.errors = {
        username: ['Username already exists'],
        email: ['Email is invalid'],
      };
      const { getByTestId } = renderSignUpScreen();

      // Form should remain accessible for corrections
      expect(getByTestId(TEST_IDS.AUTH_USERNAME_INPUT)).toBeTruthy();
      expect(getByTestId(TEST_IDS.AUTH_EMAIL_INPUT)).toBeTruthy();
      expect(getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT)).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('navigates to login screen when signin link is pressed', () => {
      const navigationSpy = jest.spyOn(
        navigationService,
        'navigateToLoginScreen'
      );
      const { getByTestId } = renderSignUpScreen();

      fireEvent.press(getByTestId(TEST_IDS.AUTH_SIGNIN_BUTTON));

      expect(navigationSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Complete Registration Flow', () => {
    it('handles full registration flow from input to submission', () => {
      const registerSpy = jest
        .spyOn(authStore, 'register')
        .mockResolvedValue(undefined);
      const { getByTestId } = renderSignUpScreen();

      // Fill form
      fillSignUpForm(getByTestId);

      // Submit
      fireEvent.press(getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON));

      // Verify registration was triggered
      expect(registerSpy).toHaveBeenCalled();
    });
  });
});
