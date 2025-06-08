import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import { API_URI } from '../../constants';
import { IAuthStore, IUserStore } from '../../store/types';
import {
  IArticleService,
  ArticlesResponse,
  SingleArticleResponse,
} from '../types';

class ArticleService implements IArticleService {
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

  public getArticles(params?: {
    tag?: string;
    author?: string;
    favorited?: string;
    limit?: number;
    offset?: number;
  }): Promise<ArticlesResponse> {
    return this._api
      .get<ArticlesResponse>('/articles', { params })
      .then(this._responseBody);
  }

  public getFeedArticles(params?: {
    limit?: number;
    offset?: number;
  }): Promise<ArticlesResponse> {
    return this._api
      .get<ArticlesResponse>('/articles/feed', { params })
      .then(this._responseBody);
  }

  public getArticle(slug: string): Promise<SingleArticleResponse> {
    return this._api
      .get<SingleArticleResponse>(`/articles/${slug}`)
      .then(this._responseBody);
  }

  private _responseBody<T>(res: AxiosResponse<T>): T {
    return res.data;
  }
}

export { ArticleService, IArticleService };
