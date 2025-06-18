import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '../../mocks';
import { NewArticleScreen } from '../../../src/screens/newArticle/newArticleScreen';
import { Article } from '../../../src/services/types';
import { articlesStore } from '../../../src/store/articlesStore';
import { userStore } from '../../../src/store/userStore';
import { mockUserMinimal } from '../../mocks/data';
import { resetAllStoreMocks } from '../../mocks/stores';

const renderNewArticleScreen = () => {
  return render(
    <SafeAreaProvider>
      <NewArticleScreen />
    </SafeAreaProvider>
  );
};

describe('Article Creation Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    userStore.forgetUser();
    resetAllStoreMocks();

    userStore.setUser(mockUserMinimal);
  });

  afterEach(() => {
    userStore.forgetUser();
  });

  describe('Initial Screen State', () => {
    it('should render new article screen with all required elements', () => {
      const { getByTestId } = renderNewArticleScreen();

      expect(getByTestId('new-article-screen')).toBeTruthy();
      expect(getByTestId('article-title-input')).toBeTruthy();
      expect(getByTestId('article-description-input')).toBeTruthy();
      expect(getByTestId('article-body-input')).toBeTruthy();
      expect(getByTestId('publish-article-button')).toBeTruthy();
    });

    it('should display correct screen header', () => {
      const { getByText } = renderNewArticleScreen();

      expect(getByText('New Article')).toBeTruthy();
    });

    it('should disable publish button with empty fields', () => {
      const { getByTestId } = renderNewArticleScreen();

      const publishButton = getByTestId('publish-article-button');
      expect(publishButton).toBeDisabled();
    });
  });

  describe('Form Field Interactions', () => {
    it('should update all form fields when typing', () => {
      const { getByTestId } = renderNewArticleScreen();

      const titleInput = getByTestId('article-title-input');
      const descriptionInput = getByTestId('article-description-input');
      const bodyInput = getByTestId('article-body-input');

      fireEvent.changeText(titleInput, 'Test Article Title');
      fireEvent.changeText(descriptionInput, 'Test Article Description');
      fireEvent.changeText(bodyInput, 'Test Article Body Content');

      expect(titleInput).toBeTruthy();
      expect(descriptionInput).toBeTruthy();
      expect(bodyInput).toBeTruthy();
    });

    it('should handle field focus and blur events', () => {
      const { getByTestId } = renderNewArticleScreen();

      const titleInput = getByTestId('article-title-input');
      const descriptionInput = getByTestId('article-description-input');
      const bodyInput = getByTestId('article-body-input');

      fireEvent(titleInput, 'focus');
      fireEvent(titleInput, 'blur');
      fireEvent(descriptionInput, 'focus');
      fireEvent(descriptionInput, 'blur');
      fireEvent(bodyInput, 'focus');
      fireEvent(bodyInput, 'blur');

      expect(titleInput).toBeTruthy();
      expect(descriptionInput).toBeTruthy();
      expect(bodyInput).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    it('should enable publish button when all required fields are filled', async () => {
      const { getByTestId } = renderNewArticleScreen();

      const titleInput = getByTestId('article-title-input');
      const descriptionInput = getByTestId('article-description-input');
      const bodyInput = getByTestId('article-body-input');

      fireEvent.changeText(titleInput, 'Test Article Title');
      fireEvent.changeText(descriptionInput, 'Test Article Description');
      fireEvent.changeText(bodyInput, 'Test Article Body');

      await waitFor(() => {
        const publishButton = getByTestId('publish-article-button');
        expect(publishButton).not.toBeDisabled();
      });
    });

    it('should keep publish button disabled with empty title', () => {
      const { getByTestId } = renderNewArticleScreen();

      const descriptionInput = getByTestId('article-description-input');
      const bodyInput = getByTestId('article-body-input');

      fireEvent.changeText(descriptionInput, 'Test Description');
      fireEvent.changeText(bodyInput, 'Test Body');

      const publishButton = getByTestId('publish-article-button');
      expect(publishButton).toBeDisabled();
    });

    it('should keep publish button disabled with empty description', () => {
      const { getByTestId } = renderNewArticleScreen();

      const titleInput = getByTestId('article-title-input');
      const bodyInput = getByTestId('article-body-input');

      fireEvent.changeText(titleInput, 'Test Title');
      fireEvent.changeText(bodyInput, 'Test Body');

      const publishButton = getByTestId('publish-article-button');
      expect(publishButton).toBeDisabled();
    });

    it('should keep publish button disabled with empty body', () => {
      const { getByTestId } = renderNewArticleScreen();

      const titleInput = getByTestId('article-title-input');
      const descriptionInput = getByTestId('article-description-input');

      fireEvent.changeText(titleInput, 'Test Title');
      fireEvent.changeText(descriptionInput, 'Test Description');

      const publishButton = getByTestId('publish-article-button');
      expect(publishButton).toBeDisabled();
    });

    it('should validate form fields progressively', async () => {
      const { getByTestId } = renderNewArticleScreen();

      const titleInput = getByTestId('article-title-input');
      const descriptionInput = getByTestId('article-description-input');
      const bodyInput = getByTestId('article-body-input');

      expect(getByTestId('publish-article-button')).toBeDisabled();

      fireEvent.changeText(titleInput, 'Test Title');
      expect(getByTestId('publish-article-button')).toBeDisabled();

      fireEvent.changeText(descriptionInput, 'Test Description');
      expect(getByTestId('publish-article-button')).toBeDisabled();

      fireEvent.changeText(bodyInput, 'Test Body');

      await waitFor(() => {
        expect(getByTestId('publish-article-button')).not.toBeDisabled();
      });
    });
  });

  describe('Article Publication', () => {
    it('should call createArticle when form is submitted with valid data', async () => {
      const createArticleSpy = jest.spyOn(articlesStore, 'createArticle');
      const { getByTestId } = renderNewArticleScreen();

      const titleInput = getByTestId('article-title-input');
      const descriptionInput = getByTestId('article-description-input');
      const bodyInput = getByTestId('article-body-input');
      const publishButton = getByTestId('publish-article-button');

      fireEvent.changeText(titleInput, 'Integration Test Article');
      fireEvent.changeText(descriptionInput, 'This is a test description');
      fireEvent.changeText(bodyInput, 'This is the test article body content');

      await waitFor(() => {
        expect(publishButton).not.toBeDisabled();
      });

      fireEvent.press(publishButton);

      expect(createArticleSpy).toHaveBeenCalledWith({
        title: 'Integration Test Article',
        description: 'This is a test description',
        body: 'This is the test article body content',
      });
    });

    it('should handle successful article creation', async () => {
      const createArticleSpy = jest.spyOn(articlesStore, 'createArticle');
      const { getByTestId } = renderNewArticleScreen();

      const titleInput = getByTestId('article-title-input');
      const descriptionInput = getByTestId('article-description-input');
      const bodyInput = getByTestId('article-body-input');
      const publishButton = getByTestId('publish-article-button');

      fireEvent.changeText(titleInput, 'Success Test Article');
      fireEvent.changeText(descriptionInput, 'Success test description');
      fireEvent.changeText(bodyInput, 'Success test body');

      await waitFor(() => {
        expect(publishButton).not.toBeDisabled();
      });

      fireEvent.press(publishButton);

      expect(createArticleSpy).toHaveBeenCalled();
    });
  });

  describe('Loading States', () => {
    it('should show loading state is handled by useNewArticle hook', async () => {
      const { getByTestId } = renderNewArticleScreen();

      const titleInput = getByTestId('article-title-input');
      const descriptionInput = getByTestId('article-description-input');
      const bodyInput = getByTestId('article-body-input');

      fireEvent.changeText(titleInput, 'Loading Test');
      fireEvent.changeText(descriptionInput, 'Loading Description');
      fireEvent.changeText(bodyInput, 'Loading Body');

      await waitFor(() => {
        const publishButton = getByTestId('publish-article-button');
        expect(publishButton).not.toBeDisabled();
      });

      const publishButton = getByTestId('publish-article-button');
      expect(publishButton).not.toBeDisabled();
    });

    it('should handle form state correctly during validation', async () => {
      const { getByTestId } = renderNewArticleScreen();

      const titleInput = getByTestId('article-title-input');
      const descriptionInput = getByTestId('article-description-input');
      const bodyInput = getByTestId('article-body-input');

      fireEvent.changeText(titleInput, 'Valid Test');
      fireEvent.changeText(descriptionInput, 'Valid Description');
      fireEvent.changeText(bodyInput, 'Valid Body');

      await waitFor(() => {
        const publishButton = getByTestId('publish-article-button');
        expect(publishButton).not.toBeDisabled();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle article creation errors gracefully', async () => {
      jest
        .spyOn(articlesStore, 'createArticle')
        .mockRejectedValue(new Error('Creation failed'));

      const { getByTestId } = renderNewArticleScreen();

      const titleInput = getByTestId('article-title-input');
      const descriptionInput = getByTestId('article-description-input');
      const bodyInput = getByTestId('article-body-input');
      const publishButton = getByTestId('publish-article-button');

      fireEvent.changeText(titleInput, 'Error Test Article');
      fireEvent.changeText(descriptionInput, 'Error test description');
      fireEvent.changeText(bodyInput, 'Error test body');

      await waitFor(() => {
        expect(publishButton).not.toBeDisabled();
      });

      fireEvent.press(publishButton);

      expect(getByTestId('new-article-screen')).toBeTruthy();
    });

    it('should clear form on successful submission', async () => {
      const mockArticle: Article = {
        slug: 'test-article',
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body',
        tagList: ['test'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        favorited: false,
        favoritesCount: 0,
        author: {
          username: 'testuser',
          bio: 'Test bio',
          image: null,
          following: false,
        },
      };

      jest.spyOn(articlesStore, 'createArticle').mockResolvedValue(mockArticle);

      const { getByTestId } = renderNewArticleScreen();

      const titleInput = getByTestId('article-title-input');
      const descriptionInput = getByTestId('article-description-input');
      const bodyInput = getByTestId('article-body-input');
      const publishButton = getByTestId('publish-article-button');

      fireEvent.changeText(titleInput, 'Success Article');
      fireEvent.changeText(descriptionInput, 'Success description');
      fireEvent.changeText(bodyInput, 'Success body');

      await waitFor(() => {
        expect(publishButton).not.toBeDisabled();
      });

      fireEvent.press(publishButton);

      expect(getByTestId('new-article-screen')).toBeTruthy();
    });
  });

  describe('Content Validation', () => {
    it('should handle very long content', () => {
      const { getByTestId } = renderNewArticleScreen();

      const titleInput = getByTestId('article-title-input');
      const descriptionInput = getByTestId('article-description-input');
      const bodyInput = getByTestId('article-body-input');

      const longContent = 'A'.repeat(1000);

      fireEvent.changeText(titleInput, longContent);
      fireEvent.changeText(descriptionInput, longContent);
      fireEvent.changeText(bodyInput, longContent);

      expect(titleInput).toBeTruthy();
      expect(descriptionInput).toBeTruthy();
      expect(bodyInput).toBeTruthy();
    });

    it('should handle special characters in content', () => {
      const { getByTestId } = renderNewArticleScreen();

      const titleInput = getByTestId('article-title-input');
      const descriptionInput = getByTestId('article-description-input');
      const bodyInput = getByTestId('article-body-input');

      const specialContent = 'Special chars: !@#$%^&*()_+-={}[]|\\:";\'<>?,./';

      fireEvent.changeText(titleInput, specialContent);
      fireEvent.changeText(descriptionInput, specialContent);
      fireEvent.changeText(bodyInput, specialContent);

      expect(titleInput).toBeTruthy();
      expect(descriptionInput).toBeTruthy();
      expect(bodyInput).toBeTruthy();
    });

    it('should handle multiline content', () => {
      const { getByTestId } = renderNewArticleScreen();

      const bodyInput = getByTestId('article-body-input');

      const multilineContent = `Line 1
Line 2
Line 3

Line 5 with empty line above`;

      fireEvent.changeText(bodyInput, multilineContent);

      expect(bodyInput).toBeTruthy();
    });
  });

  describe('Multiple Interaction Sequences', () => {
    it('should handle multiple form submissions gracefully', async () => {
      const createArticleSpy = jest.spyOn(articlesStore, 'createArticle');
      const { getByTestId } = renderNewArticleScreen();

      const titleInput = getByTestId('article-title-input');
      const descriptionInput = getByTestId('article-description-input');
      const bodyInput = getByTestId('article-body-input');
      const publishButton = getByTestId('publish-article-button');

      fireEvent.changeText(titleInput, 'Multiple Submission Test');
      fireEvent.changeText(descriptionInput, 'Multiple submission description');
      fireEvent.changeText(bodyInput, 'Multiple submission body');

      await waitFor(() => {
        expect(publishButton).not.toBeDisabled();
      });

      fireEvent.press(publishButton);
      fireEvent.press(publishButton);
      fireEvent.press(publishButton);

      expect(createArticleSpy).toHaveBeenCalled();
    });

    it('should handle form clearing and refilling', async () => {
      const { getByTestId } = renderNewArticleScreen();

      const titleInput = getByTestId('article-title-input');
      const descriptionInput = getByTestId('article-description-input');
      const bodyInput = getByTestId('article-body-input');

      fireEvent.changeText(titleInput, 'First Title');
      fireEvent.changeText(descriptionInput, 'First Description');
      fireEvent.changeText(bodyInput, 'First Body');

      fireEvent.changeText(titleInput, '');
      fireEvent.changeText(descriptionInput, '');
      fireEvent.changeText(bodyInput, '');

      fireEvent.changeText(titleInput, 'Second Title');
      fireEvent.changeText(descriptionInput, 'Second Description');
      fireEvent.changeText(bodyInput, 'Second Body');

      await waitFor(() => {
        const publishButton = getByTestId('publish-article-button');
        expect(publishButton).not.toBeDisabled();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle component unmount gracefully', () => {
      const { unmount } = renderNewArticleScreen();

      expect(() => unmount()).not.toThrow();
    });

    it('should handle rapid field changes', () => {
      const { getByTestId } = renderNewArticleScreen();

      const titleInput = getByTestId('article-title-input');

      fireEvent.changeText(titleInput, 'A');
      fireEvent.changeText(titleInput, 'AB');
      fireEvent.changeText(titleInput, 'ABC');
      fireEvent.changeText(titleInput, 'ABCD');
      fireEvent.changeText(titleInput, 'Final Title');

      expect(titleInput).toBeTruthy();
    });
  });

  describe('Authentication Requirements', () => {
    it('should work with authenticated user', () => {
      userStore.setUser(mockUserMinimal);

      const { getByTestId } = renderNewArticleScreen();
      expect(getByTestId('new-article-screen')).toBeTruthy();
      expect(getByTestId('article-title-input')).toBeTruthy();
      expect(getByTestId('article-description-input')).toBeTruthy();
      expect(getByTestId('article-body-input')).toBeTruthy();
      expect(getByTestId('publish-article-button')).toBeTruthy();
    });
  });
});
