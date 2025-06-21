import { makeAutoObservable, runInAction } from 'mobx';

import { AuthService } from '../services/auth/AuthService';
import { StorageUtils } from '../utils';

import { authStore } from './authStore';
import { IUserStore, User } from './types';

class UserStore implements IUserStore {
  public user: User | null = null;
  public token: string | null = null;
  public isInitialized = false;

  constructor() {
    makeAutoObservable(this);
    this._initializeFromStorage();
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

  private async _initializeFromStorage() {
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

        await this._validateStoredToken();
      }
    } catch {
      await this.clearStorageOnAuthError();
    } finally {
      runInAction(() => {
        this.isInitialized = true;
      });
    }
  }

  private async _validateStoredToken() {
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
    } catch {
      await this.clearStorageOnAuthError();
    }
  }
}

export const userStore = new UserStore();
