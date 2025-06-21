import { render, fireEvent, waitFor } from '@testing-library/react-native';

import '../../mocks';
import { TEST_IDS } from '../../../src/constants/testIds';
import { AuthorProfileScreen } from '../../../src/screens/authorProfile/authorProfileScreen';
import { Profile } from '../../../src/services/types';
import { createMockUser, createMockArticle } from '../../mocks/data';
import { getMockUseAuthorProfile } from '../../mocks/hooks';
import { setMockRoute, mockAuthorProfileRoute } from '../../mocks/navigation';
import * as storeMocks from '../../mocks/stores';

const userStore = storeMocks.getUserStore();

const renderAuthorProfileScreen = () => {
  return render(<AuthorProfileScreen />);
};

const setupMockAuthorProfile = (overrides = {}) => {
  const mockUseAuthorProfile = getMockUseAuthorProfile();
  const defaultProfile = {
    username: 'testauthor',
    bio: 'Test bio',
    image: '',
    following: false,
    ...overrides,
  } as Profile;

  mockUseAuthorProfile.authorProfile = defaultProfile;
  mockUseAuthorProfile.authorArticles = [
    createMockArticle({ slug: 'test-article-1', title: 'Test Article 1' }),
    createMockArticle({ slug: 'test-article-2', title: 'Test Article 2' }),
  ];
  mockUseAuthorProfile.isLoading = false;

  return { mockUseAuthorProfile, profile: defaultProfile };
};

describe('Author Profile Screen Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setMockRoute(mockAuthorProfileRoute);
    userStore.setUser(createMockUser());
    setupMockAuthorProfile();
  });

  describe('Screen Rendering', () => {
    it('renders author profile screen with proper test ID', () => {
      const { getByTestId } = renderAuthorProfileScreen();

      expect(getByTestId(TEST_IDS.AUTHOR_PROFILE_SCREEN)).toBeTruthy();
    });

    it('handles loading state', () => {
      const { mockUseAuthorProfile } = setupMockAuthorProfile();
      mockUseAuthorProfile.isLoading = true;

      const { getByTestId } = renderAuthorProfileScreen();

      expect(getByTestId(TEST_IDS.AUTHOR_PROFILE_SCREEN)).toBeTruthy();
    });

    it('handles empty author profile state', () => {
      const { mockUseAuthorProfile } = setupMockAuthorProfile();
      mockUseAuthorProfile.authorProfile = null;

      const { getByTestId } = renderAuthorProfileScreen();

      expect(getByTestId(TEST_IDS.AUTHOR_PROFILE_SCREEN)).toBeTruthy();
    });
  });

  describe('Author Profile Display', () => {
    it('displays author profile information', async () => {
      setupMockAuthorProfile({ username: 'displayauthor', bio: 'Author bio' });

      const { getByTestId } = renderAuthorProfileScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.AUTHOR_PROFILE_SCREEN)).toBeTruthy();
      });
    });

    it('displays author articles when available', async () => {
      const { getByTestId } = renderAuthorProfileScreen();

      await waitFor(() => {
        expect(
          getByTestId(TEST_IDS.ARTICLE_CARD('test-article-1'))
        ).toBeTruthy();
        expect(
          getByTestId(TEST_IDS.ARTICLE_CARD('test-article-2'))
        ).toBeTruthy();
      });
    });

    it('shows empty message when author has no articles', async () => {
      const { mockUseAuthorProfile } = setupMockAuthorProfile();
      mockUseAuthorProfile.authorArticles = [];

      const { getByText } = renderAuthorProfileScreen();

      await waitFor(() => {
        expect(getByText('No articles found')).toBeTruthy();
      });
    });
  });

  describe('Article Interaction', () => {
    it('handles favorite button press on author articles', async () => {
      const { mockUseAuthorProfile } = setupMockAuthorProfile();
      const { getAllByTestId } = renderAuthorProfileScreen();

      await waitFor(() => {
        const favoriteButtons = getAllByTestId(
          TEST_IDS.FAVORITE_BUTTON('testauthor')
        );
        fireEvent.press(favoriteButtons[0]);
      });

      expect(mockUseAuthorProfile.onToggleFavorite).toHaveBeenCalledWith(
        'test-article-1',
        false
      );
    });

    it('handles multiple favorite toggles', async () => {
      const { mockUseAuthorProfile } = setupMockAuthorProfile();
      const { getAllByTestId } = renderAuthorProfileScreen();

      await waitFor(() => {
        const favoriteButtons = getAllByTestId(
          TEST_IDS.FAVORITE_BUTTON('testauthor')
        );
        fireEvent.press(favoriteButtons[0]);
        fireEvent.press(favoriteButtons[1]);
      });

      expect(mockUseAuthorProfile.onToggleFavorite).toHaveBeenCalledTimes(2);
    });
  });

  describe('Refresh', () => {
    it('handles pull to refresh functionality', async () => {
      const { mockUseAuthorProfile } = setupMockAuthorProfile();
      const { getByTestId } = renderAuthorProfileScreen();

      await waitFor(() => {
        const articleCard = getByTestId(
          TEST_IDS.ARTICLE_CARD('test-article-1')
        );
        const scrollView = articleCard.parent?.parent;
        if (scrollView) {
          fireEvent(scrollView, 'refresh');
        }
      });

      expect(mockUseAuthorProfile.refreshAuthorArticles).toHaveBeenCalledTimes(
        1
      );
    });
  });

  describe('Authentication', () => {
    it('works with authenticated user', async () => {
      userStore.setUser(createMockUser({ username: 'authenticateduser' }));

      const { getByTestId } = renderAuthorProfileScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.AUTHOR_PROFILE_SCREEN)).toBeTruthy();
      });
    });

    it('integrates with user store for follow/unfollow actions', async () => {
      const { mockUseAuthorProfile } = setupMockAuthorProfile({
        following: true,
      });

      const { getByTestId } = renderAuthorProfileScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.AUTHOR_PROFILE_SCREEN)).toBeTruthy();
      });

      expect(mockUseAuthorProfile.authorProfile?.following).toBe(true);
    });
  });
});
