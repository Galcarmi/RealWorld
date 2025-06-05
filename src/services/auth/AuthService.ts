import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import { AuthStore, UserStore } from '../../store';
import { User } from '../../store/types';
import { LoginUserRequest, RegisterUserRequest, UserResponse } from '../types';

export const API_URI = 'https://node-express-conduit.appspot.com/api';

const api = axios.create({
  baseURL: API_URI,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = UserStore.user?.token;

  if (token) {
    config.headers.authorization = `Token ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      AuthStore.logout();
    }
    return Promise.reject(error);
  }
);

const responseBody = (res: AxiosResponse) => res.data;

export const AuthService = {
  get: (): Promise<UserResponse> => api.get('/user').then(responseBody),
  login: (user: LoginUserRequest): Promise<UserResponse> =>
    api.post('/users/login', { user }).then(responseBody),
  register: (user: RegisterUserRequest): Promise<UserResponse> =>
    api.post('/users', { user }).then(responseBody),
  put: (user: User): Promise<UserResponse> => {
    return api.put('/user', { user }).then(responseBody);
  },
};
