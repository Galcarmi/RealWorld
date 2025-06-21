import { makeAutoObservable } from 'mobx';

import { APP_VALIDATION, ERROR_MESSAGES } from '../constants';
import { AuthService } from '../services';
import { navigationService } from '../services/navigationService';
import { ResponseErrors } from '../services/types';

import { IAuthStore } from './types';
import { userStore } from './userStore';

class AuthStore implements IAuthStore {
  public isLoading = false;
  public errors?: ResponseErrors = undefined;
  public username = '';
  public email = '';
  public password = '';

  private _authService: AuthService;

  constructor() {
    makeAutoObservable(this);
    this._authService = new AuthService(userStore);
  }

  public get authValues() {
    return {
      email: this.email,
      username: this.username,
      password: this.password,
    };
  }

  public get isLoginFormValid(): boolean {
    return (
      this.email.trim().length > 0 &&
      this.password.trim().length > 0 &&
      APP_VALIDATION.EMAIL_REGEX.test(this.email.trim())
    );
  }

  public get isSignUpFormValid(): boolean {
    return (
      this.username.trim().length >= APP_VALIDATION.MIN_USERNAME_LENGTH &&
      this.email.trim().length > 0 &&
      this.password.trim().length >= APP_VALIDATION.MIN_PASSWORD_LENGTH &&
      APP_VALIDATION.EMAIL_REGEX.test(this.email.trim())
    );
  }

  public setUsername(username: string) {
    this.username = username;
  }

  public setEmail(email: string) {
    this.email = email;
  }

  public setPassword(password: string) {
    this.password = password;
  }

  public clear() {
    this.username = '';
    this.email = '';
    this.password = '';
    this.errors = undefined;
  }

  public async login() {
    this.isLoading = true;
    this.errors = undefined;

    try {
      const { email, password } = this.authValues;
      const response = await this._authService.login({ email, password });

      await userStore.setUser(response.user);
      this.clear();
      navigationService.navigateToMainTabs();
    } catch (error) {
      this._handleAuthError(error);
    } finally {
      this.isLoading = false;
    }
  }

  public async register() {
    this.isLoading = true;
    this.errors = undefined;

    try {
      const response = await this._authService.register(this.authValues);

      await userStore.setUser(response.user);
      this.clear();
      navigationService.navigateToMainTabs();
    } catch (error) {
      this._handleAuthError(error);
    } finally {
      this.isLoading = false;
    }
  }

  public async logout() {
    await userStore.forgetUser();
    navigationService.navigateToAuthTabs();
  }

  private _handleAuthError(error: unknown) {
    const authError = error as {
      response?: { data?: { errors?: ResponseErrors } };
    };

    if (authError?.response?.data?.errors) {
      this.errors = authError.response.data.errors;
    } else {
      this.errors = { general: [ERROR_MESSAGES.SOMETHING_WENT_WRONG] };
    }
  }
}

export const authStore = new AuthStore();
