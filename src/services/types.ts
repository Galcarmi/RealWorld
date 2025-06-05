import { User } from '../store/types';

export type ResponseErrors = {
  [id: string]: string[];
};

export type BaseUserCredentials = {
  email: string;
  password: string;
};

export type LoginUserRequest = BaseUserCredentials;

export type RegisterUserRequest = BaseUserCredentials & {
  username: string;
};

export type UserResponse = {
  user: User;
};
