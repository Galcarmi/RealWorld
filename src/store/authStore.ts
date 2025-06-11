import { action, makeAutoObservable } from 'mobx';

import { AuthService } from '../services';
import { navigationService } from '../services/navigationService';
import { ResponseErrors } from '../services/types';

import { IAuthStore } from './types';
import { userStore } from './userStore';

enum RequestType {
  login,
  register,
}

class AuthStore implements IAuthStore {
  public isLoading = false;
  public errors?: ResponseErrors = undefined;
  public username = '';
  public email = '';
  public password = '';

  private _authService: AuthService;

  constructor() {
    makeAutoObservable(this);

    this._authService = new AuthService(this, userStore);
  }

  public clear() {
    this.username = '';
    this.email = '';
    this.password = '';
    this.errors = undefined;
  }

  public get authValues() {
    return {
      email: this.email,
      username: this.username,
      password: this.password,
    };
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

  public login() {
    this._$request(RequestType.login);
  }

  public register() {
    this._$request(RequestType.register);
  }

  public logout() {
    userStore.forgetUser();
    navigationService.navigateToAuthTabs();
  }

  private _$request(type: RequestType) {
    this.isLoading = true;
    this.errors = undefined;

    const { email, password } = this.authValues;

    const apiCall =
      type === RequestType.login
        ? this._authService.login({ email, password })
        : this._authService.register(this.authValues);

    apiCall
      .then(
        action(response => {
          userStore.setUser(response.user);
          this.clear();
          navigationService.navigateToMainTabs();
        })
      )
      .catch(
        action(err => {
          if (err?.response?.data?.errors) {
            this.errors = err.response.data.errors;
          } else {
            this.errors = { general: ['Something went wrong'] };
          }
        })
      )
      .finally(
        action(() => {
          this.isLoading = false;
        })
      );
  }

  public get isLoginFormValid(): boolean {
    return (
      this.email.trim().length > 0 &&
      this.password.trim().length > 0 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim())
    );
  }

  public get isSignUpFormValid(): boolean {
    return (
      this.username.trim().length >= 3 &&
      this.email.trim().length > 0 &&
      this.password.trim().length >= 6 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.trim())
    );
  }
}

export const authStore = new AuthStore();
