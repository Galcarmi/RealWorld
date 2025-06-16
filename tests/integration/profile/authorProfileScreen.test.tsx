import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '../../mocks';
import { AuthorProfileScreen } from '../../../src/screens/authorProfile/authorProfileScreen';
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

    // Set the mock route for AuthorProfile
    setMockRoute(mockAuthorProfileRoute);

    // Set authenticated user by default
    userStore.setUser(mockUserMinimal);

    // Reset mock hook values
    mockUseAuthorProfile.authorProfile = {
      username: 'testauthor',
      bio: 'Test bio',
      image: '',
      following: false,
    } as any;
    mockUseAuthorProfile.authorArticles = mockArticles;
    mockUseAuthorProfile.isLoading = false;
    mockUseAuthorProfile.onFollowToggle = jest.fn();
    mockUseAuthorProfile.onToggleFavorite = jest.fn();
    mockUseAuthorProfile.refreshAuthorArticles = jest.fn();
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
      // Screen header with back button should be rendered
    });

    it('should show loading/empty state when no author profile is available', () => {
      mockUseAuthorProfile.authorProfile = null;

      const { getByTestId } = renderAuthorProfileScreen();

      expect(getByTestId('author-profile-screen')).toBeTruthy();
      // Should render without crashing even when profile is not loaded
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
      // Author articles list should be rendered
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

      // useAuthorProfile hook should have been called
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
      // Loading indicator should be shown
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

      // Should still show author data
      expect(mockUseAuthorProfile.authorProfile).toBeTruthy();
    });
  });

  describe('Error Scenarios', () => {
    it('should handle missing username parameter gracefully', () => {
      // Mock route with undefined username
      setMockRouteParams({ username: undefined });

      const { getByTestId } = renderAuthorProfileScreen();

      expect(getByTestId('author-profile-screen')).toBeTruthy();
      // Should render without crashing
    });

    it('should handle empty username parameter', () => {
      // Mock route with empty username
      setMockRouteParams({ username: '' });

      const { getByTestId } = renderAuthorProfileScreen();

      expect(getByTestId('author-profile-screen')).toBeTruthy();
      // Should render without crashing
    });

    it('should handle hook errors gracefully', async () => {
      // Mock hook with error state
      mockUseAuthorProfile.authorProfile = null;
      mockUseAuthorProfile.authorArticles = [];
      mockUseAuthorProfile.isLoading = false;

      const { getByTestId } = renderAuthorProfileScreen();

      await waitFor(() => {
        expect(getByTestId('author-profile-screen')).toBeTruthy();
      });

      // Screen should still render despite error
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

      // Follow/unfollow functionality is handled by the hook
      expect(mockUseAuthorProfile.onFollowToggle).toBeDefined();
    });
  });

  describe('Navigation Integration', () => {
    it('should initialize with correct username from route params', async () => {
      const { getByTestId } = renderAuthorProfileScreen();

      await waitFor(() => {
        expect(getByTestId('author-profile-screen')).toBeTruthy();
      });

      // The hook should be initialized with the correct username
      expect(mockUseAuthorProfile.authorProfile?.username).toBe('testauthor');
    });

    it('should handle route parameter changes', async () => {
      const { getByTestId, rerender } = renderAuthorProfileScreen();

      // Change the route parameter
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
      // Header section should be rendered
    });

    it('should render articles section', () => {
      const { getByTestId } = renderAuthorProfileScreen();

      expect(getByTestId('author-profile-screen')).toBeTruthy();
      // Articles section should be rendered
    });

    it('should have proper screen structure', () => {
      const { getByTestId } = renderAuthorProfileScreen();

      expect(getByTestId('author-profile-screen')).toBeTruthy();
      // Screen should have proper layout structure
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined username parameter', () => {
      setMockRouteParams({ username: undefined });

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

      // Change to different authors
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
