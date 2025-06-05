import { makeAutoObservable } from 'mobx';

import { IUserStore, User } from './types';

class UserStore implements IUserStore {
  public user: User | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  public forgetUser() {
    this.user = null;
  }

  public setUser(user: User) {
    this.user = user;
  }
}

export const userStore = new UserStore();
