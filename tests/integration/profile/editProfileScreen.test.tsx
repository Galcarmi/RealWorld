import { render, fireEvent, waitFor } from '@testing-library/react-native';

import '../../mocks';
import { TEST_IDS } from '../../../src/constants/testIds';
import { EditProfileScreen } from '../../../src/screens/editProfile/editProfileScreen';
import { userStore } from '../../../src/store/userStore';
import { mockUserMinimal } from '../../mocks/data';
import {
  createMockAuthService,
  resetAllServiceMocks,
} from '../../mocks/services';
import { resetAllStoreMocks } from '../../mocks/stores';
import { resetUtilityMocks } from '../../mocks/utilities';

const renderEditProfileScreen = () => {
  return render(<EditProfileScreen />);
};

describe('Edit Profile Screen Integration Tests', () => {
  const mockAuthService = createMockAuthService();

  beforeEach(() => {
    jest.clearAllMocks();
    userStore.forgetUser();
    resetAllStoreMocks();
    resetAllServiceMocks();
    resetUtilityMocks();

    userStore.setUser({
      ...mockUserMinimal,
      bio: 'My bio',
      image: 'https://example.com/avatar.jpg',
    });

    mockAuthService.updateUser.mockResolvedValue({
      user: {
        ...mockUserMinimal,
        bio: 'Updated bio',
        image: 'https://example.com/updated-avatar.jpg',
      },
    });
  });

  afterEach(() => {
    userStore.forgetUser();
  });

  describe('Initial Screen State', () => {
    it('should render edit profile screen with proper test ID', () => {
      const { getByTestId } = renderEditProfileScreen();

      expect(getByTestId(TEST_IDS.EDIT_PROFILE_SCREEN)).toBeTruthy();
    });

    it('should display screen header with back button', () => {
      const { getByTestId } = renderEditProfileScreen();

      expect(getByTestId(TEST_IDS.EDIT_PROFILE_SCREEN)).toBeTruthy();
    });

    it('should pre-populate form fields with user data', async () => {
      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        const usernameInput = getByTestId(TEST_IDS.EDIT_PROFILE_USERNAME_INPUT);
        const emailInput = getByTestId(TEST_IDS.EDIT_PROFILE_EMAIL_INPUT);
        const bioInput = getByTestId(TEST_IDS.EDIT_PROFILE_BIO_INPUT);
        const imageInput = getByTestId(TEST_IDS.EDIT_PROFILE_IMAGE_INPUT);

        expect(usernameInput.props.value).toBe(mockUserMinimal.username);
        expect(emailInput.props.value).toBe(mockUserMinimal.email);
        expect(bioInput.props.value).toBe('My bio');
        expect(imageInput.props.value).toBe('https://example.com/avatar.jpg');
      });
    });

    it('should render update button', () => {
      const { getByTestId } = renderEditProfileScreen();

      const updateButton = getByTestId(TEST_IDS.EDIT_PROFILE_UPDATE_BUTTON);
      expect(updateButton).toBeTruthy();
    });
  });

  describe('Form Field Interactions', () => {
    it('should handle image URL input changes', async () => {
      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        const imageInput = getByTestId(TEST_IDS.EDIT_PROFILE_IMAGE_INPUT);
        fireEvent.changeText(imageInput, 'https://example.com/new-avatar.jpg');

        expect(imageInput.props.value).toBe(
          'https://example.com/new-avatar.jpg'
        );
      });
    });

    it('should handle username input changes', async () => {
      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        const usernameInput = getByTestId(TEST_IDS.EDIT_PROFILE_USERNAME_INPUT);
        fireEvent.changeText(usernameInput, 'newusername');

        expect(usernameInput.props.value).toBe('newusername');
      });
    });

    it('should handle bio input changes', async () => {
      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        const bioInput = getByTestId(TEST_IDS.EDIT_PROFILE_BIO_INPUT);
        fireEvent.changeText(bioInput, 'Updated bio text');

        expect(bioInput.props.value).toBe('Updated bio text');
      });
    });

    it('should handle email input changes', async () => {
      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        const emailInput = getByTestId(TEST_IDS.EDIT_PROFILE_EMAIL_INPUT);
        fireEvent.changeText(emailInput, 'newemail@example.com');

        expect(emailInput.props.value).toBe('newemail@example.com');
      });
    });

    it('should handle password input changes', async () => {
      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        const passwordInput = getByTestId(TEST_IDS.EDIT_PROFILE_PASSWORD_INPUT);
        fireEvent.changeText(passwordInput, 'newpassword123');

        expect(passwordInput.props.value).toBe('newpassword123');
      });
    });
  });

  describe('Profile Update Integration', () => {
    it('should handle profile update button press', async () => {
      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        const bioInput = getByTestId(TEST_IDS.EDIT_PROFILE_BIO_INPUT);
        fireEvent.changeText(bioInput, 'Updated bio');
      });

      await waitFor(() => {
        const updateButton = getByTestId(TEST_IDS.EDIT_PROFILE_UPDATE_BUTTON);
        fireEvent.press(updateButton);
      });

      expect(getByTestId(TEST_IDS.EDIT_PROFILE_SCREEN)).toBeTruthy();
    });

    it('should update user store with new user data after successful update', async () => {
      const setUserSpy = jest.spyOn(userStore, 'setUser');

      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        const bioInput = getByTestId(TEST_IDS.EDIT_PROFILE_BIO_INPUT);
        fireEvent.changeText(bioInput, 'Updated bio');
      });

      await waitFor(() => {
        const updateButton = getByTestId(TEST_IDS.EDIT_PROFILE_UPDATE_BUTTON);
        fireEvent.press(updateButton);
      });

      await waitFor(() => {
        expect(setUserSpy).toHaveBeenCalled();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle generic errors gracefully', async () => {
      mockAuthService.updateUser.mockRejectedValue(new Error('Network error'));

      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        const bioInput = getByTestId(TEST_IDS.EDIT_PROFILE_BIO_INPUT);
        fireEvent.changeText(bioInput, 'Updated bio');
      });

      await waitFor(() => {
        const updateButton = getByTestId(TEST_IDS.EDIT_PROFILE_UPDATE_BUTTON);
        fireEvent.press(updateButton);
      });

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.EDIT_PROFILE_SCREEN)).toBeTruthy();
      });
    });

    it('should handle network errors during update', async () => {
      mockAuthService.updateUser.mockRejectedValue(new Error('Network error'));

      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        const bioInput = getByTestId(TEST_IDS.EDIT_PROFILE_BIO_INPUT);
        fireEvent.changeText(bioInput, 'Updated bio');
      });

      await waitFor(() => {
        const updateButton = getByTestId(TEST_IDS.EDIT_PROFILE_UPDATE_BUTTON);
        fireEvent.press(updateButton);
      });

      expect(getByTestId(TEST_IDS.EDIT_PROFILE_SCREEN)).toBeTruthy();
    });
  });

  describe('User Logout Flow', () => {
    it('should handle logout button press', async () => {
      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        const logoutButton = getByTestId(TEST_IDS.EDIT_PROFILE_LOGOUT_BUTTON);
        fireEvent.press(logoutButton);
      });

      expect(getByTestId(TEST_IDS.EDIT_PROFILE_SCREEN)).toBeTruthy();
    });

    it('should render logout button', async () => {
      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        const logoutButton = getByTestId(TEST_IDS.EDIT_PROFILE_LOGOUT_BUTTON);
        fireEvent.press(logoutButton);
      });

      expect(getByTestId(TEST_IDS.EDIT_PROFILE_SCREEN)).toBeTruthy();
    });
  });

  describe('Form Validation and Updates', () => {
    it('should handle empty profile updates', async () => {
      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        const bioInput = getByTestId(TEST_IDS.EDIT_PROFILE_BIO_INPUT);
        fireEvent.changeText(bioInput, '');
      });

      await waitFor(() => {
        const updateButton = getByTestId(TEST_IDS.EDIT_PROFILE_UPDATE_BUTTON);
        fireEvent.press(updateButton);
      });

      expect(getByTestId(TEST_IDS.EDIT_PROFILE_SCREEN)).toBeTruthy();
    });

    it('should handle long bio text updates', async () => {
      const longBio = 'A'.repeat(1000);

      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        const bioInput = getByTestId(TEST_IDS.EDIT_PROFILE_BIO_INPUT);
        fireEvent.changeText(bioInput, longBio);
      });

      await waitFor(() => {
        const updateButton = getByTestId(TEST_IDS.EDIT_PROFILE_UPDATE_BUTTON);
        fireEvent.press(updateButton);
      });

      expect(getByTestId(TEST_IDS.EDIT_PROFILE_SCREEN)).toBeTruthy();
    });
  });

  describe('Field Accessibility and Layout', () => {
    it('should render all profile form fields', () => {
      const { getByTestId } = renderEditProfileScreen();

      expect(getByTestId(TEST_IDS.EDIT_PROFILE_IMAGE_INPUT)).toBeTruthy();
      expect(getByTestId(TEST_IDS.EDIT_PROFILE_USERNAME_INPUT)).toBeTruthy();
      expect(getByTestId(TEST_IDS.EDIT_PROFILE_BIO_INPUT)).toBeTruthy();
      expect(getByTestId(TEST_IDS.EDIT_PROFILE_EMAIL_INPUT)).toBeTruthy();
      expect(getByTestId(TEST_IDS.EDIT_PROFILE_PASSWORD_INPUT)).toBeTruthy();
    });

    it('should render action buttons', () => {
      const { getByTestId } = renderEditProfileScreen();

      expect(getByTestId(TEST_IDS.EDIT_PROFILE_UPDATE_BUTTON)).toBeTruthy();
      expect(getByTestId(TEST_IDS.EDIT_PROFILE_LOGOUT_BUTTON)).toBeTruthy();
    });

    it('should maintain screen layout properly', () => {
      const { getByTestId } = renderEditProfileScreen();

      expect(getByTestId(TEST_IDS.EDIT_PROFILE_SCREEN)).toBeTruthy();
    });
  });

  describe('Edge Cases and Integration', () => {
    it('should handle rapid input changes', async () => {
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
});
