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

  describe('Author Profile Management', () => {
    it('displays author profile and articles with loading states', async () => {
      const { mockUseAuthorProfile } = setupMockAuthorProfile();
      mockUseAuthorProfile.isLoading = true;
      const { getByTestId, rerender } = renderAuthorProfileScreen();
      expect(getByTestId(TEST_IDS.AUTHOR_PROFILE_SCREEN)).toBeTruthy();

      mockUseAuthorProfile.isLoading = false;
      setupMockAuthorProfile({ username: 'displayauthor', bio: 'Author bio' });
      rerender(<AuthorProfileScreen />);

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.AUTHOR_PROFILE_SCREEN)).toBeTruthy();
        expect(
          getByTestId(TEST_IDS.ARTICLE_CARD('test-article-1'))
        ).toBeTruthy();
        expect(
          getByTestId(TEST_IDS.ARTICLE_CARD('test-article-2'))
        ).toBeTruthy();
      });
    });

    it('handles empty states and null profile gracefully', async () => {
      const { mockUseAuthorProfile } = setupMockAuthorProfile();
      mockUseAuthorProfile.authorArticles = [];
      const { getByText, rerender } = renderAuthorProfileScreen();

      await waitFor(() => {
        expect(getByText('No articles found')).toBeTruthy();
      });

      mockUseAuthorProfile.authorProfile = null;
      rerender(<AuthorProfileScreen />);
      expect(
        renderAuthorProfileScreen().getByTestId(TEST_IDS.AUTHOR_PROFILE_SCREEN)
      ).toBeTruthy();
    });
  });

  describe('User Interactions', () => {
    it('handles article interactions and refresh functionality', async () => {
      const { mockUseAuthorProfile } = setupMockAuthorProfile();
      const { getAllByTestId, getByTestId } = renderAuthorProfileScreen();

      await waitFor(() => {
        const favoriteButtons = getAllByTestId(
          TEST_IDS.FAVORITE_BUTTON('testauthor')
        );
        fireEvent.press(favoriteButtons[0]);
        fireEvent.press(favoriteButtons[1]);
      });

      expect(mockUseAuthorProfile.onToggleFavorite).toHaveBeenCalledTimes(2);
      expect(mockUseAuthorProfile.onToggleFavorite).toHaveBeenCalledWith(
        'test-article-1',
        false
      );

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

  describe('Authentication Context', () => {
    it('integrates with authentication and follow status', async () => {
      userStore.setUser(createMockUser({ username: 'authenticateduser' }));
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
