import { User } from '../store/types';

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
  get(): Promise<UserResponse>;
  login(user: LoginUserRequest): Promise<UserResponse>;
  register(user: RegisterUserRequest): Promise<UserResponse>;
  put(user: User): Promise<UserResponse>;
}

export type Profile = {
  username: string;
  bio: string | null;
  image: string | null;
  following: boolean;
};

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
}
