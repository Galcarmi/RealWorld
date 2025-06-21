import { fireEvent, waitFor, RenderAPI } from '@testing-library/react-native';

import { navigationService } from '../../../src/services/navigationService';
import { articlesStore } from '../../../src/store/articlesStore';

export const testArticleCardPress = async (
  renderResult: RenderAPI,
  expectedUsername: string
) => {
  const navigationSpy = jest.spyOn(
    navigationService,
    'navigateToAuthorProfile'
  );

  const { getByTestId } = renderResult;

  await waitFor(() => {
    const articleCard = getByTestId('article-card-test-article-1');
    fireEvent.press(articleCard);
  });

  expect(navigationSpy).toHaveBeenCalledWith(expectedUsername);
  return navigationSpy;
};

export const testFavoriteButtonPress = async (
  renderResult: RenderAPI,
  username: string,
  articleSlug: string,
  currentFavoritedStatus: boolean
) => {
  const { getByTestId } = renderResult;

  await waitFor(() => {
    const favoriteButton = getByTestId(`favorite-button-${username}`);
    fireEvent.press(favoriteButton);
  });

  expect(articlesStore.toggleArticleFavoriteStatus).toHaveBeenCalledWith(
    articleSlug,
    currentFavoritedStatus
  );
};

export const testMultipleArticlePresses = async (
  renderResult: RenderAPI,
  expectedUsernames: string[]
) => {
  const navigationSpy = jest.spyOn(
    navigationService,
    'navigateToAuthorProfile'
  );

  const { getByTestId } = renderResult;

  for (let i = 0; i < expectedUsernames.length; i++) {
    await waitFor(() => {
      fireEvent.press(getByTestId(`article-card-test-article-${i + 1}`));
    });
  }

  expect(navigationSpy).toHaveBeenCalledTimes(expectedUsernames.length);
  expectedUsernames.forEach((username, index) => {
    expect(navigationSpy).toHaveBeenNthCalledWith(index + 1, username);
  });

  return navigationSpy;
};

export const testMultipleFavoriteToggles = async (
  renderResult: RenderAPI,
  testCases: Array<{
    username: string;
    articleSlug: string;
    currentFavoritedStatus: boolean;
  }>
) => {
  const { getByTestId } = renderResult;

  for (const testCase of testCases) {
    await waitFor(() => {
      fireEvent.press(getByTestId(`favorite-button-${testCase.username}`));
    });
  }

  expect(articlesStore.toggleArticleFavoriteStatus).toHaveBeenCalledTimes(
    testCases.length
  );

  testCases.forEach((testCase, index) => {
    expect(articlesStore.toggleArticleFavoriteStatus).toHaveBeenNthCalledWith(
      index + 1,
      testCase.articleSlug,
      testCase.currentFavoritedStatus
    );
  });
};
