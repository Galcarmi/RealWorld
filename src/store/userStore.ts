import { makeAutoObservable, runInAction } from 'mobx';

import { AuthService } from '../services/auth/AuthService';
import { StorageUtils } from '../utils';

import { authStore } from './authStore';
import { IUserStore, User } from './types';

class UserStore implements IUserStore {
  public user: User | null = null;
  public isInitialized = false;

  private _authService: AuthService;

  constructor() {
    makeAutoObservable(this);
    this._authService = new AuthService(authStore, this);
    this._initializeFromStorage();
  }

  public get token(): string | null {
    return this.user?.token || null;
  }

  public getToken(): string | null {
    return this.user?.token || null;
  }

  public async forgetUser() {
    this.user = null;
    await StorageUtils.clearUserData();
  }

  public async setUser(user: User) {
    this.user = user;
    await StorageUtils.setUserData(user);
  }

  public isAuthenticated(): boolean {
    return !!this.user?.token;
  }

  public async clearStorageOnAuthError() {
    await this.forgetUser();
  }

  private async _initializeFromStorage() {
    try {
      const storedUser = await StorageUtils.getUserData();

      if (storedUser?.token) {
        runInAction(() => {
          this.user = storedUser;
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
    if (!this.user?.token) return;

    try {
      const currentUser = await this._authService.validateStoredToken();

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
