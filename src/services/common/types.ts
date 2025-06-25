import { AxiosError } from 'axios';

import { User } from '../../store/types';

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

export interface IAuthService {
  getCurrentUser(): Promise<UserResponse>;
  login(user: LoginUserRequest): Promise<UserResponse>;
  register(user: RegisterUserRequest): Promise<UserResponse>;
  updateUser(user: User): Promise<UserResponse>;
  validateStoredToken(): Promise<UserResponse | null>;
}

export type Profile = {
  username: string;
  bio: string | null;
  image: string | null;
  following: boolean;
};

export type Comment = {
  id: number;
  body: string;
  createdAt: string;
  updatedAt: string;
  author: Profile;
};

export type CommentsResponse = {
  comments: Comment[];
};

export type SingleCommentResponse = {
  comment: Comment;
};

export type CreateCommentRequest = {
  body: string;
};

export type ProfileResponse = {
  profile: Profile;
};

export interface IProfileService {
  getProfile(username: string): Promise<ProfileResponse>;
  followUser(username: string): Promise<ProfileResponse>;
  unfollowUser(username: string): Promise<ProfileResponse>;
}

export type Article = {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[] | null;
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: Profile;
};

export type ArticlesResponse = {
  articles: Article[];
  articlesCount: number;
};

export type SingleArticleResponse = {
  article: Article;
};

export type CreateArticleRequest = {
  title: string;
  description: string;
  body: string;
  tagList?: string[];
};

export interface IArticleService {
  getArticles(params?: {
    tag?: string;
    author?: string;
    favorited?: string;
    limit?: number;
    offset?: number;
  }): Promise<ArticlesResponse>;
  getFeedArticles(params?: {
    limit?: number;
    offset?: number;
  }): Promise<ArticlesResponse>;
  getArticle(slug: string): Promise<SingleArticleResponse>;
  favoriteArticle(slug: string): Promise<SingleArticleResponse>;
  unfavoriteArticle(slug: string): Promise<SingleArticleResponse>;
  createArticle(article: CreateArticleRequest): Promise<SingleArticleResponse>;
  updateArticle(
    slug: string,
    article: CreateArticleRequest
  ): Promise<SingleArticleResponse>;
  deleteArticle(slug: string): Promise<void>;
  getComments(slug: string): Promise<CommentsResponse>;
  createComment(
    slug: string,
    comment: CreateCommentRequest
  ): Promise<SingleCommentResponse>;
  deleteComment(slug: string, commentId: number): Promise<void>;
}

export type ApiErrorResponse = AxiosError & {
  response: {
    data: {
      errors: ResponseErrors;
    };
  };
};

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface ArticleFilters extends PaginationParams {
  tag?: string;
  author?: string;
  favorited?: string;
}
