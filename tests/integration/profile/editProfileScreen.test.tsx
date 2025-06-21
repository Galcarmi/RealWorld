import { render, fireEvent, waitFor } from '@testing-library/react-native';

import '../../mocks';
import { TEST_IDS } from '../../../src/constants/testIds';
import { EditProfileScreen } from '../../../src/screens/editProfile/editProfileScreen';
import { userStore } from '../../../src/store/userStore';
import { createMockUser } from '../../mocks/data';
import { createMockAuthService } from '../../mocks/services';

const renderEditProfileScreen = () => {
  return render(<EditProfileScreen />);
};

// Helper function to fill profile form
const fillProfileForm = (getByTestId: any, overrides = {}) => {
  const defaultData = {
    username: 'updateduser',
    email: 'updated@example.com',
    bio: 'Updated bio',
    image: 'https://example.com/updated-avatar.jpg',
    password: 'newpassword123',
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
  fireEvent.changeText(
    getByTestId(TEST_IDS.EDIT_PROFILE_PASSWORD_INPUT),
    defaultData.password
  );

  return defaultData;
};

describe('Edit Profile Screen Integration Tests', () => {
  const mockAuthService = createMockAuthService();

  beforeEach(() => {
    jest.clearAllMocks();
    userStore.setUser(
      createMockUser({
        bio: 'My bio',
        image: 'https://example.com/avatar.jpg',
      })
    );

    mockAuthService.updateUser.mockResolvedValue({
      user: createMockUser({
        bio: 'Updated bio',
        image: 'https://example.com/updated-avatar.jpg',
      }),
    });
  });

  describe('Screen Rendering Integration', () => {
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
      const user = createMockUser({
        username: 'testuser',
        email: 'test@example.com',
        bio: 'Test bio',
        image: 'https://example.com/test-avatar.jpg',
      });
      userStore.setUser(user);

      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        expect(
          getByTestId(TEST_IDS.EDIT_PROFILE_USERNAME_INPUT).props.value
        ).toBe(user.username);
        expect(getByTestId(TEST_IDS.EDIT_PROFILE_EMAIL_INPUT).props.value).toBe(
          user.email
        );
        expect(getByTestId(TEST_IDS.EDIT_PROFILE_BIO_INPUT).props.value).toBe(
          user.bio
        );
        expect(getByTestId(TEST_IDS.EDIT_PROFILE_IMAGE_INPUT).props.value).toBe(
          user.image
        );
      });
    });
  });

  describe('Form Input Integration', () => {
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

  describe('Profile Update Integration', () => {
    it('handles successful profile update', async () => {
      const setUserSpy = jest.spyOn(userStore, 'setUser');
      const { getByTestId } = renderEditProfileScreen();

      fillProfileForm(getByTestId, { bio: 'Updated bio' });

      await waitFor(() => {
        fireEvent.press(getByTestId(TEST_IDS.EDIT_PROFILE_UPDATE_BUTTON));
      });

      await waitFor(() => {
        expect(setUserSpy).toHaveBeenCalled();
      });
    });

    it('handles profile update with empty fields', async () => {
      const { getByTestId } = renderEditProfileScreen();

      fillProfileForm(getByTestId, { bio: '' });

      await waitFor(() => {
        fireEvent.press(getByTestId(TEST_IDS.EDIT_PROFILE_UPDATE_BUTTON));
      });

      expect(getByTestId(TEST_IDS.EDIT_PROFILE_SCREEN)).toBeTruthy();
    });

    it('handles profile update errors gracefully', async () => {
      mockAuthService.updateUser.mockRejectedValue(new Error('Network error'));
      const { getByTestId } = renderEditProfileScreen();

      fillProfileForm(getByTestId);

      await waitFor(() => {
        fireEvent.press(getByTestId(TEST_IDS.EDIT_PROFILE_UPDATE_BUTTON));
      });

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.EDIT_PROFILE_SCREEN)).toBeTruthy();
      });
    });
  });

  describe('Logout Integration', () => {
    it('handles logout button press', async () => {
      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        fireEvent.press(getByTestId(TEST_IDS.EDIT_PROFILE_LOGOUT_BUTTON));
      });

      expect(getByTestId(TEST_IDS.EDIT_PROFILE_SCREEN)).toBeTruthy();
    });
  });
});
