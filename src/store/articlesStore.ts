import { makeAutoObservable, runInAction } from 'mobx';

import { PAGINATION } from '../constants';
import { FeedType } from '../constants/feedTypes';
import { ArticleService } from '../services';
import {
  Article,
  CreateArticleRequest,
  ResponseErrors,
} from '../services/types';

import { IArticlesStore } from './types';
import { userStore } from './userStore';

class ArticlesStore implements IArticlesStore {
  public homeArticles: Article[] = [];
  public homeIsLoading = false;
  public homeArticlesCount = 0;
  public homeCurrentOffset = 0;
  public homeErrors?: ResponseErrors = undefined;
  public feedType: FeedType = FeedType.GLOBAL;

  public favoriteArticles: Article[] = [];
  public favoritesIsLoading = false;
  public favoritesArticlesCount = 0;
  public favoritesCurrentOffset = 0;
  public favoritesErrors?: ResponseErrors = undefined;

  private _articleService: ArticleService;

  constructor() {
    makeAutoObservable(this);
    this._articleService = new ArticleService(userStore);
  }

  public get canLoadMoreHomeArticles(): boolean {
    return (
      !this.homeIsLoading && this.homeArticles.length < this.homeArticlesCount
    );
  }

  public get canLoadMoreFavoriteArticles(): boolean {
    return (
      !this.favoritesIsLoading &&
      this.favoriteArticles.length < this.favoritesArticlesCount
    );
  }

  public async loadHomeArticlesInitially() {
    await this._fetchHomeArticles(0, true);
  }

  public async loadMoreHomeArticles() {
    if (this.canLoadMoreHomeArticles) {
      await this._fetchHomeArticles(
        this.homeCurrentOffset + PAGINATION.DEFAULT_LIMIT,
        false
      );
    }
  }

  public async refreshHomeArticles() {
    await this._fetchHomeArticles(0, true);
  }

  public async switchToGlobalFeed() {
    this._setFeedTypeAndReset(FeedType.GLOBAL);
    await this._fetchHomeArticles(0, true);
  }

  public async switchToUserFeed() {
    this._setFeedTypeAndReset(FeedType.FEED);
    await this._fetchHomeArticles(0, true);
  }

  public async loadFavoriteArticlesInitially() {
    await this._fetchFavoriteArticles(0, true);
  }

  public async loadMoreFavoriteArticles() {
    if (this.canLoadMoreFavoriteArticles) {
      await this._fetchFavoriteArticles(
        this.favoritesCurrentOffset + PAGINATION.DEFAULT_LIMIT,
        false
      );
    }
  }

  public async refreshFavoriteArticles() {
    await this._fetchFavoriteArticles(0, true);
  }

  public async getUserArticles(
    username: string,
    limit = PAGINATION.DEFAULT_LIMIT,
    offset = 0
  ) {
    try {
      return await this._articleService.getArticles({
        author: username,
        limit,
        offset,
      });
    } catch (error) {
      this._handleError(error, 'Failed to fetch user articles');
      throw error;
    }
  }

  public async createArticle(articleData: CreateArticleRequest) {
    try {
      const response = await this._articleService.createArticle(articleData);
      this._addNewArticleToHomeList(response.article);
      return response.article;
    } catch (error) {
      this._handleError(error, 'Failed to create article');
      throw error;
    }
  }

  public async toggleArticleFavoriteStatus(
    slug: string,
    currentlyFavorited: boolean
  ) {
    try {
      const response = await this._performFavoriteAction(
        slug,
        currentlyFavorited
      );
      this._updateArticleAfterFavoriteToggle(
        slug,
        response.article,
        currentlyFavorited
      );
    } catch (error) {
      this._handleError(error, 'Failed to update article');
    }
  }

  public clearHomeErrors() {
    this.homeErrors = undefined;
  }

  public clearFavoritesErrors() {
    this.favoritesErrors = undefined;
  }

  private _setFeedTypeAndReset(feedType: FeedType): void {
    this.feedType = feedType;
    this.homeCurrentOffset = 0;
    this.homeErrors = undefined;
  }

  private _addNewArticleToHomeList(article: Article): void {
    runInAction(() => {
      if (this.homeArticles.length > 0) {
        this.homeArticles.unshift(article);
        this.homeArticlesCount += 1;
      }
    });
  }

  private async _performFavoriteAction(
    slug: string,
    currentlyFavorited: boolean
  ) {
    return currentlyFavorited
      ? await this._articleService.unfavoriteArticle(slug)
      : await this._articleService.favoriteArticle(slug);
  }

  private _updateArticleAfterFavoriteToggle(
    slug: string,
    updatedArticle: Article,
    wasUnfavorited: boolean
  ): void {
    runInAction(() => {
      this._updateArticleInHomeList(slug, updatedArticle);
      this._updateArticleInFavoritesList(slug, updatedArticle, wasUnfavorited);
    });
  }

  private async _getArticlesBasedOnFeedType(limit: number, offset: number) {
    return this.feedType === FeedType.GLOBAL
      ? await this._articleService.getArticles({ limit, offset })
      : await this._articleService.getFeedArticles({ limit, offset });
  }

  private _updateHomeArticlesState(
    response: { articles: Article[]; articlesCount: number },
    offset: number,
    resetList: boolean
  ): void {
    if (resetList) {
      this.homeArticles = response.articles;
      this.homeCurrentOffset = offset;
    } else {
      this.homeArticles = this._mergeArticlesWithoutDuplicates(
        this.homeArticles,
        response.articles
      );
      this.homeCurrentOffset = offset;
    }
    this.homeArticlesCount = response.articlesCount;
  }

  private _updateFavoriteArticlesState(
    response: { articles: Article[]; articlesCount: number },
    offset: number,
    resetList: boolean
  ): void {
    if (resetList) {
      this.favoriteArticles = response.articles;
      this.favoritesCurrentOffset = offset;
    } else {
      this.favoriteArticles = this._mergeArticlesWithoutDuplicates(
        this.favoriteArticles,
        response.articles
      );
      this.favoritesCurrentOffset = offset;
    }
    this.favoritesArticlesCount = response.articlesCount;
  }

  private async _fetchHomeArticles(offset: number, resetList: boolean) {
    this.homeIsLoading = true;
    this.homeErrors = undefined;

    try {
      const response = await this._getArticlesBasedOnFeedType(
        PAGINATION.DEFAULT_LIMIT,
        offset
      );
      runInAction(() => {
        this._updateHomeArticlesState(response, offset, resetList);
      });
    } catch (error) {
      this._handleError(error, 'Failed to load articles', 'home');
    } finally {
      runInAction(() => {
        this.homeIsLoading = false;
      });
    }
  }

  private async _fetchFavoriteArticles(offset: number, resetList: boolean) {
    if (!userStore.user?.username) {
      return;
    }

    this.favoritesIsLoading = true;
    this.favoritesErrors = undefined;

    try {
      const response = await this._articleService.getArticles({
        favorited: userStore.user.username,
        limit: PAGINATION.DEFAULT_LIMIT,
        offset,
      });

      runInAction(() => {
        this._updateFavoriteArticlesState(response, offset, resetList);
      });
    } catch (error) {
      this._handleError(error, 'Failed to load favorite articles', 'favorites');
    } finally {
      runInAction(() => {
        this.favoritesIsLoading = false;
      });
    }
  }

  private _mergeArticlesWithoutDuplicates(
    existingArticles: Article[],
    newArticles: Article[]
  ): Article[] {
    const existingSlugs = new Set(
      existingArticles.map(article => article.slug)
    );
    const uniqueNewArticles = newArticles.filter(
      article => !existingSlugs.has(article.slug)
    );
    return [...existingArticles, ...uniqueNewArticles];
  }

  private _updateArticleInHomeList(slug: string, updatedArticle: Article) {
    this.homeArticles = this.homeArticles.map(article =>
      article.slug === slug ? updatedArticle : article
    );
  }

  private _updateArticleInFavoritesList(
    slug: string,
    updatedArticle: Article,
    wasUnfavorited: boolean
  ) {
    if (wasUnfavorited) {
      this.favoriteArticles = this.favoriteArticles.filter(
        article => article.slug !== slug
      );
    } else {
      const existingIndex = this.favoriteArticles.findIndex(
        article => article.slug === slug
      );
      if (existingIndex >= 0) {
        this.favoriteArticles[existingIndex] = updatedArticle;
      }
    }
  }

  private _handleError(
    error: unknown,
    defaultMessage: string,
    context?: 'home' | 'favorites'
  ) {
    const apiError = error as {
      response?: { data?: { errors?: ResponseErrors } };
    };
    const errorMessage = apiError?.response?.data?.errors || {
      general: [defaultMessage],
    };

    if (context === 'home') {
      this.homeErrors = errorMessage;
    } else if (context === 'favorites') {
      this.favoritesErrors = errorMessage;
    }
  }
}

export const articlesStore = new ArticlesStore();
