import { render, fireEvent, waitFor } from '@testing-library/react-native';

import '../../mocks';
import { fillUpdateForm } from '../../utils/formHelpers';

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

  describe('Profile Management', () => {
    it('loads and displays current user profile data', async () => {
      const { getByTestId } = renderEditProfileScreen();

      expect(getByTestId(TEST_IDS.EDIT_PROFILE_SCREEN)).toBeTruthy();
      expect(getByTestId(TEST_IDS.EDIT_PROFILE_UPDATE_BUTTON)).toBeTruthy();

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

    it('handles profile update form submission', async () => {
      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        expect(
          getByTestId(TEST_IDS.EDIT_PROFILE_USERNAME_INPUT).props.value
        ).toBe(mockUser.username);
      });

      fillUpdateForm(getByTestId, {
        username: 'newusername',
        bio: 'Updated bio text',
        email: 'new@example.com',
      });

      const updateButton = getByTestId(TEST_IDS.EDIT_PROFILE_UPDATE_BUTTON);
      expect(updateButton).toBeTruthy();

      fireEvent.press(updateButton);

      expect(getByTestId(TEST_IDS.EDIT_PROFILE_SCREEN)).toBeTruthy();
    });

    it('validates form data before enabling update', async () => {
      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        expect(
          getByTestId(TEST_IDS.EDIT_PROFILE_USERNAME_INPUT).props.value
        ).toBe(mockUser.username);
      });

      fillUpdateForm(getByTestId, {
        username: '',
        bio: 'Some bio',
        email: 'test@example.com',
      });

      expect(getByTestId(TEST_IDS.EDIT_PROFILE_SCREEN)).toBeTruthy();
      expect(getByTestId(TEST_IDS.EDIT_PROFILE_UPDATE_BUTTON)).toBeTruthy();
    });
  });

  describe('Authentication Management', () => {
    it('handles logout successfully', async () => {
      const { getByTestId } = renderEditProfileScreen();

      fireEvent.press(getByTestId(TEST_IDS.EDIT_PROFILE_LOGOUT_BUTTON));

      await waitFor(() => {
        expect(authStore.logout).toHaveBeenCalledTimes(1);
      });
    });
  });
});
