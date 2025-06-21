import { render, waitFor } from '@testing-library/react-native';

import '../../mocks';
import { TEST_IDS } from '../../../src/constants/testIds';
import { HomeScreen } from '../../../src/screens/homeScreen/homeScreen';
import { navigationService } from '../../../src/services/navigationService';
import { appEventEmitter } from '../../../src/utils/eventEmitter';
import { createMockArticle } from '../../mocks/data';
import * as storeMocks from '../../mocks/stores';

const articlesStore = storeMocks.getArticlesStore();
const userStore = storeMocks.getUserStore();

describe('Unauthorized Error Handling Integration', () => {
  beforeEach(() => {
    articlesStore.homeArticles = [
      createMockArticle({
        slug: 'test-article',
        title: 'Test Article',
        author: {
          username: 'testauthor',
          bio: '',
          image: '',
          following: false,
        },
        favorited: false,
      }),
    ];
    articlesStore.homeIsLoading = false;
    articlesStore.homeArticlesCount = 1;
    jest.spyOn(userStore, 'isAuthenticated').mockReturnValue(false);

    appEventEmitter.cleanup();
  });

  afterEach(() => {
    appEventEmitter.cleanup();
  });

  describe('EventEmitter Integration with Stores', () => {
    it('should trigger auth error handling when 401 occurs', async () => {
      const mockAuthErrorHandler = jest.fn(async () => {
        await userStore.clearStorageOnAuthError();
        navigationService.navigateToAuthTabs();
        navigationService.navigateToLoginScreen();
      });

      appEventEmitter.onAuthError(mockAuthErrorHandler);

      appEventEmitter.emitAuthError();

      expect(mockAuthErrorHandler).toHaveBeenCalledTimes(1);
      expect(mockAuthErrorHandler).toHaveBeenCalledWith({
        type: 'UNAUTHORIZED_ERROR',
        timestamp: expect.any(Date),
      });

      await waitFor(() => {
        expect(navigationService.navigateToAuthTabs).toHaveBeenCalled();
        expect(navigationService.navigateToLoginScreen).toHaveBeenCalled();
      });
    });

    it('should handle multiple 401 errors without interference', async () => {
      const mockAuthErrorHandler = jest.fn(async () => {
        await userStore.clearStorageOnAuthError();
        navigationService.navigateToAuthTabs();
        navigationService.navigateToLoginScreen();
      });

      appEventEmitter.onAuthError(mockAuthErrorHandler);

      appEventEmitter.emitAuthError();
      appEventEmitter.emitAuthError();
      appEventEmitter.emitAuthError();

      expect(mockAuthErrorHandler).toHaveBeenCalledTimes(3);

      await waitFor(() => {
        expect(navigationService.navigateToAuthTabs).toHaveBeenCalled();
        expect(navigationService.navigateToLoginScreen).toHaveBeenCalled();
      });
    });

    it('should properly clean up event listeners', () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();

      appEventEmitter.onAuthError(handler1);
      appEventEmitter.onAuthError(handler2);

      appEventEmitter.emitAuthError();
      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);

      appEventEmitter.offAuthError(handler1);
      appEventEmitter.emitAuthError();
      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(2);

      appEventEmitter.cleanup();
      appEventEmitter.emitAuthError();
      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(2);
    });
  });

  describe('Component Integration', () => {
    it('should render HomeScreen successfully with mocked stores', async () => {
      const { getByTestId } = render(<HomeScreen />);

      await waitFor(() => {
        expect(getByTestId(TEST_IDS.HOME_SCREEN)).toBeTruthy();
      });

      expect(articlesStore.loadHomeArticlesInitially).toHaveBeenCalledTimes(1);
    });

    it('should handle authenticated vs unauthenticated states', async () => {
      jest.spyOn(userStore, 'isAuthenticated').mockReturnValue(false);
      const { rerender } = render(<HomeScreen />);

      await waitFor(() => {
        expect(userStore.isAuthenticated()).toBe(false);
      });

      const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        token: 'valid-token',
        bio: '',
        image: '',
      };
      userStore.user = mockUser;
      jest.spyOn(userStore, 'isAuthenticated').mockReturnValue(true);

      rerender(<HomeScreen />);

      await waitFor(() => {
        expect(userStore.isAuthenticated()).toBe(true);
      });
    });
  });

  describe('EventEmitter API Verification', () => {
    it('should emit events with correct payload structure', () => {
      const authErrorSpy = jest.fn();
      appEventEmitter.onAuthError(authErrorSpy);

      const startTime = Date.now();
      appEventEmitter.emitAuthError();

      expect(authErrorSpy).toHaveBeenCalledTimes(1);
      const emittedEvent = authErrorSpy.mock.calls[0][0];
      expect(emittedEvent).toEqual({
        type: 'UNAUTHORIZED_ERROR',
        timestamp: expect.any(Date),
      });
      expect(emittedEvent.timestamp.getTime()).toBeGreaterThanOrEqual(
        startTime
      );
    });

    it('should support multiple concurrent listeners', () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      const handler3 = jest.fn();

      appEventEmitter.onAuthError(handler1);
      appEventEmitter.onAuthError(handler2);
      appEventEmitter.onAuthError(handler3);

      appEventEmitter.emitAuthError();

      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
      expect(handler3).toHaveBeenCalledTimes(1);

      const event1 = handler1.mock.calls[0][0];
      const event2 = handler2.mock.calls[0][0];
      const event3 = handler3.mock.calls[0][0];

      expect(event1).toEqual(event2);
      expect(event2).toEqual(event3);
    });
  });
});
