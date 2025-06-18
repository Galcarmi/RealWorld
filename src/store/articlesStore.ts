import { makeAutoObservable, runInAction } from 'mobx';

import { FeedType } from '../constants/feedTypes';
import { ArticleService } from '../services';
import { Article, CreateArticleRequest } from '../services/types';
import { showErrorAlert } from '../utils';

import { authStore } from './authStore';
import { IArticlesStore } from './types';
import { userStore } from './userStore';

class ArticlesStore implements IArticlesStore {
  public homeArticles: Article[] = [];
  public homeIsLoading = false;
  public homeArticlesCount = 0;
  public homeCurrentOffset = 0;
  public feedType: FeedType = FeedType.GLOBAL;

  public favoriteArticles: Article[] = [];
  public favoritesIsLoading = false;
  public favoritesArticlesCount = 0;
  public favoritesCurrentOffset = 0;

  private articleService: ArticleService;

  constructor() {
    makeAutoObservable(this);
    this.articleService = new ArticleService(authStore, userStore);
  }

  public async loadHomeArticlesInitially() {
    await this.fetchHomeArticles(0, true);
  }

  public async loadMoreHomeArticles() {
    if (this.canLoadMoreHomeArticles()) {
      await this.fetchHomeArticles(this.homeCurrentOffset + 10, false);
    }
  }

  public async refreshHomeArticles() {
    await this.fetchHomeArticles(0, true);
  }

  public async switchToGlobalFeed() {
    this.setFeedTypeAndReset(FeedType.GLOBAL);
    await this.fetchHomeArticles(0, true);
  }

  public async switchToUserFeed() {
    this.setFeedTypeAndReset(FeedType.FEED);
    await this.fetchHomeArticles(0, true);
  }

  public async loadFavoriteArticlesInitially() {
    await this.fetchFavoriteArticles(0, true);
  }

  public async loadMoreFavoriteArticles() {
    if (this.canLoadMoreFavoriteArticles()) {
      await this.fetchFavoriteArticles(this.favoritesCurrentOffset + 10, false);
    }
  }

  public async refreshFavoriteArticles() {
    await this.fetchFavoriteArticles(0, true);
  }

  public async getUserArticles(username: string, limit = 10, offset = 0) {
    try {
      const response = await this.articleService.getArticles({
        author: username,
        limit,
        offset,
      });
      return response;
    } catch {
      showErrorAlert('Failed to fetch user articles');
      throw new Error('Failed to fetch user articles');
    }
  }

  public async createArticle(articleData: CreateArticleRequest) {
    try {
      const response = await this.articleService.createArticle(articleData);
      this.addNewArticleToHomeList(response.article);
      return response.article;
    } catch {
      showErrorAlert('Failed to create article');
      throw new Error('Failed to create article');
    }
  }

  public async toggleArticleFavoriteStatus(
    slug: string,
    currentlyFavorited: boolean
  ) {
    try {
      const response = await this.performFavoriteAction(
        slug,
        currentlyFavorited
      );
      this.updateArticleAfterFavoriteToggle(
        slug,
        response.article,
        currentlyFavorited
      );
    } catch {
      showErrorAlert('Failed to update article');
    }
  }

  private canLoadMoreHomeArticles(): boolean {
    return (
      !this.homeIsLoading && this.homeArticles.length < this.homeArticlesCount
    );
  }

  private canLoadMoreFavoriteArticles(): boolean {
    return (
      !this.favoritesIsLoading &&
      this.favoriteArticles.length < this.favoritesArticlesCount
    );
  }

  private setFeedTypeAndReset(feedType: FeedType): void {
    this.feedType = feedType;
    this.homeCurrentOffset = 0;
  }

  private addNewArticleToHomeList(article: Article): void {
    runInAction(() => {
      if (this.homeArticles.length > 0) {
        this.homeArticles.unshift(article);
        this.homeArticlesCount += 1;
      }
    });
  }

  private async performFavoriteAction(
    slug: string,
    currentlyFavorited: boolean
  ) {
    return currentlyFavorited
      ? await this.articleService.unfavoriteArticle(slug)
      : await this.articleService.favoriteArticle(slug);
  }

  private updateArticleAfterFavoriteToggle(
    slug: string,
    updatedArticle: Article,
    wasUnfavorited: boolean
  ): void {
    runInAction(() => {
      this.updateArticleInHomeList(slug, updatedArticle);
      this.updateArticleInFavoritesList(slug, updatedArticle, wasUnfavorited);
    });
  }

  private async getArticlesBasedOnFeedType(limit: number, offset: number) {
    return this.feedType === FeedType.GLOBAL
      ? await this.articleService.getArticles({ limit, offset })
      : await this.articleService.getFeedArticles({ limit, offset });
  }

  private updateHomeArticlesState(
    response: { articles: Article[]; articlesCount: number },
    offset: number,
    resetList: boolean
  ): void {
    if (resetList) {
      this.homeArticles = response.articles;
      this.homeCurrentOffset = offset;
    } else {
      this.homeArticles = this.mergeArticlesWithoutDuplicates(
        this.homeArticles,
        response.articles
      );
      this.homeCurrentOffset = offset;
    }
    this.homeArticlesCount = response.articlesCount;
  }

  private updateFavoriteArticlesState(
    response: { articles: Article[]; articlesCount: number },
    offset: number,
    resetList: boolean
  ): void {
    if (resetList) {
      this.favoriteArticles = response.articles;
      this.favoritesCurrentOffset = offset;
    } else {
      this.favoriteArticles = this.mergeArticlesWithoutDuplicates(
        this.favoriteArticles,
        response.articles
      );
      this.favoritesCurrentOffset = offset;
    }
    this.favoritesArticlesCount = response.articlesCount;
  }

  private async fetchHomeArticles(offset: number, resetList: boolean) {
    try {
      this.homeIsLoading = true;
      const response = await this.getArticlesBasedOnFeedType(10, offset);

      runInAction(() => {
        this.updateHomeArticlesState(response, offset, resetList);
      });
    } catch {
      showErrorAlert('Failed to load articles');
    } finally {
      runInAction(() => {
        this.homeIsLoading = false;
      });
    }
  }

  private async fetchFavoriteArticles(offset: number, resetList: boolean) {
    if (!userStore.user?.username) {
      return;
    }

    try {
      this.favoritesIsLoading = true;

      const response = await this.articleService.getArticles({
        favorited: userStore.user.username,
        limit: 10,
        offset,
      });

      runInAction(() => {
        this.updateFavoriteArticlesState(response, offset, resetList);
      });
    } catch {
      showErrorAlert('Failed to load favorite articles');
    } finally {
      runInAction(() => {
        this.favoritesIsLoading = false;
      });
    }
  }

  private mergeArticlesWithoutDuplicates(
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

  private updateArticleInHomeList(slug: string, updatedArticle: Article) {
    this.homeArticles = this.homeArticles.map(article =>
      article.slug === slug ? updatedArticle : article
    );
  }

  private updateArticleInFavoritesList(
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
}

export const articlesStore = new ArticlesStore();
