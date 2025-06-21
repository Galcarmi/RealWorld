import { makeAutoObservable, runInAction } from 'mobx';

import { authService } from '../services/auth/AuthService';
import { navigationService } from '../services/navigationService';
import { StorageUtils } from '../utils';
import { appEventEmitter, AuthErrorEvent } from '../utils/eventEmitter';
import { setGlobalTokenProvider } from '../utils/tokenProvider';

import { IUserStore, User } from './types';

class UserStore implements IUserStore {
  public user: User | null = null;
  public isInitialized = false;

  private _authErrorHandler: (event: AuthErrorEvent) => void;

  constructor() {
    makeAutoObservable(this);
    this._authErrorHandler = this._handleAuthError.bind(this);
    this._initializeFromStorage();
    this._setupEventListeners();
    this._setupTokenProvider();
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

  public cleanup(): void {
    appEventEmitter.offAuthError(this._authErrorHandler);
  }

  private async _handleAuthError(): Promise<void> {
    await this.clearStorageOnAuthError();
    navigationService.navigateToAuthTabs();
    navigationService.navigateToLoginScreen();
  }

  private _setupEventListeners(): void {
    appEventEmitter.onAuthError(this._authErrorHandler);
  }

  private _setupTokenProvider(): void {
    setGlobalTokenProvider(() => this.getToken());
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
