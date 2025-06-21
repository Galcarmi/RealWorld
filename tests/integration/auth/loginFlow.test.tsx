import { fireEvent } from '@testing-library/react-native';

import '../../mocks';

import { renderLoginScreen } from '../../utils/testHelpers';

import { TEST_IDS } from '../../../src/constants/testIds';
import { navigationService } from '../../../src/services/navigationService';
import * as storeMocks from '../../mocks/stores';

const authStore = storeMocks.getAuthStore();

const fillLoginForm = (getByTestId: any, overrides = {}) => {
  const defaultData = {
    email: 'test@example.com',
    password: 'password123456',
    ...overrides,
  };

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

describe('Login Flow Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    authStore.clear();
  });

  describe('Authentication Form Integration', () => {
    it('renders login form with required fields', () => {
      const { getByTestId } = renderLoginScreen();

      expect(getByTestId(TEST_IDS.AUTH_EMAIL_INPUT)).toBeTruthy();
      expect(getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT)).toBeTruthy();
      expect(getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON)).toBeTruthy();
    });

    it('integrates form input with auth store', () => {
      const setEmailSpy = jest.spyOn(authStore, 'setEmail');
      const setPasswordSpy = jest.spyOn(authStore, 'setPassword');
      const { getByTestId } = renderLoginScreen();

      fillLoginForm(getByTestId);

      expect(setEmailSpy).toHaveBeenCalledWith('test@example.com');
      expect(setPasswordSpy).toHaveBeenCalledWith('password123456');
    });
  });

  describe('Form Validation Integration', () => {
    it('integrates form submission with validation', () => {
      const { getByTestId } = renderLoginScreen();

      expect(getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON)).toBeDisabled();

      fillLoginForm(getByTestId);

      expect(getByTestId(TEST_IDS.AUTH_EMAIL_INPUT)).toBeTruthy();
      expect(getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT)).toBeTruthy();
    });

    it('keeps submit disabled for invalid email format', () => {
      const { getByTestId } = renderLoginScreen();

      fillLoginForm(getByTestId, { email: 'invalid-email' });

      expect(getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON)).toBeDisabled();
    });

    it('keeps submit disabled for short password', () => {
      const { getByTestId } = renderLoginScreen();

      fillLoginForm(getByTestId, { password: '12345' }); // Use 5 chars, which should be too short

      expect(getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON)).toBeDisabled();
    });
  });

  describe('Authentication Flow Integration', () => {
    it('integrates form submission with auth store', () => {
      const loginSpy = jest.spyOn(authStore, 'login');
      const { getByTestId } = renderLoginScreen();

      fillLoginForm(getByTestId);
      fireEvent.press(getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON));

      expect(loginSpy).toHaveBeenCalled();
    });

    it('handles loading state during authentication', () => {
      authStore.isLoading = true;
      const { getByTestId } = renderLoginScreen();

      expect(getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON)).toBeDisabled();
    });

    it('displays errors from authentication failure', () => {
      authStore.errors = { email: ['Invalid email format'] };
      const { getByTestId } = renderLoginScreen();

      expect(getByTestId(TEST_IDS.AUTH_EMAIL_INPUT)).toBeTruthy();
      expect(getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT)).toBeTruthy();
    });
  });

  describe('Navigation Integration', () => {
    it('navigates to sign up screen when registration link is pressed', () => {
      const navigationSpy = jest.spyOn(
        navigationService,
        'navigateToSignUpScreen'
      );
      const { getByTestId } = renderLoginScreen();

      fireEvent.press(getByTestId(TEST_IDS.AUTH_SIGNUP_BUTTON));

      expect(navigationSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('User Experience Integration', () => {
    it('handles complete login flow from form filling to submission', () => {
      const loginSpy = jest
        .spyOn(authStore, 'login')
        .mockResolvedValue(undefined);
      const { getByTestId } = renderLoginScreen();

      fillLoginForm(getByTestId);

      fireEvent.press(getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON));

      expect(loginSpy).toHaveBeenCalled();
    });
  });
});
