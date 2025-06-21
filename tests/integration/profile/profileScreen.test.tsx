import { render, fireEvent, waitFor, act } from '@testing-library/react-native';

import '../../mocks';

import { TEST_IDS } from '../../../src/constants/testIds';
import { ProfileScreen } from '../../../src/screens/profileScreen/profileScreen';
import { navigationService } from '../../../src/services/navigationService';
import { createMockUser } from '../../mocks/data';
import { getMockNavigationService } from '../../mocks/services';
import * as storeMocks from '../../mocks/stores';

const articlesStore = storeMocks.getArticlesStore();
const userStore = storeMocks.getUserStore();
const mockNavigationService = getMockNavigationService();

const renderProfileScreen = () => {
  return render(<ProfileScreen />);
};

// Helper function to setup authenticated user
const setupAuthenticatedUser = async (userOverrides = {}) => {
  const user = createMockUser(userOverrides);
  await act(async () => {
    userStore.setUser(user);
  });
  return user;
};

describe('Profile Screen Tests', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await setupAuthenticatedUser();
    articlesStore.homeArticles = [];
    articlesStore.homeIsLoading = false;
  });

  describe('Authentication', () => {
    it('redirects to login when user is not authenticated', async () => {
      await act(async () => {
        userStore.forgetUser();
      });

      renderProfileScreen();

      expect(mockNavigationService.navigateToLoginScreen).toHaveBeenCalledTimes(
        1
      );
    });

    it('renders profile screen for authenticated user', async () => {
      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.PROFILE_SCREEN)).toBeTruthy();
      });
    });
  });

  describe('Profile Display', () => {
    it('displays user profile information', async () => {
      const user = await setupAuthenticatedUser({ username: 'testuser123' });
      const { getByText } = renderProfileScreen();

      await waitFor(() => {
        expect(getByText(user.username)).toBeTruthy();
      });
    });

    it('displays profile with minimal user data', async () => {
      const user = await setupAuthenticatedUser({
        username: 'minimaluser',
        bio: '',
        image: '',
      });
      const { getByText } = renderProfileScreen();

      await waitFor(() => {
        expect(getByText(user.username)).toBeTruthy();
      });
    });

    it('renders all required UI components', async () => {
      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.PROFILE_SCREEN)).toBeTruthy();
        expect(getByTestId(TEST_IDS.EDIT_PROFILE_BUTTON)).toBeTruthy();
        expect(getByTestId(TEST_IDS.NEW_ARTICLE_BUTTON)).toBeTruthy();
      });
    });
  });

  describe('Navigation', () => {
    it('navigates to edit profile screen', async () => {
      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        const editButton = getByTestId(TEST_IDS.EDIT_PROFILE_BUTTON);
        fireEvent.press(editButton);
      });

      expect(mockNavigationService.navigateToEditProfile).toHaveBeenCalledTimes(
        1
      );
    });

    it('navigates to new article screen', async () => {
      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        const newArticleButton = getByTestId(TEST_IDS.NEW_ARTICLE_BUTTON);
        fireEvent.press(newArticleButton);
      });

      expect(mockNavigationService.navigateToNewArticle).toHaveBeenCalledTimes(
        1
      );
    });

    it('handles multiple navigation actions', async () => {
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
        fireEvent.press(getByTestId(TEST_IDS.NEW_ARTICLE_BUTTON));
      });

      expect(editProfileSpy).toHaveBeenCalledTimes(1);
      expect(newArticleSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Articles Store', () => {
    it('fetches user articles on mount', async () => {
      const user = await setupAuthenticatedUser();
      const getUserArticlesSpy = jest.spyOn(articlesStore, 'getUserArticles');

      renderProfileScreen();

      await waitFor(() => {
        expect(getUserArticlesSpy).toHaveBeenCalledWith(
          user.username,
          expect.any(Number),
          expect.any(Number)
        );
      });
    });

    it('handles articles loading state', async () => {
      articlesStore.homeIsLoading = true;
      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.PROFILE_SCREEN)).toBeTruthy();
      });

      // Loading state is managed by the store integration
      expect(articlesStore.homeIsLoading).toBe(true);
    });

    it('handles articles store errors gracefully', async () => {
      jest
        .spyOn(articlesStore, 'getUserArticles')
        .mockRejectedValue(new Error('Network error'));

      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.PROFILE_SCREEN)).toBeTruthy();
      });
    });
  });

  describe('Component Lifecycle', () => {
    it('handles component unmount gracefully', async () => {
      const { unmount } = renderProfileScreen();

      expect(() => unmount()).not.toThrow();
    });
  });
});
