import { action, makeAutoObservable } from 'mobx';

import { AuthService } from '../services';
import { ResponseErrors } from '../services/types';

import { IAuthStore, User } from './types';
import { userStore } from './userStore';

enum RequestType {
  login,
  register,
}

class AuthStore implements IAuthStore {
  isLoading = false;
  errors?: ResponseErrors = undefined;

  username = '';
  email = '';
  password = '';

  private _authService: AuthService;

  constructor() {
    makeAutoObservable(this);

    this._authService = new AuthService(this, userStore);
  }

  clear() {
    this.username = '';
    this.email = '';
    this.password = '';
    this.errors = undefined;
  }

  get authValues() {
    return {
      email: this.email,
      username: this.username,
      password: this.password,
    };
  }

  setUsername(username: string) {
    this.username = username;
  }

  setEmail(email: string) {
    this.email = email;
  }

  setPassword(password: string) {
    this.password = password;
  }

  $request(type: RequestType) {
    this.isLoading = true;
    this.errors = undefined;

    const { email, password } = this.authValues;

    const apiCall =
      type === RequestType.login
        ? this._authService.login({ email, password })
        : this._authService.register(this.authValues);

    apiCall
      .then(
        action(({ user }: { user: User }) => {
          userStore.setUser(user);
          this.clear();
        })
      )
      .catch(
        action(err => {
          if (err?.response?.body?.errors) {
            this.errors = err?.response?.body?.errors;
          }
        })
      )
      .finally(
        action(() => {
          this.isLoading = false;
        })
      );
  }

  login() {
    this.$request(RequestType.login);
  }

  register() {
    this.$request(RequestType.register);
  }

  logout() {
    userStore.forgetUser();
  }
}

export const authStore = new AuthStore();
