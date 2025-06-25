import { BaseService } from '../common/BaseService';
import {
  ApiErrorResponse,
  IArticleService,
  ArticlesResponse,
  SingleArticleResponse,
  CreateArticleRequest,
  ArticleFilters,
  PaginationParams,
  CommentsResponse,
  SingleCommentResponse,
  CreateCommentRequest,
} from '../common/types';

class ArticleService extends BaseService implements IArticleService {
  constructor() {
    super();
  }

  public async getArticles(params?: ArticleFilters): Promise<ArticlesResponse> {
    try {
      const response = await this._api.get<ArticlesResponse>('/articles', {
        params,
      });
      return this._responseBody(response);
    } catch (error) {
      return this._logError(error as ApiErrorResponse);
    }
  }

  public async getFeedArticles(
    params?: PaginationParams
  ): Promise<ArticlesResponse> {
    try {
      const response = await this._api.get<ArticlesResponse>('/articles/feed', {
        params,
      });
      return this._responseBody(response);
    } catch (error) {
      return this._logError(error as ApiErrorResponse);
    }
  }

  public async getArticle(slug: string): Promise<SingleArticleResponse> {
    try {
      const response = await this._api.get<SingleArticleResponse>(
        `/articles/${slug}`
      );
      return this._responseBody(response);
    } catch (error) {
      return this._logError(error as ApiErrorResponse);
    }
  }

  public async favoriteArticle(slug: string): Promise<SingleArticleResponse> {
    try {
      const response = await this._api.post<SingleArticleResponse>(
        `/articles/${slug}/favorite`
      );
      return this._responseBody(response);
    } catch (error) {
      return this._logError(error as ApiErrorResponse);
    }
  }

  public async unfavoriteArticle(slug: string): Promise<SingleArticleResponse> {
    try {
      const response = await this._api.delete<SingleArticleResponse>(
        `/articles/${slug}/favorite`
      );
      return this._responseBody(response);
    } catch (error) {
      return this._logError(error as ApiErrorResponse);
    }
  }

  public async createArticle(
    article: CreateArticleRequest
  ): Promise<SingleArticleResponse> {
    try {
      const response = await this._api.post<SingleArticleResponse>(
        '/articles',
        { article }
      );
      return this._responseBody(response);
    } catch (error) {
      return this._logError(error as ApiErrorResponse);
    }
  }

  public async updateArticle(
    slug: string,
    article: CreateArticleRequest
  ): Promise<SingleArticleResponse> {
    try {
      const response = await this._api.put<SingleArticleResponse>(
        `/articles/${slug}`,
        { article }
      );
      return this._responseBody(response);
    } catch (error) {
      return this._logError(error as ApiErrorResponse);
    }
  }

  public async deleteArticle(slug: string): Promise<void> {
    try {
      await this._api.delete(`/articles/${slug}`);
    } catch (error) {
      return this._logError(error as ApiErrorResponse);
    }
  }

  public async getComments(slug: string): Promise<CommentsResponse> {
    try {
      const response = await this._api.get<CommentsResponse>(
        `/articles/${slug}/comments`
      );
      return this._responseBody(response);
    } catch (error) {
      return this._logError(error as ApiErrorResponse);
    }
  }

  public async createComment(
    slug: string,
    comment: CreateCommentRequest
  ): Promise<SingleCommentResponse> {
    try {
      const response = await this._api.post<SingleCommentResponse>(
        `/articles/${slug}/comments`,
        { comment }
      );
      return this._responseBody(response);
    } catch (error) {
      return this._logError(error as ApiErrorResponse);
    }
  }

  public async deleteComment(slug: string, commentId: number): Promise<void> {
    try {
      await this._api.delete(`/articles/${slug}/comments/${commentId}`);
    } catch (error) {
      return this._logError(error as ApiErrorResponse);
    }
  }
}

export const articleService = new ArticleService();
export { ArticleService, IArticleService };
