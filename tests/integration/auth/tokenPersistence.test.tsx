import '@testing-library/jest-native/extend-expect';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { act } from '@testing-library/react-native';

import { STORAGE_KEYS } from '../../../src/constants';
import { authStore } from '../../../src/store/authStore';
import { User } from '../../../src/store/types';
import { userStore } from '../../../src/store/userStore';
import { StorageUtils } from '../../../src/utils/storageUtils';

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('Token Persistence Integration Tests', () => {
  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    username: 'testuser',
    token: 'test-jwt-token-123',
    bio: 'Test bio',
    image: 'https://example.com/avatar.jpg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    userStore.forgetUser();
    authStore.clear();
  });

  describe('UserStore Integration', () => {
    it('persists token and user data when user is set', async () => {
      await act(async () => {
        await userStore.setUser(mockUser);
      });

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_TOKEN,
        mockUser.token
      );
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(mockUser)
      );

      expect(userStore.token).toBe(mockUser.token);
      expect(userStore.user).toEqual(mockUser);
      expect(userStore.isAuthenticated()).toBe(true);
    });

    it('clears stored data when user is forgotten', async () => {
      await act(async () => {
        await userStore.setUser(mockUser);
        await userStore.forgetUser();
      });

      expect(mockAsyncStorage.multiRemove).toHaveBeenCalledWith([
        STORAGE_KEYS.USER_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]);

      expect(userStore.user).toBeNull();
      expect(userStore.token).toBeNull();
      expect(userStore.isAuthenticated()).toBe(false);
    });

    it('clears stored data on authentication error', async () => {
      await act(async () => {
        await userStore.setUser(mockUser);
        await userStore.clearStorageOnAuthError();
      });

      expect(mockAsyncStorage.multiRemove).toHaveBeenCalledWith([
        STORAGE_KEYS.USER_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]);

      expect(userStore.user).toBeNull();
      expect(userStore.token).toBeNull();
      expect(userStore.isAuthenticated()).toBe(false);
    });

    it('keeps token and user data synchronized', async () => {
      const userWithDifferentToken: User = {
        ...mockUser,
        token: 'different-token-789',
      };

      await act(async () => {
        await userStore.setUser(mockUser);
      });

      expect(userStore.token).toBe(mockUser.token);

      await act(async () => {
        await userStore.setUser(userWithDifferentToken);
      });

      expect(userStore.token).toBe(userWithDifferentToken.token);
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_TOKEN,
        userWithDifferentToken.token
      );
    });
  });

  describe('StorageUtils Integration', () => {
    it('stores and retrieves user token', async () => {
      const testToken = 'test-token-456';

      await StorageUtils.setUserToken(testToken);
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_TOKEN,
        testToken
      );

      mockAsyncStorage.getItem.mockResolvedValue(testToken);
      const retrievedToken = await StorageUtils.getUserToken();

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_TOKEN
      );
      expect(retrievedToken).toBe(testToken);
    });

    it('stores and retrieves user data', async () => {
      await StorageUtils.setUserData(mockUser);
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(mockUser)
      );

      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockUser));
      const retrievedUser = await StorageUtils.getUserData();

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_DATA
      );
      expect(retrievedUser).toEqual(mockUser);
    });

    it('clears all user data', async () => {
      await StorageUtils.clearUserData();

      expect(mockAsyncStorage.multiRemove).toHaveBeenCalledWith([
        STORAGE_KEYS.USER_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]);
    });

    it('handles storage errors gracefully', async () => {
      const storageError = new Error('Storage unavailable');
      mockAsyncStorage.setItem.mockRejectedValue(storageError);
      mockAsyncStorage.getItem.mockRejectedValue(storageError);
      mockAsyncStorage.multiRemove.mockRejectedValue(storageError);

      await expect(StorageUtils.setUserToken('test')).resolves.not.toThrow();
      await expect(StorageUtils.setUserData(mockUser)).resolves.not.toThrow();
      await expect(StorageUtils.clearUserData()).resolves.not.toThrow();

      await expect(StorageUtils.getUserToken()).resolves.toBeNull();
      await expect(StorageUtils.getUserData()).resolves.toBeNull();
    });
  });

  describe('Authentication Flow Integration', () => {
    it('maintains token persistence through auth store operations', async () => {
      authStore.setEmail('test@example.com');
      authStore.setPassword('password123');

      expect(userStore.isAuthenticated()).toBe(false);

      await act(async () => {
        await userStore.setUser(mockUser);
      });

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_TOKEN,
        mockUser.token
      );
      expect(userStore.isAuthenticated()).toBe(true);

      authStore.clear();

      expect(userStore.isAuthenticated()).toBe(true);
      expect(userStore.token).toBe(mockUser.token);
    });

    it('handles rapid user store updates', async () => {
      const users = [
        { ...mockUser, username: 'user1' },
        { ...mockUser, username: 'user2' },
        { ...mockUser, username: 'user3' },
      ];

      for (const user of users) {
        await act(async () => {
          await userStore.setUser(user);
        });
      }

      expect(userStore.user?.username).toBe('user3');
      expect(userStore.isAuthenticated()).toBe(true);
    });
  });

  describe('Storage Edge Cases', () => {
    it('handles null and invalid data retrieval', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const token = await StorageUtils.getUserToken();
      const userData = await StorageUtils.getUserData();

      expect(token).toBeNull();
      expect(userData).toBeNull();
    });

    it('handles invalid JSON in user data', async () => {
      mockAsyncStorage.getItem.mockResolvedValue('invalid-json');

      const userData = await StorageUtils.getUserData();

      expect(userData).toBeNull();
    });

    it('handles concurrent storage operations', async () => {
      const operations = [
        () => StorageUtils.setUserToken('token1'),
        () => StorageUtils.setUserToken('token2'),
        () => StorageUtils.setUserData(mockUser),
        () => StorageUtils.clearUserData(),
      ];

      await Promise.all(operations.map(op => op()));

      expect(mockAsyncStorage.setItem).toHaveBeenCalled();
      expect(mockAsyncStorage.multiRemove).toHaveBeenCalled();
    });
  });
});
