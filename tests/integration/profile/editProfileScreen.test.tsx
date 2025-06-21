import { render, fireEvent, waitFor } from '@testing-library/react-native';

import '../../mocks';
import { TEST_IDS } from '../../../src/constants/testIds';
import { EditProfileScreen } from '../../../src/screens/editProfile/editProfileScreen';
import { createMockUser } from '../../mocks/data';
import * as storeMocks from '../../mocks/stores';

const userStore = storeMocks.getUserStore();
const authStore = storeMocks.getAuthStore();

const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
}));

const renderEditProfileScreen = () => {
  return render(<EditProfileScreen />);
};

const fillUpdateForm = (getByTestId: any, overrides = {}) => {
  const defaultData = {
    username: 'updateduser',
    email: 'updated@example.com',
    bio: 'Updated bio',
    image: 'https://example.com/new-avatar.jpg',
    ...overrides,
  };

  fireEvent.changeText(
    getByTestId(TEST_IDS.EDIT_PROFILE_USERNAME_INPUT),
    defaultData.username
  );
  fireEvent.changeText(
    getByTestId(TEST_IDS.EDIT_PROFILE_EMAIL_INPUT),
    defaultData.email
  );
  fireEvent.changeText(
    getByTestId(TEST_IDS.EDIT_PROFILE_BIO_INPUT),
    defaultData.bio
  );
  fireEvent.changeText(
    getByTestId(TEST_IDS.EDIT_PROFILE_IMAGE_INPUT),
    defaultData.image
  );

  return defaultData;
};

describe('Edit Profile Screen Tests', () => {
  const mockUser = createMockUser({
    username: 'testuser',
    email: 'test@example.com',
    bio: 'Test bio',
    image: 'https://example.com/avatar.jpg',
  });

  beforeEach(() => {
    jest.clearAllMocks();
    userStore.setUser(mockUser);
    mockGoBack.mockClear();
  });

  describe('Screen Rendering', () => {
    it('renders edit profile screen with all form fields', () => {
      const { getByTestId } = renderEditProfileScreen();

      expect(getByTestId(TEST_IDS.EDIT_PROFILE_SCREEN)).toBeTruthy();
      expect(getByTestId(TEST_IDS.EDIT_PROFILE_IMAGE_INPUT)).toBeTruthy();
      expect(getByTestId(TEST_IDS.EDIT_PROFILE_USERNAME_INPUT)).toBeTruthy();
      expect(getByTestId(TEST_IDS.EDIT_PROFILE_BIO_INPUT)).toBeTruthy();
      expect(getByTestId(TEST_IDS.EDIT_PROFILE_EMAIL_INPUT)).toBeTruthy();
      expect(getByTestId(TEST_IDS.EDIT_PROFILE_PASSWORD_INPUT)).toBeTruthy();
      expect(getByTestId(TEST_IDS.EDIT_PROFILE_UPDATE_BUTTON)).toBeTruthy();
      expect(getByTestId(TEST_IDS.EDIT_PROFILE_LOGOUT_BUTTON)).toBeTruthy();
    });

    it('pre-populates form fields with current user data', async () => {
      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        expect(
          getByTestId(TEST_IDS.EDIT_PROFILE_USERNAME_INPUT).props.value
        ).toBe(mockUser.username);
        expect(getByTestId(TEST_IDS.EDIT_PROFILE_EMAIL_INPUT).props.value).toBe(
          mockUser.email
        );
        expect(getByTestId(TEST_IDS.EDIT_PROFILE_BIO_INPUT).props.value).toBe(
          mockUser.bio
        );
        expect(getByTestId(TEST_IDS.EDIT_PROFILE_IMAGE_INPUT).props.value).toBe(
          mockUser.image
        );
      });
    });
  });

  describe('Form Input', () => {
    it('handles form field changes', async () => {
      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        const usernameInput = getByTestId(TEST_IDS.EDIT_PROFILE_USERNAME_INPUT);
        const bioInput = getByTestId(TEST_IDS.EDIT_PROFILE_BIO_INPUT);

        fireEvent.changeText(usernameInput, 'newusername');
        fireEvent.changeText(bioInput, 'New bio text');

        expect(usernameInput.props.value).toBe('newusername');
        expect(bioInput.props.value).toBe('New bio text');
      });
    });

    it('handles multiple rapid input changes', async () => {
      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        const bioInput = getByTestId(TEST_IDS.EDIT_PROFILE_BIO_INPUT);
        const imageInput = getByTestId(TEST_IDS.EDIT_PROFILE_IMAGE_INPUT);

        fireEvent.changeText(bioInput, 'Bio 1');
        fireEvent.changeText(bioInput, 'Bio 2');
        fireEvent.changeText(imageInput, 'http://image1.jpg');
        fireEvent.changeText(imageInput, 'http://image2.jpg');

        expect(bioInput.props.value).toBe('Bio 2');
        expect(imageInput.props.value).toBe('http://image2.jpg');
      });
    });
  });

  describe('Profile Update', () => {
    it('handles successful profile update', async () => {
      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        expect(
          getByTestId(TEST_IDS.EDIT_PROFILE_USERNAME_INPUT).props.value
        ).toBe(mockUser.username);
      });

      fillUpdateForm(getByTestId, {
        username: 'differentusername',
        bio: 'Different bio',
        email: 'different@example.com',
      });

      const initialCallCount = (userStore.setUser as jest.Mock).mock.calls
        .length;

      await waitFor(() => {
        fireEvent.press(getByTestId(TEST_IDS.EDIT_PROFILE_UPDATE_BUTTON));
      });

      await waitFor(() => {
        expect(
          (userStore.setUser as jest.Mock).mock.calls.length
        ).toBeGreaterThan(initialCallCount);
      });
    });

    it('handles profile update with empty fields', async () => {
      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        expect(
          getByTestId(TEST_IDS.EDIT_PROFILE_USERNAME_INPUT).props.value
        ).toBe(mockUser.username);
      });

      fillUpdateForm(getByTestId, {
        username: 'differentusername',
        bio: '',
        email: 'different@example.com',
      });

      const initialCallCount = (userStore.setUser as jest.Mock).mock.calls
        .length;

      await waitFor(() => {
        fireEvent.press(getByTestId(TEST_IDS.EDIT_PROFILE_UPDATE_BUTTON));
      });

      await waitFor(() => {
        expect(
          (userStore.setUser as jest.Mock).mock.calls.length
        ).toBeGreaterThan(initialCallCount);
      });
    });

    it('handles profile update errors gracefully', async () => {
      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        expect(
          getByTestId(TEST_IDS.EDIT_PROFILE_USERNAME_INPUT).props.value
        ).toBe(mockUser.username);
      });

      fillUpdateForm(getByTestId, {
        username: 'differentusername',
        email: 'different@example.com',
      });

      await waitFor(() => {
        fireEvent.press(getByTestId(TEST_IDS.EDIT_PROFILE_UPDATE_BUTTON));
      });

      expect(getByTestId(TEST_IDS.EDIT_PROFILE_SCREEN)).toBeTruthy();
      expect(getByTestId(TEST_IDS.EDIT_PROFILE_UPDATE_BUTTON)).toBeTruthy();
    });
  });

  describe('Logout', () => {
    it('handles logout button press', async () => {
      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        fireEvent.press(getByTestId(TEST_IDS.EDIT_PROFILE_LOGOUT_BUTTON));
      });

      expect(authStore.logout).toHaveBeenCalledTimes(1);
    });
  });
});
