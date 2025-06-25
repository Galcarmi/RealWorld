import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from '../constants';
import { User } from '../store/types';

import { Logger } from './Logger';

export class StorageUtils {
  static async setUserData(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    } catch (error) {
      Logger.error('Failed to save user data to storage:', error);
    }
  }

  static async getUserData(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (userData) {
        const user = JSON.parse(userData) as User;
        return user;
      }
      return null;
    } catch (error) {
      Logger.error('Failed to retrieve user data from storage:', error);
      return null;
    }
  }

  static async clearUserData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      Logger.error('Failed to clear user data from storage:', error);
    }
  }
}
