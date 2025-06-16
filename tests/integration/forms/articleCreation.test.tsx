import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { NewArticleScreen as NewArticleScreen } from '../../../src/screens/newArticle/newArticleScreen';
import { articlesStore } from '../../../src/store/articlesStore';
import { userStore } from '../../../src/store/userStore';
import { mockUserMinimal } from '../../mocks/data';

const renderNewArticleScreen = () => {
  return render(
    <SafeAreaProvider>
      <NewArticleScreen />
    </SafeAreaProvider>
  );
};

describe('Article Creation Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    userStore.forgetUser();

    userStore.setUser(mockUserMinimal);

    articlesStore.createArticle = jest.fn();
  });

  afterEach(() => {
    userStore.forgetUser();
  });

  it('should render new article screen', async () => {
    const { getByTestId } = renderNewArticleScreen();

    expect(getByTestId('new-article-screen')).toBeTruthy();
    expect(getByTestId('article-title-input')).toBeTruthy();
    expect(getByTestId('article-description-input')).toBeTruthy();
    expect(getByTestId('article-body-input')).toBeTruthy();
    expect(getByTestId('publish-article-button')).toBeTruthy();
  });

  it('should handle form submission with valid data', async () => {
    const { getByTestId } = renderNewArticleScreen();

    const titleInput = getByTestId('article-title-input');
    const descriptionInput = getByTestId('article-description-input');
    const bodyInput = getByTestId('article-body-input');
    const submitButton = getByTestId('publish-article-button');

    fireEvent.changeText(titleInput, 'Test Article Title');
    fireEvent.changeText(descriptionInput, 'Test Article Description');
    fireEvent.changeText(bodyInput, 'Test Article Body');

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    fireEvent.press(submitButton);

    expect(articlesStore.createArticle).toHaveBeenCalledWith({
      title: 'Test Article Title',
      description: 'Test Article Description',
      body: 'Test Article Body',
    });
  });

  it('should disable submit button with empty required fields', async () => {
    const { getByTestId } = renderNewArticleScreen();

    const submitButton = getByTestId('publish-article-button');

    expect(submitButton).toBeDisabled();
  });

  it('should validate form fields progressively', async () => {
    const { getByTestId } = renderNewArticleScreen();

    const titleInput = getByTestId('article-title-input');
    const descriptionInput = getByTestId('article-description-input');
    const bodyInput = getByTestId('article-body-input');
    const submitButton = getByTestId('publish-article-button');

    expect(submitButton).toBeDisabled();

    fireEvent.changeText(titleInput, 'Test Title');
    expect(submitButton).toBeDisabled();

    fireEvent.changeText(descriptionInput, 'Test Description');
    expect(submitButton).toBeDisabled();

    fireEvent.changeText(bodyInput, 'Test Body');

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('should handle navigation after successful article creation', async () => {
    const { getByTestId } = renderNewArticleScreen();

    const titleInput = getByTestId('article-title-input');
    const descriptionInput = getByTestId('article-description-input');
    const bodyInput = getByTestId('article-body-input');
    const submitButton = getByTestId('publish-article-button');

    fireEvent.changeText(titleInput, 'Test Article Title');
    fireEvent.changeText(descriptionInput, 'Test Article Description');
    fireEvent.changeText(bodyInput, 'Test Article Body');

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    fireEvent.press(submitButton);

    expect(articlesStore.createArticle).toHaveBeenCalled();
  });
});
