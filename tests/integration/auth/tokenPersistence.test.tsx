import '@testing-library/jest-native/extend-expect';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { act } from '@testing-library/react-native';

import { STORAGE_KEYS } from '../../../src/constants';
import { User } from '../../../src/store/types';
import { StorageUtils } from '../../../src/utils/storageUtils';
import * as storeMocks from '../../mocks/stores';

const authStore = storeMocks.getAuthStore();
const userStore = storeMocks.getUserStore();

describe('Token Persistence Tests', () => {
  const mockUser: User = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    bio: 'Test bio',
    image: 'test-image.jpg',
    token: 'test-jwt-token-123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.multiRemove as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.clear as jest.Mock).mockResolvedValue(undefined);
  });

  describe('UserStore Token Management', () => {
    it('manages user authentication state and token persistence', async () => {
      await act(async () => {
        await userStore.setUser(mockUser);
      });

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(mockUser)
      );
      expect(userStore.token).toBe(mockUser.token);
      expect(userStore.user).toEqual(mockUser);
      expect(userStore.isAuthenticated()).toBe(true);

      const userWithDifferentToken: User = {
        ...mockUser,
        token: 'different-token-789',
      };

      await act(async () => {
        await userStore.setUser(userWithDifferentToken);
      });

      expect(userStore.token).toBe(userWithDifferentToken.token);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(userWithDifferentToken)
      );
    });

    it('handles user logout and error scenarios', async () => {
      await act(async () => {
        await userStore.setUser(mockUser);
      });

      await act(async () => {
        await userStore.forgetUser();
      });

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_DATA
      );
      expect(userStore.user).toBeNull();
      expect(userStore.token).toBeNull();
      expect(userStore.isAuthenticated()).toBe(false);

      await act(async () => {
        await userStore.setUser(mockUser);
        await userStore.clearStorageOnAuthError();
      });

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_DATA
      );
      expect(userStore.user).toBeNull();
      expect(userStore.token).toBeNull();
      expect(userStore.isAuthenticated()).toBe(false);
    });
  });

  describe('Storage Operations', () => {
    it('handles complete storage lifecycle with error resilience', async () => {
      await StorageUtils.setUserData(mockUser);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(mockUser)
      );

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify(mockUser)
      );
      const retrievedUser = await StorageUtils.getUserData();
      expect(retrievedUser?.token).toBe(mockUser.token);
      expect(retrievedUser).toEqual(mockUser);

      await StorageUtils.clearUserData();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_DATA
      );
    });

    it('handles storage errors and edge cases gracefully', async () => {
      const storageError = new Error('Storage unavailable');
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(storageError);
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(storageError);
      (AsyncStorage.multiRemove as jest.Mock).mockRejectedValue(storageError);

      await expect(StorageUtils.setUserData(mockUser)).resolves.not.toThrow();
      await expect(StorageUtils.clearUserData()).resolves.not.toThrow();
      await expect(StorageUtils.getUserData()).resolves.toBeNull();

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const userData = await StorageUtils.getUserData();
      expect(userData).toBeNull();

      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid-json');
      const invalidUserData = await StorageUtils.getUserData();
      expect(invalidUserData).toBeNull();
    });
  });

  describe('Authentication Integration', () => {
    it('maintains token persistence through complete auth flows', async () => {
      await act(async () => {
        await userStore.forgetUser();
      });

      authStore.setEmail('test@example.com');
      authStore.setPassword('password123');
      expect(userStore.isAuthenticated()).toBe(false);

      await act(async () => {
        await userStore.setUser(mockUser);
      });

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(mockUser)
      );
      expect(userStore.isAuthenticated()).toBe(true);

      authStore.clear();
      expect(userStore.isAuthenticated()).toBe(true);
      expect(userStore.token).toBe(mockUser.token);
    });

    it('handles concurrent operations and rapid updates', async () => {
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

      const operations = [
        () => StorageUtils.setUserData(mockUser),
        () => StorageUtils.clearUserData(),
      ];

      await Promise.all(operations.map(op => op()));
      expect(AsyncStorage.setItem).toHaveBeenCalled();
      expect(AsyncStorage.removeItem).toHaveBeenCalled();
    });
  });
});
