import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import { IAuthStore, IUserStore, User } from '../../store/types';
import { LoginUserRequest, RegisterUserRequest, UserResponse } from '../types';

export const API_URI = 'https://node-express-conduit.appspot.com/api';

class AuthServiceClass {
  private api;
  private authStore: IAuthStore;
  private userStore: IUserStore;

  constructor(authStore: IAuthStore, userStore: IUserStore) {
    this.authStore = authStore;
    this.userStore = userStore;
    
    this.api = axios.create({
      baseURL: API_URI,
    });

    this.api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const token = this.userStore.user?.token;

      if (token) {
        config.headers.authorization = `Token ${token}`;
      }

      return config;
    });

    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
          this.authStore.logout();
        }
        return Promise.reject(error);
      }
    );
  }

  private responseBody = (res: AxiosResponse) => res.data;

  get = (): Promise<UserResponse> => this.api.get('/user').then(this.responseBody);
  
  login = (user: LoginUserRequest): Promise<UserResponse> =>
    this.api.post('/users/login', { user }).then(this.responseBody);
  
  register = (user: RegisterUserRequest): Promise<UserResponse> =>
    this.api.post('/users', { user }).then(this.responseBody);
  
  put = (user: User): Promise<UserResponse> => {
    return this.api.put('/user', { user }).then(this.responseBody);
  };
}

export { AuthServiceClass };
