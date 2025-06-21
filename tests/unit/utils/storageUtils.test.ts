import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '../../../src/constants';
import { User } from '../../../src/store/types';
import { Logger } from '../../../src/utils';
import { StorageUtils } from '../../../src/utils/storageUtils';

// Mock dependencies
jest.mock('@react-native-async-storage/async-storage');
jest.mock('../../../src/utils/Logger');

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;
const mockLogger = Logger as jest.Mocked<typeof Logger>;

describe('StorageUtils', () => {
  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    username: 'testuser',
    token: 'mock-token-123',
    bio: 'Test bio',
    image: 'https://example.com/avatar.jpg',
  };

  const mockToken = 'mock-jwt-token';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('setUserToken', () => {
    it('should save token to AsyncStorage successfully', async () => {
      mockAsyncStorage.setItem.mockResolvedValueOnce();

      await StorageUtils.setUserToken(mockToken);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_TOKEN,
        mockToken
      );
      expect(mockAsyncStorage.setItem).toHaveBeenCalledTimes(1);
    });

    it('should log error when AsyncStorage fails', async () => {
      const error = new Error('AsyncStorage error');
      mockAsyncStorage.setItem.mockRejectedValueOnce(error);

      await StorageUtils.setUserToken(mockToken);

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to save token to storage:',
        error
      );
    });
  });

  describe('getUserToken', () => {
    it('should retrieve token from AsyncStorage successfully', async () => {
      mockAsyncStorage.getItem.mockResolvedValueOnce(mockToken);

      const result = await StorageUtils.getUserToken();

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_TOKEN
      );
      expect(result).toBe(mockToken);
    });

    it('should return null when no token is stored', async () => {
      mockAsyncStorage.getItem.mockResolvedValueOnce(null);

      const result = await StorageUtils.getUserToken();

      expect(result).toBeNull();
    });

    it('should return null and log error when AsyncStorage fails', async () => {
      const error = new Error('AsyncStorage error');
      mockAsyncStorage.getItem.mockRejectedValueOnce(error);

      const result = await StorageUtils.getUserToken();

      expect(result).toBeNull();
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to retrieve token from storage:',
        error
      );
    });
  });

  describe('setUserData', () => {
    it('should save user data to AsyncStorage successfully', async () => {
      mockAsyncStorage.setItem.mockResolvedValueOnce();

      await StorageUtils.setUserData(mockUser);

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(mockUser)
      );
      expect(mockAsyncStorage.setItem).toHaveBeenCalledTimes(1);
    });

    it('should log error when AsyncStorage fails', async () => {
      const error = new Error('AsyncStorage error');
      mockAsyncStorage.setItem.mockRejectedValueOnce(error);

      await StorageUtils.setUserData(mockUser);

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to save user data to storage:',
        error
      );
    });
  });

  describe('getUserData', () => {
    it('should retrieve and parse user data from AsyncStorage successfully', async () => {
      mockAsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockUser));

      const result = await StorageUtils.getUserData();

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_DATA
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null when no user data is stored', async () => {
      mockAsyncStorage.getItem.mockResolvedValueOnce(null);

      const result = await StorageUtils.getUserData();

      expect(result).toBeNull();
    });

    it('should return null and log error when AsyncStorage fails', async () => {
      const error = new Error('AsyncStorage error');
      mockAsyncStorage.getItem.mockRejectedValueOnce(error);

      const result = await StorageUtils.getUserData();

      expect(result).toBeNull();
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to retrieve user data from storage:',
        error
      );
    });

    it('should return null and log error when JSON parsing fails', async () => {
      mockAsyncStorage.getItem.mockResolvedValueOnce('invalid-json');

      const result = await StorageUtils.getUserData();

      expect(result).toBeNull();
      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to retrieve user data from storage:',
        expect.any(SyntaxError)
      );
    });
  });

  describe('clearUserData', () => {
    it('should clear both token and user data from AsyncStorage successfully', async () => {
      mockAsyncStorage.multiRemove.mockResolvedValueOnce();

      await StorageUtils.clearUserData();

      expect(mockAsyncStorage.multiRemove).toHaveBeenCalledWith([
        STORAGE_KEYS.USER_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]);
      expect(mockAsyncStorage.multiRemove).toHaveBeenCalledTimes(1);
    });

    it('should log error when AsyncStorage fails', async () => {
      const error = new Error('AsyncStorage error');
      mockAsyncStorage.multiRemove.mockRejectedValueOnce(error);

      await StorageUtils.clearUserData();

      expect(mockLogger.error).toHaveBeenCalledWith(
        'Failed to clear user data from storage:',
        error
      );
    });
  });
});
