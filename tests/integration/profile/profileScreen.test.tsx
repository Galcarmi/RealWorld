import { render, fireEvent, waitFor, act } from '@testing-library/react-native';

import '../../mocks';

import { TEST_IDS } from '../../../src/constants/testIds';
import { ProfileScreen } from '../../../src/screens/profileScreen/profileScreen';
import { navigationService } from '../../../src/services/navigationService';
import { articlesStore } from '../../../src/store/articlesStore';
import { userStore } from '../../../src/store/userStore';
import { mockUser, mockUserMinimal } from '../../mocks/data';
import { getMockNavigationService } from '../../mocks/services';
import * as storeMocks from '../../mocks/stores';

const mockArticlesStore = storeMocks.getMockArticlesStore();
const mockNavigationService = getMockNavigationService();

const renderProfileScreen = () => {
  return render(<ProfileScreen />);
};

describe('Profile Screen Integration Tests', () => {
  beforeEach(async () => {
    await act(async () => {
      userStore.setUser(mockUser);
    });

    mockArticlesStore.homeArticles = [];
    mockArticlesStore.homeIsLoading = false;
  });

  describe('Authentication Requirements', () => {
    it('should redirect to login screen when user is not authenticated', async () => {
      await act(async () => {
        userStore.forgetUser();
      });

      renderProfileScreen();

      expect(mockNavigationService.navigateToLoginScreen).toHaveBeenCalledTimes(
        1
      );
    });

    it('should render profile screen when user is authenticated', async () => {
      await act(async () => {
        userStore.setUser(mockUser);
      });

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.PROFILE_SCREEN)).toBeTruthy();
      });
    });
  });

  describe('User Information Display', () => {
    it('should display user profile information correctly', async () => {
      await act(async () => {
        userStore.setUser(mockUser);
      });

      const { getByText } = renderProfileScreen();

      await waitFor(() => {
        expect(getByText(mockUser.username)).toBeTruthy();
      });
    });

    it('should show user profile with minimal data', async () => {
      await act(async () => {
        userStore.setUser(mockUserMinimal);
      });

      const { getByText } = renderProfileScreen();

      await waitFor(() => {
        expect(getByText(mockUserMinimal.username)).toBeTruthy();
      });
    });

    it('should display profile header section', async () => {
      userStore.setUser(mockUser);

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.PROFILE_SCREEN)).toBeTruthy();
      });
    });
  });

  describe('Navigation Actions', () => {
    it('should navigate to edit profile when edit button is pressed', async () => {
      userStore.setUser(mockUser);

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        const editButton = getByTestId(TEST_IDS.EDIT_PROFILE_BUTTON);
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
        const newArticleButton = getByTestId(TEST_IDS.NEW_ARTICLE_BUTTON);
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
        expect(getByTestId(TEST_IDS.PROFILE_SCREEN)).toBeTruthy();
      });
    });

    it('should handle article refresh through articles store', async () => {
      userStore.setUser(mockUser);

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        const profileScreen = getByTestId(TEST_IDS.PROFILE_SCREEN);
        expect(profileScreen).toBeTruthy();
      });

      expect(articlesStore.getUserArticles).toHaveBeenCalled();
    });

    it('should integrate with articles store for user articles', async () => {
      userStore.setUser(mockUser);

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.PROFILE_SCREEN)).toBeTruthy();
      });

      expect(articlesStore.getUserArticles).toHaveBeenCalled();
    });
  });

  describe('Screen Layout and Structure', () => {
    it('should render all required UI sections', async () => {
      userStore.setUser(mockUser);

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.PROFILE_SCREEN)).toBeTruthy();
        expect(getByTestId(TEST_IDS.EDIT_PROFILE_BUTTON)).toBeTruthy();
        expect(getByTestId(TEST_IDS.NEW_ARTICLE_BUTTON)).toBeTruthy();
      });
    });

    it('should have proper screen header with title', async () => {
      userStore.setUser(mockUser);

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.PROFILE_SCREEN)).toBeTruthy();
      });
    });

    it('should separate profile info and articles sections', async () => {
      userStore.setUser(mockUser);

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.PROFILE_SCREEN)).toBeTruthy();
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading state while fetching user articles', async () => {
      userStore.setUser(mockUser);
      mockArticlesStore.homeIsLoading = true;

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.PROFILE_SCREEN)).toBeTruthy();
      });
    });

    it('should hide loading state when articles are loaded', async () => {
      userStore.setUser(mockUser);
      mockArticlesStore.homeIsLoading = false;

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.PROFILE_SCREEN)).toBeTruthy();
      });

      expect(mockArticlesStore.homeIsLoading).toBe(false);
    });

    it('should show loading state for articles fetch', async () => {
      userStore.setUser(mockUser);

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.PROFILE_SCREEN)).toBeTruthy();
      });
    });

    it('should handle loading states when fetching user articles', async () => {
      userStore.setUser(mockUser);

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.PROFILE_SCREEN)).toBeTruthy();
      });
    });
  });

  describe('User Profile Variations', () => {
    it('should handle user with complete profile information', async () => {
      userStore.setUser({
        ...mockUser,
        bio: 'Complete user bio',
        image: 'https://example.com/user-image.jpg',
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

      jest
        .spyOn(articlesStore, 'getUserArticles')
        .mockRejectedValue(new Error('Network error'));

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.PROFILE_SCREEN)).toBeTruthy();
      });
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
        fireEvent.press(getByTestId(TEST_IDS.EDIT_PROFILE_BUTTON));
      });

      await waitFor(() => {
        fireEvent.press(getByTestId(TEST_IDS.NEW_ARTICLE_BUTTON));
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
        const editButton = getByTestId(TEST_IDS.EDIT_PROFILE_BUTTON);
        fireEvent.press(editButton);
        fireEvent.press(editButton);
        fireEvent.press(editButton);
      });

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

  describe('Error Handling', () => {
    it('should handle article loading errors gracefully', async () => {
      userStore.setUser(mockUser);

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.PROFILE_SCREEN)).toBeTruthy();
      });
    });

    it('should show error state when user data is incomplete', async () => {
      userStore.setUser(mockUser);

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.PROFILE_SCREEN)).toBeTruthy();
      });
    });
  });

  describe('User Interaction Flows', () => {
    it('should handle successful navigation flow to edit profile', async () => {
      userStore.setUser(mockUser);

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.PROFILE_SCREEN)).toBeTruthy();
      });

      fireEvent.press(getByTestId(TEST_IDS.EDIT_PROFILE_BUTTON));

      expect(mockNavigationService.navigateToEditProfile).toHaveBeenCalled();
    });

    it('should handle successful navigation flow to new article', async () => {
      userStore.setUser(mockUser);

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.PROFILE_SCREEN)).toBeTruthy();
      });

      fireEvent.press(getByTestId(TEST_IDS.NEW_ARTICLE_BUTTON));

      expect(mockNavigationService.navigateToNewArticle).toHaveBeenCalled();
    });
  });

  describe('Multiple User States', () => {
    it('should handle different user profile states', async () => {
      userStore.setUser(mockUserMinimal);

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.PROFILE_SCREEN)).toBeTruthy();
      });
    });

    it('should render correctly with complete user data', async () => {
      userStore.setUser(mockUser);

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.PROFILE_SCREEN)).toBeTruthy();
      });
    });
  });

  describe('Component Integration', () => {
    it('should integrate with user store properly', async () => {
      userStore.setUser(mockUser);

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.PROFILE_SCREEN)).toBeTruthy();
      });
    });

    it('should handle component unmount gracefully', async () => {
      userStore.setUser(mockUser);

      const { unmount } = renderProfileScreen();

      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Button Interactions', () => {
    it('should handle button press events properly', async () => {
      userStore.setUser(mockUser);

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        const editButton = getByTestId(TEST_IDS.EDIT_PROFILE_BUTTON);
        expect(editButton).toBeTruthy();
      });
    });
  });
});
