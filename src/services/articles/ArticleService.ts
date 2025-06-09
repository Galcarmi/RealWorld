import { IAuthStore, IUserStore } from '../../store/types';
import { BaseService } from '../BaseService';
import {
  IArticleService,
  ArticlesResponse,
  SingleArticleResponse,
} from '../types';

class ArticleService extends BaseService implements IArticleService {
  constructor(authStore: IAuthStore, userStore: IUserStore) {
    super(authStore, userStore);
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
}

export { ArticleService, IArticleService };
