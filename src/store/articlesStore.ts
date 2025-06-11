import { makeAutoObservable, runInAction } from 'mobx';

import { FeedType } from '../constants/feedTypes';
import { ArticleService } from '../services';
import { Article, CreateArticleRequest } from '../services/types';
import { showErrorAlert } from '../utils';

import { authStore } from './authStore';
import { userStore } from './userStore';

class ArticlesStore {
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
    if (
      !this.homeIsLoading &&
      this.homeArticles.length < this.homeArticlesCount
    ) {
      await this.fetchHomeArticles(this.homeCurrentOffset + 10, false);
    }
  }

  public async refreshHomeArticles() {
    await this.fetchHomeArticles(0, true);
  }

  public async switchToGlobalFeed() {
    this.feedType = FeedType.GLOBAL;
    this.homeCurrentOffset = 0;
    await this.fetchHomeArticles(0, true);
  }

  public async switchToUserFeed() {
    this.feedType = FeedType.FEED;
    this.homeCurrentOffset = 0;
    await this.fetchHomeArticles(0, true);
  }

  public async loadFavoriteArticlesInitially() {
    await this.fetchFavoriteArticles(0, true);
  }

  public async loadMoreFavoriteArticles() {
    if (
      !this.favoritesIsLoading &&
      this.favoriteArticles.length < this.favoritesArticlesCount
    ) {
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

      runInAction(() => {
        // Add the new article to the beginning of home articles if it exists
        if (this.homeArticles.length > 0) {
          this.homeArticles.unshift(response.article);
          this.homeArticlesCount += 1;
        }
      });

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
      const response = currentlyFavorited
        ? await this.articleService.unfavoriteArticle(slug)
        : await this.articleService.favoriteArticle(slug);

      runInAction(() => {
        this.updateArticleInHomeList(slug, response.article);
        this.updateArticleInFavoritesList(
          slug,
          response.article,
          currentlyFavorited
        );
      });
    } catch {
      showErrorAlert('Failed to update article');
    }
  }

  private async fetchHomeArticles(offset: number, resetList: boolean) {
    try {
      this.homeIsLoading = true;

      const response =
        this.feedType === FeedType.GLOBAL
          ? await this.articleService.getArticles({ limit: 10, offset })
          : await this.articleService.getFeedArticles({ limit: 10, offset });

      runInAction(() => {
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
