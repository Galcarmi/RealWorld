import { action, makeAutoObservable } from 'mobx';

import { AuthService } from '../services';
import { ResponseErrors } from '../services/types';

import { User } from './types';

import { UserStore } from '.';

enum RequestType {
  login,
  register,
}

class Store {
  isLoading = false;
  errors?: ResponseErrors = undefined;

  username = '';
  email = '';
  password = '';

  constructor() {
    makeAutoObservable(this);
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
        ? AuthService.login({ email, password })
        : AuthService.register(this.authValues);

    apiCall
      .then(
        action(({ user }: { user: User }) => {
          UserStore.setUser(user);
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
    UserStore.forgetUser();
  }
}

export const AuthStore = new Store();
