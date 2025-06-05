import { ResponseErrors } from '../services/types';

export type User = {
  id: string;
  email: string;
  token: string;
  username: string;
  bio?: string;
  image?: string;
};

export interface IAuthStore {
  isLoading: boolean;
  errors?: ResponseErrors;
  username: string;
  email: string;
  password: string;
  readonly authValues: {
    email: string;
    username: string;
    password: string;
  };
  clear(): void;
  setUsername(username: string): void;
  setEmail(email: string): void;
  setPassword(password: string): void;
  login(): void;
  register(): void;
  logout(): void;
}

export interface IUserStore {
  user: User | null;
  forgetUser(): void;
  setUser(user: User): void;
}
