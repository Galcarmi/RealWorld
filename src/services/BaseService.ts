import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import {
  API,
  HTTP_STATUS,
  AUTH,
  HTTP_HEADERS,
  ERROR_TYPES,
} from '../constants/app';
import { IAuthStore, IUserStore } from '../store/types';
import { Logger, showErrorAlert } from '../utils';

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
      baseURL: API.URI,
    });

    this._setupInterceptors();
  }

  protected _responseBody<T>(res: AxiosResponse<T>): T {
    return res.data;
  }

  protected _logError(errorResponse: ApiErrorResponse): never {
    this._logApiError(errorResponse);
    this._showErrorAlert(errorResponse);
    throw errorResponse;
  }

  private _logApiError(errorResponse: ApiErrorResponse): void {
    Logger.log('🔴 API Error:', {
      status: errorResponse?.response?.status,
      statusText: errorResponse?.response?.statusText,
      data: errorResponse?.response?.data,
      url: errorResponse?.config?.url,
      method: errorResponse?.config?.method,
      timestamp: new Date().toISOString(),
    });
  }

  private _showErrorAlert(errorResponse: ApiErrorResponse): void {
    if (errorResponse?.response?.data?.errors) {
      showErrorAlert(
        ERROR_TYPES.GENERIC,
        JSON.stringify(errorResponse.response.data.errors.message)
      );
    } else {
      showErrorAlert();
    }
  }

  private _logRequestDetails(config: InternalAxiosRequestConfig): void {
    Logger.log('🔵 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: {
        authorization: config.headers.authorization ? '[REDACTED]' : undefined,
        [HTTP_HEADERS.CONTENT_TYPE]: config.headers[HTTP_HEADERS.CONTENT_TYPE],
      },
      params: config.params,
      data: config.data,
      timestamp: new Date().toISOString(),
    });
  }

  private _logSuccessfulResponse(response: AxiosResponse): void {
    Logger.log('🟢 API Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
      data: response.data,
      timestamp: new Date().toISOString(),
    });
  }

  private _logErrorResponse(error: AxiosError): void {
    Logger.log('🔴 API Error Response:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      data: error.response?.data,
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }

  private _handleUnauthorizedError(): void {
    Logger.log('🔴 401 Unauthorized - Redirecting to login');
    this._userStore.forgetUser();
    navigationService.navigateToAuthTabs();
    navigationService.navigateToLoginScreen();
  }

  private _setupInterceptors(): void {
    this._api.interceptors.request.use(
      (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const token = this._userStore.user?.token;

        if (token) {
          config.headers[AUTH.HEADER_NAME] = `${AUTH.TOKEN_PREFIX}${token}`;
        }

        this._logRequestDetails(config);
        return config;
      }
    );

    this._api.interceptors.response.use(
      (response: AxiosResponse): AxiosResponse => {
        this._logSuccessfulResponse(response);
        return response;
      },
      (error: AxiosError): Promise<never> => {
        this._logErrorResponse(error);

        if (
          error.response &&
          error.response.status === HTTP_STATUS.UNAUTHORIZED
        ) {
          this._handleUnauthorizedError();
        }
        return Promise.reject(error);
      }
    );
  }
}
