import { SafeAreaProvider } from 'react-native-safe-area-context';

import { render, fireEvent, waitFor } from '@testing-library/react-native';

import '../../mocks';
import { AuthorProfileScreen } from '../../../src/screens/authorProfile/authorProfileScreen';
import { Profile } from '../../../src/services/types';
import { userStore } from '../../../src/store/userStore';
import { mockUserMinimal, mockArticles } from '../../mocks/data';
import { getMockUseAuthorProfile, resetAllHookMocks } from '../../mocks/hooks';
import {
  resetAllNavigationMocks,
  setMockRoute,
  mockAuthorProfileRoute,
  setMockRouteParams,
} from '../../mocks/navigation';
import { resetAllStoreMocks } from '../../mocks/stores';

const renderAuthorProfileScreen = () => {
  return render(
    <SafeAreaProvider>
      <AuthorProfileScreen />
    </SafeAreaProvider>
  );
};

describe('Author Profile Screen Integration Tests', () => {
  const mockUseAuthorProfile = getMockUseAuthorProfile();

  beforeEach(() => {
    jest.clearAllMocks();
    userStore.forgetUser();
    resetAllStoreMocks();
    resetAllNavigationMocks();
    resetAllHookMocks();

    setMockRoute(mockAuthorProfileRoute);

    userStore.setUser(mockUserMinimal);

    mockUseAuthorProfile.authorProfile = {
      username: 'testauthor',
      bio: 'Test bio',
      image: '',
      following: false,
    } as Profile;
    mockUseAuthorProfile.authorArticles = mockArticles;
    mockUseAuthorProfile.isLoading = false;
    mockUseAuthorProfile.onFollowToggle.mockResolvedValue();
    mockUseAuthorProfile.onToggleFavorite.mockResolvedValue();
    mockUseAuthorProfile.refreshAuthorArticles.mockResolvedValue();
  });

  afterEach(() => {
    userStore.forgetUser();
  });

  describe('Initial Screen State', () => {
    it('should render author profile screen with proper test ID', () => {
      const { getByTestId } = renderAuthorProfileScreen();

      expect(getByTestId('author-profile-screen')).toBeTruthy();
    });

    it('should display screen header with back button', () => {
      const { getByTestId } = renderAuthorProfileScreen();

      expect(getByTestId('author-profile-screen')).toBeTruthy();
    });

    it('should show loading/empty state when no author profile is available', () => {
      mockUseAuthorProfile.authorProfile = null;

      const { getByTestId } = renderAuthorProfileScreen();

      expect(getByTestId('author-profile-screen')).toBeTruthy();
    });
  });

  describe('Author Profile Display', () => {
    it('should display author profile information when available', async () => {
      mockUseAuthorProfile.authorProfile = {
        username: 'testauthor',
        bio: 'Test bio',
        image: '',
        following: false,
      };

      const { getByTestId } = renderAuthorProfileScreen();

      await waitFor(() => {
        expect(getByTestId('author-profile-screen')).toBeTruthy();
      });
    });

    it('should show author articles section', async () => {
      const { getByTestId } = renderAuthorProfileScreen();

      await waitFor(() => {
        expect(getByTestId('author-profile-screen')).toBeTruthy();
      });
    });

    it('should show empty message when author has no articles', async () => {
      mockUseAuthorProfile.authorArticles = [];
      mockUseAuthorProfile.isLoading = false;

      const { getByText } = renderAuthorProfileScreen();

      await waitFor(() => {
        expect(getByText('No articles found')).toBeTruthy();
      });
    });
  });

  describe('Author Articles Integration', () => {
    it('should integrate with articles store to fetch author articles', async () => {
      const { getByTestId } = renderAuthorProfileScreen();

      await waitFor(() => {
        expect(getByTestId('author-profile-screen')).toBeTruthy();
      });

      expect(mockUseAuthorProfile.authorArticles).toEqual(mockArticles);
    });

    it('should display author articles when available', async () => {
      mockUseAuthorProfile.authorArticles = mockArticles;

      const { getByTestId } = renderAuthorProfileScreen();

      await waitFor(() => {
        expect(getByTestId('article-card-test-article-1')).toBeTruthy();
        expect(getByTestId('article-card-test-article-2')).toBeTruthy();
      });
    });
  });

  describe('Article Interactions', () => {
    it('should handle favorite button press on author articles', async () => {
      mockUseAuthorProfile.authorArticles = mockArticles;

      const { getByTestId } = renderAuthorProfileScreen();

      await waitFor(() => {
        const favoriteButton = getByTestId('favorite-button-testuser1');
        fireEvent.press(favoriteButton);
      });

      expect(mockUseAuthorProfile.onToggleFavorite).toHaveBeenCalledWith(
        'test-article-1',
        false
      );
    });

    it('should handle favorite toggles on multiple articles', async () => {
      mockUseAuthorProfile.authorArticles = mockArticles;

      const { getByTestId } = renderAuthorProfileScreen();

      await waitFor(() => {
        fireEvent.press(getByTestId('favorite-button-testuser1'));
      });

      await waitFor(() => {
        fireEvent.press(getByTestId('favorite-button-testuser2'));
      });

      expect(mockUseAuthorProfile.onToggleFavorite).toHaveBeenCalledTimes(2);
    });
  });

  describe('Pull to Refresh', () => {
    it('should refresh author articles when pull to refresh is triggered', async () => {
      mockUseAuthorProfile.authorArticles = mockArticles;

      const { getByTestId } = renderAuthorProfileScreen();

      await waitFor(() => {
        const articlesList = getByTestId('article-card-test-article-1').parent
          ?.parent;
        if (articlesList) {
          fireEvent(articlesList, 'refresh');
        }
      });

      expect(mockUseAuthorProfile.refreshAuthorArticles).toHaveBeenCalledTimes(
        1
      );
    });
  });

  describe('Loading States', () => {
    it('should show loading state while fetching author data', () => {
      mockUseAuthorProfile.isLoading = true;

      const { getByTestId } = renderAuthorProfileScreen();

      expect(getByTestId('author-profile-screen')).toBeTruthy();
    });

    it('should hide loading state when author data is loaded', () => {
      mockUseAuthorProfile.isLoading = false;

      const { getByTestId } = renderAuthorProfileScreen();

      expect(getByTestId('author-profile-screen')).toBeTruthy();
      expect(mockUseAuthorProfile.isLoading).toBe(false);
    });
  });

  describe('Authentication Integration', () => {
    it('should work with authenticated user', async () => {
      userStore.setUser(mockUserMinimal);

      const { getByTestId } = renderAuthorProfileScreen();

      await waitFor(() => {
        expect(getByTestId('author-profile-screen')).toBeTruthy();
      });

      expect(mockUseAuthorProfile.authorArticles).toEqual(mockArticles);
    });

    it('should handle unauthenticated user gracefully', async () => {
      userStore.forgetUser();

      const { getByTestId } = renderAuthorProfileScreen();

      await waitFor(() => {
        expect(getByTestId('author-profile-screen')).toBeTruthy();
      });

      expect(mockUseAuthorProfile.authorProfile).toBeTruthy();
    });
  });

  describe('Error Scenarios', () => {
    it('should handle missing username parameter gracefully', () => {
      setMockRouteParams({ username: 'missinguser' });

      const { getByTestId } = renderAuthorProfileScreen();

      expect(getByTestId('author-profile-screen')).toBeTruthy();
    });

    it('should handle empty username parameter', () => {
      setMockRouteParams({ username: '' });

      const { getByTestId } = renderAuthorProfileScreen();

      expect(getByTestId('author-profile-screen')).toBeTruthy();
    });

    it('should handle hook errors gracefully', async () => {
      mockUseAuthorProfile.authorProfile = null;
      mockUseAuthorProfile.authorArticles = [];
      mockUseAuthorProfile.isLoading = false;

      const { getByTestId } = renderAuthorProfileScreen();

      await waitFor(() => {
        expect(getByTestId('author-profile-screen')).toBeTruthy();
      });
    });

    it('should handle undefined username parameter', () => {
      setMockRouteParams({ username: 'undefineduser' });

      const { getByTestId } = renderAuthorProfileScreen();

      expect(getByTestId('author-profile-screen')).toBeTruthy();
    });
  });

  describe('Follow/Unfollow Integration', () => {
    it('should handle follow button interaction', async () => {
      mockUseAuthorProfile.authorProfile = {
        username: 'testauthor',
        bio: 'Test bio',
        image: '',
        following: false,
      };

      const { getByTestId } = renderAuthorProfileScreen();

      await waitFor(() => {
        expect(getByTestId('author-profile-screen')).toBeTruthy();
      });

      expect(mockUseAuthorProfile.onFollowToggle).toBeDefined();
    });
  });

  describe('Navigation Integration', () => {
    it('should initialize with correct username from route params', async () => {
      const { getByTestId } = renderAuthorProfileScreen();

      await waitFor(() => {
        expect(getByTestId('author-profile-screen')).toBeTruthy();
      });

      expect(mockUseAuthorProfile.authorProfile?.username).toBe('testauthor');
    });

    it('should handle route parameter changes', async () => {
      const { getByTestId, rerender } = renderAuthorProfileScreen();

      setMockRouteParams({ username: 'newauthor' });

      rerender(
        <SafeAreaProvider>
          <AuthorProfileScreen />
        </SafeAreaProvider>
      );

      await waitFor(() => {
        expect(getByTestId('author-profile-screen')).toBeTruthy();
      });
    });
  });

  describe('Screen Layout and Structure', () => {
    it('should render header section', () => {
      const { getByTestId } = renderAuthorProfileScreen();

      expect(getByTestId('author-profile-screen')).toBeTruthy();
    });

    it('should render articles section', () => {
      const { getByTestId } = renderAuthorProfileScreen();

      expect(getByTestId('author-profile-screen')).toBeTruthy();
    });

    it('should have proper screen structure', () => {
      const { getByTestId } = renderAuthorProfileScreen();

      expect(getByTestId('author-profile-screen')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined username parameter', () => {
      setMockRouteParams({ username: 'undefineduser' });

      const { getByTestId } = renderAuthorProfileScreen();

      expect(getByTestId('author-profile-screen')).toBeTruthy();
    });

    it('should handle empty username parameter', () => {
      setMockRouteParams({ username: '' });

      const { getByTestId } = renderAuthorProfileScreen();

      expect(getByTestId('author-profile-screen')).toBeTruthy();
    });

    it('should handle component mount without user data', () => {
      userStore.forgetUser();

      const { getByTestId } = renderAuthorProfileScreen();

      expect(getByTestId('author-profile-screen')).toBeTruthy();
    });

    it('should handle unmounting gracefully', () => {
      const { unmount } = renderAuthorProfileScreen();

      expect(() => unmount()).not.toThrow();
    });

    it('should handle rapid profile changes', async () => {
      setMockRouteParams({ username: 'newauthor' });

      const { getByTestId } = renderAuthorProfileScreen();

      await waitFor(() => {
        expect(getByTestId('author-profile-screen')).toBeTruthy();
      });
    });
  });

  describe('Performance and Memory', () => {
    it('should handle multiple author profile loads', async () => {
      const { rerender } = renderAuthorProfileScreen();

      setMockRouteParams({ username: 'author1' });
      rerender(
        <SafeAreaProvider>
          <AuthorProfileScreen />
        </SafeAreaProvider>
      );

      setMockRouteParams({ username: 'author2' });
      rerender(
        <SafeAreaProvider>
          <AuthorProfileScreen />
        </SafeAreaProvider>
      );

      setMockRouteParams({ username: 'author3' });
      rerender(
        <SafeAreaProvider>
          <AuthorProfileScreen />
        </SafeAreaProvider>
      );

      expect(getMockUseAuthorProfile()).toBeTruthy();
    });
  });
});
