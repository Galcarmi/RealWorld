import { fireEvent } from '@testing-library/react-native';

import '../../mocks';

import { fillLoginForm } from '../../utils/formHelpers';
import { renderLoginScreen } from '../../utils/testHelpers';

import { TEST_IDS } from '../../../src/constants/testIds';
import { navigationService } from '../../../src/services';
import * as storeMocks from '../../mocks/stores';

const authStore = storeMocks.getAuthStore();

describe('Login Flow Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    authStore.clear();
  });

  describe('Authentication', () => {
    it('renders login form and integrates with auth store', () => {
      const setEmailSpy = jest.spyOn(authStore, 'setEmail');
      const setPasswordSpy = jest.spyOn(authStore, 'setPassword');
      const { getByTestId } = renderLoginScreen();

      expect(getByTestId(TEST_IDS.AUTH_EMAIL_INPUT)).toBeTruthy();
      expect(getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT)).toBeTruthy();
      expect(getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON)).toBeTruthy();

      fillLoginForm(getByTestId);

      expect(setEmailSpy).toHaveBeenCalledWith('test@example.com');
      expect(setPasswordSpy).toHaveBeenCalledWith('password123456');
    });

    it('validates form input and controls submit button state', () => {
      const { getByTestId } = renderLoginScreen();

      expect(getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON)).toBeDisabled();

      fillLoginForm(getByTestId, { email: 'invalid-email' });
      expect(getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON)).toBeDisabled();

      fillLoginForm(getByTestId, { password: '12345' });
      expect(getByTestId(TEST_IDS.AUTH_SUBMIT_BUTTON)).toBeDisabled();
    });

    it('handles login submission successfully', () => {
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

    it('displays authentication errors', () => {
      authStore.errors = { email: ['Invalid email format'] };
      const { getByTestId } = renderLoginScreen();

      expect(getByTestId(TEST_IDS.AUTH_EMAIL_INPUT)).toBeTruthy();
      expect(getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT)).toBeTruthy();
    });
  });

  describe('Navigation', () => {
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
});
