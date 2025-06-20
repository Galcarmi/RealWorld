import { makeAutoObservable, runInAction } from 'mobx';

import { IUserStore, User } from './types';
import { StorageUtils, Logger } from '../utils';
import { AuthService } from '../services/auth/AuthService';
import { authStore } from './authStore';

class UserStore implements IUserStore {
  public user: User | null = null;
  public token: string | null = null;
  public isInitialized = false;

  constructor() {
    makeAutoObservable(this);
    this.initializeFromStorage();
  }

  private async initializeFromStorage() {
    try {
      const [storedUser, storedToken] = await Promise.all([
        StorageUtils.getUserData(),
        StorageUtils.getUserToken(),
      ]);

      if (storedUser && storedToken) {
        runInAction(() => {
          this.user = storedUser;
          this.token = storedToken;
        });
        
        await this.validateStoredToken();
        
      }
    } catch (error) {
      await this.clearStorageOnAuthError();
    } finally {
      runInAction(() => {
        this.isInitialized = true;
      });
    }
  }

  private async validateStoredToken() {
    if (!this.token) return;

    try {
      const authService = new AuthService(authStore, this);
      
      const currentUser = await authService.validateStoredToken();
      
      if (currentUser) {
        runInAction(() => {
          this.user = currentUser.user;
        });
        await StorageUtils.setUserData(currentUser.user);
      } else {
        await this.clearStorageOnAuthError();
      }
    } catch (error) {
      await this.clearStorageOnAuthError();
    }
  }

  public async forgetUser() {
    this.user = null;
    this.token = null;
    await StorageUtils.clearUserData();
  }

  public async setUser(user: User) {
    this.user = user;
    this.token = user.token;
    
    await Promise.all([
      StorageUtils.setUserData(user),
      StorageUtils.setUserToken(user.token),
    ]);
  }

  public getToken(): string | null {
    return this.token;
  }

  public isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  public async clearStorageOnAuthError() {
    await this.forgetUser();
  }
}

export const userStore = new UserStore();
