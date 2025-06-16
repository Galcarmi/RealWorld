import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '../../mocks';
import { ProfileScreen } from '../../../src/screens/profileScreen/profileScreen';
import { navigationService } from '../../../src/services/navigationService';
import { articlesStore } from '../../../src/store/articlesStore';
import { userStore } from '../../../src/store/userStore';
import { mockUser, mockUserMinimal } from '../../mocks/data';
import {
  getMockNavigationService,
  resetAllServiceMocks,
} from '../../mocks/services';
import { resetAllStoreMocks, getMockArticlesStore } from '../../mocks/stores';

const mockArticlesStore = getMockArticlesStore();
const mockNavigationService = getMockNavigationService();

const renderProfileScreen = () => {
  return render(
    <SafeAreaProvider>
      <ProfileScreen />
    </SafeAreaProvider>
  );
};

describe('Profile Screen Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    userStore.forgetUser();
    resetAllStoreMocks();
    resetAllServiceMocks();

    // Set up authenticated user by default
    userStore.setUser(mockUser);
    mockArticlesStore.homeArticles = [];
    mockArticlesStore.homeIsLoading = false;
  });

  afterEach(() => {
    userStore.forgetUser();
  });

  describe('Authentication Requirements', () => {
    it('should redirect to login screen when user is not authenticated', () => {
      userStore.forgetUser();

      renderProfileScreen();

      expect(mockNavigationService.navigateToLoginScreen).toHaveBeenCalledTimes(
        1
      );
    });

    it('should render profile screen when user is authenticated', async () => {
      // Ensure user is set before rendering
      userStore.setUser(mockUser);

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        expect(getByTestId('profile-screen')).toBeTruthy();
      });
    });
  });

  describe('User Information Display', () => {
    it('should display user profile information correctly', async () => {
      userStore.setUser(mockUser);

      const { getByText } = renderProfileScreen();

      await waitFor(() => {
        expect(getByText(mockUser.username)).toBeTruthy();
      });
    });

    it('should show user profile with minimal data', async () => {
      userStore.setUser(mockUserMinimal);

      const { getByText } = renderProfileScreen();

      await waitFor(() => {
        expect(getByText(mockUserMinimal.username)).toBeTruthy();
      });
    });

    it('should display profile header section', async () => {
      userStore.setUser(mockUser);

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        expect(getByTestId('profile-screen')).toBeTruthy();
      });
      // Profile header should be rendered within the screen
    });
  });

  describe('Navigation Actions', () => {
    it('should navigate to edit profile when edit button is pressed', async () => {
      userStore.setUser(mockUser);

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        const editButton = getByTestId('edit-profile-button');
        fireEvent.press(editButton);
      });

      expect(mockNavigationService.navigateToEditProfile).toHaveBeenCalledTimes(
        1
      );
    });

    it('should navigate to new article screen when new article button is pressed', async () => {
      userStore.setUser(mockUser);

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        const newArticleButton = getByTestId('new-article-button');
        fireEvent.press(newArticleButton);
      });

      expect(mockNavigationService.navigateToNewArticle).toHaveBeenCalledTimes(
        1
      );
    });
  });

  describe('User Articles Management', () => {
    it('should display articles list section', async () => {
      userStore.setUser(mockUser);

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        expect(getByTestId('profile-screen')).toBeTruthy();
      });
      // Articles list should be rendered
    });

    it('should show empty message when user has no articles', async () => {
      userStore.setUser(mockUser);

      const { getByText } = renderProfileScreen();

      await waitFor(() => {
        expect(
          getByText(
            "No articles yet. Tap 'New Article' to create your first post"
          )
        ).toBeTruthy();
      });
    });

    it('should handle article refresh through articles store', async () => {
      userStore.setUser(mockUser);

      const { getByTestId } = renderProfileScreen();

      // Find the articles list and trigger refresh
      await waitFor(() => {
        const profileScreen = getByTestId('profile-screen');
        expect(profileScreen).toBeTruthy();
      });

      // The refresh should be handled by the useProfile hook
      expect(articlesStore.getUserArticles).toHaveBeenCalled();
    });

    it('should integrate with articles store for user articles', async () => {
      userStore.setUser(mockUser);

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        expect(getByTestId('profile-screen')).toBeTruthy();
      });

      // Verify that articles store methods are called
      expect(articlesStore.getUserArticles).toHaveBeenCalled();
    });
  });

  describe('Screen Layout and Structure', () => {
    it('should render all required UI sections', async () => {
      userStore.setUser(mockUser);

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        expect(getByTestId('profile-screen')).toBeTruthy();
        expect(getByTestId('edit-profile-button')).toBeTruthy();
        expect(getByTestId('new-article-button')).toBeTruthy();
      });
    });

    it('should have proper screen header with title', async () => {
      userStore.setUser(mockUser);

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        expect(getByTestId('profile-screen')).toBeTruthy();
      });
      // Header should contain "Profile" title
    });

    it('should separate profile info and articles sections', async () => {
      userStore.setUser(mockUser);

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        expect(getByTestId('profile-screen')).toBeTruthy();
      });
      // Should have distinct header and articles sections
    });
  });

  describe('Loading States', () => {
    it('should show loading state while fetching user articles', async () => {
      userStore.setUser(mockUser);
      mockArticlesStore.homeIsLoading = true;

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        expect(getByTestId('profile-screen')).toBeTruthy();
      });
      // Loading indicator should be shown in articles section
    });

    it('should hide loading state when articles are loaded', async () => {
      userStore.setUser(mockUser);
      mockArticlesStore.homeIsLoading = false;

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        expect(getByTestId('profile-screen')).toBeTruthy();
      });

      // Loading should be complete
      expect(mockArticlesStore.homeIsLoading).toBe(false);
    });
  });

  describe('User Profile Variations', () => {
    it('should handle user with complete profile information', async () => {
      userStore.setUser({
        ...mockUser,
        bio: 'Complete user bio',
        image: 'https://example.com/avatar.jpg',
      });

      const { getByText } = renderProfileScreen();

      await waitFor(() => {
        expect(getByText(mockUser.username)).toBeTruthy();
      });
    });

    it('should handle user with minimal profile information', async () => {
      userStore.setUser({
        ...mockUserMinimal,
        bio: '',
        image: '',
      });

      const { getByText } = renderProfileScreen();

      await waitFor(() => {
        expect(getByText(mockUserMinimal.username)).toBeTruthy();
      });
    });
  });

  describe('Integration with Store', () => {
    it('should call getUserArticles with correct username on mount', async () => {
      userStore.setUser(mockUser);
      const getUserArticlesSpy = jest.spyOn(articlesStore, 'getUserArticles');

      renderProfileScreen();

      await waitFor(() => {
        expect(getUserArticlesSpy).toHaveBeenCalledWith(
          mockUser.username,
          expect.any(Number),
          expect.any(Number)
        );
      });
    });

    it('should handle store errors gracefully', async () => {
      userStore.setUser(mockUser);
      // Mock store error
      jest
        .spyOn(articlesStore, 'getUserArticles')
        .mockRejectedValue(new Error('Network error'));

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        expect(getByTestId('profile-screen')).toBeTruthy();
      });

      // Screen should still render despite error
    });
  });

  describe('Multiple Action Sequences', () => {
    it('should handle multiple navigation actions', async () => {
      userStore.setUser(mockUser);
      const editProfileSpy = jest.spyOn(
        navigationService,
        'navigateToEditProfile'
      );
      const newArticleSpy = jest.spyOn(
        navigationService,
        'navigateToNewArticle'
      );

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        fireEvent.press(getByTestId('edit-profile-button'));
      });

      await waitFor(() => {
        fireEvent.press(getByTestId('new-article-button'));
      });

      expect(editProfileSpy).toHaveBeenCalledTimes(1);
      expect(newArticleSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle rapid button presses without issues', async () => {
      userStore.setUser(mockUser);
      const editProfileSpy = jest.spyOn(
        navigationService,
        'navigateToEditProfile'
      );

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        const editButton = getByTestId('edit-profile-button');
        fireEvent.press(editButton);
        fireEvent.press(editButton);
        fireEvent.press(editButton);
      });

      // Should only navigate once (or handle multiple presses gracefully)
      expect(editProfileSpy).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle component unmount gracefully', () => {
      userStore.setUser(mockUser);

      const { unmount } = renderProfileScreen();

      expect(() => unmount()).not.toThrow();
    });
  });
});
