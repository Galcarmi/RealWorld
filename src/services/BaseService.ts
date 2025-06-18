import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import { API_URI } from '../constants';
import { IAuthStore, IUserStore } from '../store/types';
import { showErrorAlert } from '../utils';

import { navigationService } from './navigationService';
import { ApiErrorResponse } from './types';

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

  protected _logError(errorResponse: ApiErrorResponse): never {
    console.log('🔴 API Error:', {
      status: errorResponse?.response?.status,
      statusText: errorResponse?.response?.statusText,
      data: errorResponse?.response?.data,
      url: errorResponse?.config?.url,
      method: errorResponse?.config?.method,
      timestamp: new Date().toISOString(),
    });

    if (errorResponse?.response?.data?.errors) {
      showErrorAlert(
        'Error',
        JSON.stringify(errorResponse.response.data.errors.message)
      );
    } else {
      showErrorAlert();
    }

    throw errorResponse;
  }

  private _setupInterceptors(): void {
    this._api.interceptors.request.use(
      (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const token = this._userStore.user?.token;

        if (token) {
          config.headers.authorization = `Token ${token}`;
        }

        // Debug logging for requests
        console.log('🔵 API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          baseURL: config.baseURL,
          fullURL: `${config.baseURL}${config.url}`,
          headers: {
            authorization: config.headers.authorization
              ? '[REDACTED]'
              : undefined,
            'content-type': config.headers['content-type'],
          },
          params: config.params,
          data: config.data,
          timestamp: new Date().toISOString(),
        });

        return config;
      }
    );

    this._api.interceptors.response.use(
      (response: AxiosResponse): AxiosResponse => {
        // Debug logging for successful responses
        console.log('🟢 API Response:', {
          status: response.status,
          statusText: response.statusText,
          url: response.config.url,
          method: response.config.method?.toUpperCase(),
          data: response.data,
          timestamp: new Date().toISOString(),
        });

        return response;
      },
      (error: AxiosError): Promise<never> => {
        // Debug logging for error responses
        console.log('🔴 API Error Response:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          method: error.config?.method?.toUpperCase(),
          data: error.response?.data,
          message: error.message,
          timestamp: new Date().toISOString(),
        });

        if (error.response && error.response.status === 401) {
          console.log('🔴 401 Unauthorized - Redirecting to login');
          this._userStore.forgetUser();
          navigationService.navigateToAuthTabs();
          navigationService.navigateToLoginScreen();
        }
        return Promise.reject(error);
      }
    );
  }
}
