import AsyncStorage from '@react-native-async-storage/async-storage';

import '../../mocks';
import {
  setupIntegrationTestEnvironment,
  createMockLoginResponse,
} from '../../utils/testHelpers';

import { STORAGE_KEYS } from '../../../src/constants';
import { AuthService } from '../../../src/services/auth/AuthService';
import { authStore } from '../../../src/store/authStore';
import { User } from '../../../src/store/types';
import { userStore } from '../../../src/store/userStore';
import { mockUser } from '../../mocks/data';

// Mock AsyncStorage for integration tests
const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

// Import the actual StorageUtils to test real integration
const actualStorageUtils = jest.requireActual(
  '../../../src/utils/storageUtils'
).StorageUtils;

describe('Storage Integration Tests', () => {
  const testUser: User = {
    ...mockUser,
    token: 'test-jwt-token-123',
  };

  beforeEach(() => {
    setupIntegrationTestEnvironment();
    jest.clearAllMocks();

    authStore.clear();
    userStore.forgetUser();

    mockAsyncStorage.setItem.mockResolvedValue();
    mockAsyncStorage.getItem.mockResolvedValue(null);
    mockAsyncStorage.multiRemove.mockResolvedValue();
  });

  afterEach(async () => {
    authStore.clear();
    await userStore.forgetUser();
  });

  describe('Authentication Flow with Storage Persistence', () => {
    it('should save user data to storage after successful login', async () => {
      const authService = new AuthService(authStore, userStore);
      jest
        .spyOn(authService, 'login')
        .mockResolvedValue(createMockLoginResponse());

      authStore.setEmail('test@example.com');
      authStore.setPassword('password123');

      await authStore.login();

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_TOKEN,
        expect.any(String)
      );
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_DATA,
        expect.stringContaining('test@example.com')
      );
    });

    it('should save user data to storage after successful registration', async () => {
      const authService = new AuthService(authStore, userStore);
      jest
        .spyOn(authService, 'register')
        .mockResolvedValue(createMockLoginResponse());

      authStore.setUsername('testuser');
      authStore.setEmail('test@example.com');
      authStore.setPassword('password123');

      await authStore.register();

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_TOKEN,
        expect.any(String)
      );
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_DATA,
        expect.stringContaining('test@example.com')
      );
    });

    it('should not save data to storage if login fails', async () => {
      const authService = new AuthService(authStore, userStore);
      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new Error('Login failed'));

      authStore.setEmail('test@example.com');
      authStore.setPassword('wrongpassword');

      await authStore.login();

      expect(mockAsyncStorage.setItem).not.toHaveBeenCalledWith(
        STORAGE_KEYS.USER_TOKEN,
        expect.any(String)
      );
      expect(mockAsyncStorage.setItem).not.toHaveBeenCalledWith(
        STORAGE_KEYS.USER_DATA,
        expect.any(String)
      );
    });
  });

  describe('Logout and Storage Clearing Integration', () => {
    it('should clear storage when user logs out', async () => {
      await userStore.setUser(testUser);

      await authStore.logout();

      expect(mockAsyncStorage.multiRemove).toHaveBeenCalledWith([
        STORAGE_KEYS.USER_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]);
      expect(userStore.user).toBeNull();
      expect(userStore.token).toBeNull();
      expect(userStore.isAuthenticated()).toBe(false);
    });

    it('should handle storage errors during logout gracefully', async () => {
      await userStore.setUser(testUser);

      mockAsyncStorage.multiRemove.mockRejectedValue(
        new Error('Storage error')
      );

      await authStore.logout();

      expect(userStore.user).toBeNull();
      expect(userStore.token).toBeNull();
      expect(userStore.isAuthenticated()).toBe(false);
    });
  });

  describe('Authentication Error Handling with Storage', () => {
    it('should clear storage when authentication error occurs', async () => {
      await userStore.setUser(testUser);

      await userStore.clearStorageOnAuthError();

      expect(mockAsyncStorage.multiRemove).toHaveBeenCalledWith([
        STORAGE_KEYS.USER_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]);
      expect(userStore.user).toBeNull();
      expect(userStore.token).toBeNull();
      expect(userStore.isAuthenticated()).toBe(false);
    });
  });

  describe('StorageUtils Real Integration', () => {
    it('should save user token to AsyncStorage', async () => {
      await actualStorageUtils.setUserToken(testUser.token);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_TOKEN,
        testUser.token
      );
    });

    it('should save user data to AsyncStorage', async () => {
      await actualStorageUtils.setUserData(testUser);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(testUser)
      );
    });

    it('should retrieve user token from AsyncStorage', async () => {
      mockAsyncStorage.getItem.mockResolvedValueOnce(testUser.token);

      const result = await actualStorageUtils.getUserToken();

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_TOKEN
      );
      expect(result).toBe(testUser.token);
    });

    it('should retrieve user data from AsyncStorage', async () => {
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(testUser));

      const result = await actualStorageUtils.getUserData();

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_DATA
      );
      expect(result).toEqual(testUser);
    });

    it('should clear user data from AsyncStorage', async () => {
      await actualStorageUtils.clearUserData();

      expect(mockAsyncStorage.multiRemove).toHaveBeenCalledWith([
        STORAGE_KEYS.USER_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]);
    });

    it('should handle storage errors gracefully', async () => {
      mockAsyncStorage.setItem.mockRejectedValueOnce(
        new Error('Storage error')
      );

      // Should not throw
      await expect(
        actualStorageUtils.setUserToken(testUser.token)
      ).resolves.toBeUndefined();
    });

    it('should return null for missing data', async () => {
      mockAsyncStorage.getItem.mockResolvedValueOnce(null);

      const result = await actualStorageUtils.getUserData();

      expect(result).toBeNull();
    });

    it('should handle JSON parsing errors', async () => {
      mockAsyncStorage.getItem.mockResolvedValueOnce('invalid-json');

      const result = await actualStorageUtils.getUserData();

      expect(result).toBeNull();
    });
  });

  describe('Storage Constants Integration', () => {
    it('should use correct storage keys', () => {
      expect(STORAGE_KEYS.USER_TOKEN).toBe('@realworld:user_token');
      expect(STORAGE_KEYS.USER_DATA).toBe('@realworld:user_data');
    });
  });

  describe('Data Integrity Tests', () => {
    it('should maintain data integrity through save and retrieve cycle', async () => {
      await actualStorageUtils.setUserData(testUser);
      await actualStorageUtils.setUserToken(testUser.token);

      mockAsyncStorage.getItem
        .mockResolvedValueOnce(JSON.stringify(testUser))
        .mockResolvedValueOnce(testUser.token);

      const [retrievedUser, retrievedToken] = await Promise.all([
        actualStorageUtils.getUserData(),
        actualStorageUtils.getUserToken(),
      ]);

      expect(retrievedUser).toEqual(testUser);
      expect(retrievedToken).toBe(testUser.token);
    });

    it('should handle concurrent operations correctly', async () => {
      await Promise.all([
        actualStorageUtils.setUserData(testUser),
        actualStorageUtils.setUserToken(testUser.token),
      ]);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledTimes(2);
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(testUser)
      );
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_TOKEN,
        testUser.token
      );
    });

    it('should clear all user data atomically', async () => {
      await actualStorageUtils.clearUserData();

      expect(mockAsyncStorage.multiRemove).toHaveBeenCalledWith([
        STORAGE_KEYS.USER_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]);
      expect(mockAsyncStorage.multiRemove).toHaveBeenCalledTimes(1);
    });
  });

  describe('UserStore Integration with Storage', () => {
    it('should save user data when setUser is called', async () => {
      await userStore.setUser(testUser);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(testUser)
      );
      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_TOKEN,
        testUser.token
      );

      expect(userStore.user).toEqual(testUser);
      expect(userStore.token).toBe(testUser.token);
      expect(userStore.isAuthenticated()).toBe(true);
    });

    it('should clear storage when forgetUser is called', async () => {
      await userStore.setUser(testUser);

      await userStore.forgetUser();

      expect(mockAsyncStorage.multiRemove).toHaveBeenCalledWith([
        STORAGE_KEYS.USER_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]);

      expect(userStore.user).toBeNull();
      expect(userStore.token).toBeNull();
      expect(userStore.isAuthenticated()).toBe(false);
    });

    it('should handle storage errors gracefully during setUser', async () => {
      mockAsyncStorage.setItem.mockRejectedValue(new Error('Storage error'));

      await userStore.setUser(testUser);

      expect(userStore.user).toEqual(testUser);
      expect(userStore.token).toBe(testUser.token);
      expect(userStore.isAuthenticated()).toBe(true);
    });
  });
});
