import { makeAutoObservable } from 'mobx';

import { User } from './types';
class Store {
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

export const UserStore = new Store();
