import { makeAutoObservable } from 'mobx';

import { IUserStore, User } from './types';



class UserStore implements IUserStore {
  user: User | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  forgetUser() {
    this.user = null;
  }

  setUser(user: User) {
    this.user = user;
  }
}

export const userStore = new UserStore();
