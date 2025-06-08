import { makeAutoObservable } from 'mobx';

import { IUserStore, User } from './types';

class UserStore implements IUserStore {
  public user: User | null = null;
  public token: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  public forgetUser() {
    this.user = null;
    this.token = null;
  }

  public setUser(user: User) {
    this.user = user;
    this.token = user.token;
  }

  public getToken(): string | null {
    return this.token;
  }

  public isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }
}

export const userStore = new UserStore();
