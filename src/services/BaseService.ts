import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import { API_URI } from '../constants';
import { IAuthStore, IUserStore } from '../store/types';

export abstract class BaseService {
  protected _api: AxiosInstance;
  protected _authStore: IAuthStore;
  protected _userStore: IUserStore;

  constructor(authStore: IAuthStore, userStore: IUserStore) {
    this._authStore = authStore;
    this._userStore = userStore;

    this._api = axios.create({
      baseURL: API_URI,
    });

    this._setupInterceptors();
  }

  protected _responseBody<T>(res: AxiosResponse<T>): T {
    return res.data;
  }

  private _setupInterceptors(): void {
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
}
