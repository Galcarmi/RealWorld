import { FeedType } from '../constants/feedTypes';
import {
  ResponseErrors,
  Article,
  CreateArticleRequest,
} from '../services/types';

export type User = {
  id: string;
  email: string;
  token: string;
  username: string;
  bio?: string;
  image?: string;
};

export interface IAuthStore {
  isLoading: boolean;
  errors?: ResponseErrors;
  username: string;
  email: string;
  password: string;
  readonly authValues: {
    email: string;
    username: string;
    password: string;
  };
  readonly isLoginFormValid: boolean;
  readonly isSignUpFormValid: boolean;
  clear(): void;
  setUsername(username: string): void;
  setEmail(email: string): void;
  setPassword(password: string): void;
  login(): void;
  register(): void;
  logout(): void;
}

export interface IUserStore {
  user: User | null;
  token: string | null;
  forgetUser(): void;
  setUser(user: User): void;
  getToken(): string | null;
  isAuthenticated(): boolean;
}

export interface IArticlesStore {
  homeArticles: Article[];
  homeIsLoading: boolean;
  homeArticlesCount: number;
  homeCurrentOffset: number;
  feedType: FeedType;
  favoriteArticles: Article[];
  favoritesIsLoading: boolean;
  favoritesArticlesCount: number;
  favoritesCurrentOffset: number;
  loadHomeArticlesInitially(): Promise<void>;
  loadMoreHomeArticles(): Promise<void>;
  refreshHomeArticles(): Promise<void>;
  switchToGlobalFeed(): Promise<void>;
  switchToUserFeed(): Promise<void>;
  loadFavoriteArticlesInitially(): Promise<void>;
  loadMoreFavoriteArticles(): Promise<void>;
  refreshFavoriteArticles(): Promise<void>;
  getUserArticles(
    username: string,
    limit?: number,
    offset?: number
  ): Promise<{ articles: Article[] }>;
  createArticle(articleData: CreateArticleRequest): Promise<Article>;
  toggleArticleFavoriteStatus(
    slug: string,
    currentlyFavorited: boolean
  ): Promise<void>;
}
