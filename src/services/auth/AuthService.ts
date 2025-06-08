import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import { IAuthStore, IUserStore, User } from '../../store/types';
import {
  IAuthService,
  LoginUserRequest,
  RegisterUserRequest,
  UserResponse,
} from '../types';

export const API_URI = 'http://node-express-conduit.appspot.com/api';

class AuthService implements IAuthService {
  private _api: AxiosInstance;
  private _authStore: IAuthStore;
  private _userStore: IUserStore;

  constructor(authStore: IAuthStore, userStore: IUserStore) {
    this._authStore = authStore;
    this._userStore = userStore;

    this._api = axios.create({
      baseURL: API_URI,
    });

    this._api.interceptors.request.use(
      (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const token = this._userStore.user?.token;

        if (token) {
          config.headers.authorization = `Token ${token}`;
        }

        return config;
      }
    );

    this._api.interceptors.response.use(
      (response: AxiosResponse): AxiosResponse => response,
      (error: AxiosError): Promise<never> => {
        if (error.response && error.response.status === 401) {
          this._authStore.logout();
        }
        return Promise.reject(error);
      }
    );
  }

  public get(): Promise<UserResponse> {
    return this._api.get<UserResponse>('/user').then(this._responseBody);
  }

  public login(user: LoginUserRequest): Promise<UserResponse> {
    return this._api
      .post<UserResponse>('/users/login', { user })
      .then(this._responseBody);
  }

  public register(user: RegisterUserRequest): Promise<UserResponse> {
    return this._api
      .post<UserResponse>('/users', { user })
      .then(this._responseBody);
  }

  public put(user: User): Promise<UserResponse> {
    return this._api
      .put<UserResponse>('/user', { user })
      .then(this._responseBody);
  }

  private _responseBody<T>(res: AxiosResponse<T>): T {
    return res.data;
  }
}

export { AuthService, IAuthService };
