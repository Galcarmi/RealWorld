import { render, fireEvent, waitFor, act } from '@testing-library/react-native';

import '../../mocks';

import { TEST_IDS } from '../../../src/constants/testIds';
import { ProfileScreen } from '../../../src/screens/profileScreen/profileScreen';
import { navigationService } from '../../../src/services';
import { createMockUser } from '../../mocks/data';
import { getMockNavigationService } from '../../mocks/services';
import * as storeMocks from '../../mocks/stores';

const articlesStore = storeMocks.getArticlesStore();
const userStore = storeMocks.getUserStore();
const mockNavigationService = getMockNavigationService();

const renderProfileScreen = () => {
  return render(<ProfileScreen />);
};

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

  describe('Authentication and Profile Display', () => {
    it('redirects to login when user is not authenticated', async () => {
      await act(async () => {
        userStore.forgetUser();
      });

      renderProfileScreen();
      expect(mockNavigationService.navigateToLoginScreen).toHaveBeenCalledTimes(
        1
      );
    });

    it('displays authenticated user profile with all components', async () => {
      const user = await setupAuthenticatedUser({
        username: 'testuser123',
        bio: 'Test bio',
        image: 'test-image.jpg',
      });

      const { getByTestId, getByText } = renderProfileScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.PROFILE_SCREEN)).toBeTruthy();
        expect(getByTestId(TEST_IDS.EDIT_PROFILE_BUTTON)).toBeTruthy();
        expect(getByTestId(TEST_IDS.NEW_ARTICLE_BUTTON)).toBeTruthy();
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
  });

  describe('Navigation and Article Management', () => {
    it('handles navigation actions', async () => {
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

    it('loads user articles on mount', async () => {
      const getUserArticlesSpy = jest.spyOn(articlesStore, 'getUserArticles');
      const user = await setupAuthenticatedUser();

      renderProfileScreen();

      await waitFor(() => {
        expect(getUserArticlesSpy).toHaveBeenCalledWith(
          user.username,
          expect.any(Number),
          expect.any(Number)
        );
      });
    });

    it('handles article loading states and errors gracefully', async () => {
      articlesStore.homeIsLoading = true;
      const { getByTestId } = renderProfileScreen();

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.PROFILE_SCREEN)).toBeTruthy();
      });
      expect(articlesStore.homeIsLoading).toBe(true);

      jest
        .spyOn(articlesStore, 'getUserArticles')
        .mockRejectedValue(new Error('Network error'));

      articlesStore.homeIsLoading = false;
      const { getByTestId: getByTestIdError } = renderProfileScreen();

      await waitFor(() => {
        expect(getByTestIdError(TEST_IDS.PROFILE_SCREEN)).toBeTruthy();
      });
    });
  });
});
