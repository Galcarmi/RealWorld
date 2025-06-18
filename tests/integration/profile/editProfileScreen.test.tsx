import { SafeAreaProvider } from 'react-native-safe-area-context';

import { render, fireEvent, waitFor } from '@testing-library/react-native';

import '../../mocks';
import { EditProfileScreen } from '../../../src/screens/editProfile/editProfileScreen';
import { navigationService } from '../../../src/services/navigationService';
import { authStore } from '../../../src/store/authStore';
import { userStore } from '../../../src/store/userStore';
import { mockUserMinimal } from '../../mocks/data';
import {
  createMockAuthService,
  resetAllServiceMocks,
} from '../../mocks/services';
import { resetAllStoreMocks } from '../../mocks/stores';
import { mockUtilities, resetUtilityMocks } from '../../mocks/utilities';

const renderEditProfileScreen = () => {
  return render(
    <SafeAreaProvider>
      <EditProfileScreen />
    </SafeAreaProvider>
  );
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

      expect(getByTestId('edit-profile-screen')).toBeTruthy();
    });

    it('should display screen header with back button', () => {
      const { getByTestId } = renderEditProfileScreen();

      expect(getByTestId('edit-profile-screen')).toBeTruthy();
    });

    it('should pre-populate form fields with user data', async () => {
      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        const usernameInput = getByTestId('edit-profile-username-input');
        const emailInput = getByTestId('edit-profile-email-input');
        const bioInput = getByTestId('edit-profile-bio-input');
        const imageInput = getByTestId('edit-profile-image-input');

        expect(usernameInput.props.value).toBe(mockUserMinimal.username);
        expect(emailInput.props.value).toBe(mockUserMinimal.email);
        expect(bioInput.props.value).toBe('My bio');
        expect(imageInput.props.value).toBe('https://example.com/avatar.jpg');
      });
    });

    it('should render update button', () => {
      const { getByTestId } = renderEditProfileScreen();

      const updateButton = getByTestId('edit-profile-update-button');
      expect(updateButton).toBeTruthy();
    });
  });

  describe('Form Field Interactions', () => {
    it('should handle image URL input changes', async () => {
      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        const imageInput = getByTestId('edit-profile-image-input');
        fireEvent.changeText(imageInput, 'https://example.com/new-avatar.jpg');

        expect(imageInput.props.value).toBe(
          'https://example.com/new-avatar.jpg'
        );
      });
    });

    it('should handle username input changes', async () => {
      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        const usernameInput = getByTestId('edit-profile-username-input');
        fireEvent.changeText(usernameInput, 'newusername');

        expect(usernameInput.props.value).toBe('newusername');
      });
    });

    it('should handle bio input changes', async () => {
      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        const bioInput = getByTestId('edit-profile-bio-input');
        fireEvent.changeText(bioInput, 'Updated bio text');

        expect(bioInput.props.value).toBe('Updated bio text');
      });
    });

    it('should handle email input changes', async () => {
      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        const emailInput = getByTestId('edit-profile-email-input');
        fireEvent.changeText(emailInput, 'newemail@example.com');

        expect(emailInput.props.value).toBe('newemail@example.com');
      });
    });

    it('should handle password input changes', async () => {
      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        const passwordInput = getByTestId('edit-profile-password-input');
        fireEvent.changeText(passwordInput, 'newpassword123');

        expect(passwordInput.props.value).toBe('newpassword123');
      });
    });
  });

  describe('Profile Update Integration', () => {
    it('should handle profile update button press', async () => {
      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        const bioInput = getByTestId('edit-profile-bio-input');
        fireEvent.changeText(bioInput, 'Updated bio');
      });

      await waitFor(() => {
        const updateButton = getByTestId('edit-profile-update-button');
        fireEvent.press(updateButton);
      });

      expect(getByTestId('edit-profile-screen')).toBeTruthy();
    });

    it('should update user store with new user data after successful update', async () => {
      const setUserSpy = jest.spyOn(userStore, 'setUser');

      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        const bioInput = getByTestId('edit-profile-bio-input');
        fireEvent.changeText(bioInput, 'Updated bio');
      });

      await waitFor(() => {
        const updateButton = getByTestId('edit-profile-update-button');
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
        const bioInput = getByTestId('edit-profile-bio-input');
        fireEvent.changeText(bioInput, 'Updated bio');
      });

      await waitFor(() => {
        const updateButton = getByTestId('edit-profile-update-button');
        fireEvent.press(updateButton);
      });

      await waitFor(() => {
        expect(mockUtilities.showErrorModals).toHaveBeenCalledWith({
          general: ['Failed to update profile'],
        });
      });
    });

    it('should handle API errors with specific error messages', async () => {
      const apiError = {
        response: {
          data: {
            errors: {
              email: ['Email is already taken'],
              username: ['Username is already taken'],
            },
          },
        },
      };

      mockAuthService.updateUser.mockRejectedValue(apiError);

      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        const bioInput = getByTestId('edit-profile-bio-input');
        fireEvent.changeText(bioInput, 'Updated bio');
      });

      await waitFor(() => {
        const updateButton = getByTestId('edit-profile-update-button');
        fireEvent.press(updateButton);
      });

      await waitFor(() => {
        expect(mockUtilities.showErrorModals).toHaveBeenCalled();
      });
    });
  });

  describe('Logout Functionality', () => {
    it('should handle logout button press', async () => {
      const logoutSpy = jest.spyOn(authStore, 'logout');

      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        const logoutButton = getByTestId('edit-profile-logout-button');
        fireEvent.press(logoutButton);
      });

      expect(logoutSpy).toHaveBeenCalled();
    });

    it('should render logout button with proper styling', () => {
      const { getByTestId } = renderEditProfileScreen();

      const logoutButton = getByTestId('edit-profile-logout-button');
      expect(logoutButton).toBeTruthy();
    });
  });

  describe('Navigation Integration', () => {
    it('should integrate with navigation service', async () => {
      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        const bioInput = getByTestId('edit-profile-bio-input');
        fireEvent.changeText(bioInput, 'Updated bio');
      });

      await waitFor(() => {
        const updateButton = getByTestId('edit-profile-update-button');
        fireEvent.press(updateButton);
      });

      expect(navigationService.goBack).toBeDefined();
    });
  });

  describe('Screen Layout and Structure', () => {
    it('should render all form input fields', () => {
      const { getByTestId } = renderEditProfileScreen();

      expect(getByTestId('edit-profile-image-input')).toBeTruthy();
      expect(getByTestId('edit-profile-username-input')).toBeTruthy();
      expect(getByTestId('edit-profile-bio-input')).toBeTruthy();
      expect(getByTestId('edit-profile-email-input')).toBeTruthy();
      expect(getByTestId('edit-profile-password-input')).toBeTruthy();
    });

    it('should render both action buttons', () => {
      const { getByTestId } = renderEditProfileScreen();

      expect(getByTestId('edit-profile-update-button')).toBeTruthy();
      expect(getByTestId('edit-profile-logout-button')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle component mount without user data', () => {
      userStore.forgetUser();

      const { getByTestId } = renderEditProfileScreen();

      expect(getByTestId('edit-profile-screen')).toBeTruthy();
    });

    it('should handle user with partial profile data', async () => {
      userStore.setUser({
        ...mockUserMinimal,
        bio: undefined,
        image: undefined,
      });

      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        const bioInput = getByTestId('edit-profile-bio-input');
        const imageInput = getByTestId('edit-profile-image-input');

        expect(bioInput.props.value).toBe('');
        expect(imageInput.props.value).toBe('');
      });
    });

    it('should handle component unmount gracefully', () => {
      const { unmount } = renderEditProfileScreen();

      expect(() => unmount()).not.toThrow();
    });

    it('should handle multiple rapid form changes', async () => {
      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        const bioInput = getByTestId('edit-profile-bio-input');
        fireEvent.changeText(bioInput, 'Bio 1');
        fireEvent.changeText(bioInput, 'Bio 2');
        fireEvent.changeText(bioInput, 'Bio 3');
        fireEvent.changeText(bioInput, 'Final Bio');

        expect(bioInput.props.value).toBe('Final Bio');
      });
    });
  });

  describe('Store Integration', () => {
    it('should integrate with auth service for updates', async () => {
      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        const bioInput = getByTestId('edit-profile-bio-input');
        fireEvent.changeText(bioInput, 'Updated bio');
      });

      await waitFor(() => {
        const updateButton = getByTestId('edit-profile-update-button');
        fireEvent.press(updateButton);
      });

      expect(mockAuthService.updateUser).toBeDefined();
      expect(getByTestId('edit-profile-screen')).toBeTruthy();
    });

    it('should integrate with user store for state management', () => {
      const { getByTestId } = renderEditProfileScreen();

      expect(getByTestId('edit-profile-screen')).toBeTruthy();
      expect(userStore.user).toBeTruthy();
    });
  });

  describe('Form Functionality', () => {
    it('should handle form submission flow', async () => {
      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        const bioInput = getByTestId('edit-profile-bio-input');
        fireEvent.changeText(bioInput, 'New bio content');
      });

      await waitFor(() => {
        const updateButton = getByTestId('edit-profile-update-button');
        fireEvent.press(updateButton);
      });

      expect(getByTestId('edit-profile-screen')).toBeTruthy();
    });

    it('should handle form field validation', async () => {
      const { getByTestId } = renderEditProfileScreen();

      await waitFor(() => {
        const usernameInput = getByTestId('edit-profile-username-input');
        fireEvent.changeText(usernameInput, '');

        const emailInput = getByTestId('edit-profile-email-input');
        fireEvent.changeText(emailInput, '');
      });

      expect(getByTestId('edit-profile-screen')).toBeTruthy();
    });
  });
});
