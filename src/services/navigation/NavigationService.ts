import { NAVIGATION_ROOT_TYPES } from '../../constants/app';

import { NavioInstance } from '../../navigation/navio';

interface NavigationServiceType {
  setRoot: (rootType: 'stacks' | 'tabs' | 'drawers', rootName: string) => void;
  navigateToMainTabs: () => void;
  navigateToAuthTabs: () => void;
  navigateToArticleForm: (slug?: string) => void;
  navigateToEditProfile: () => void;
  navigateToAuthorProfile: (username: string) => void;
  navigateToArticle: (slug: string) => void;
  goBack: () => void;
}

class NavigationService implements NavigationServiceType {
  private _navioInstance: NavioInstance | null = null;

  public setNavioInstance(navioInstance: NavioInstance) {
    this._navioInstance = navioInstance;
  }

  public setRoot(rootType: 'stacks' | 'tabs' | 'drawers', rootName: string) {
    if (this._navioInstance) {
      this._navioInstance.setRoot(rootType, rootName);
    }
  }

  public navigateToMainTabs() {
    this.setRoot(NAVIGATION_ROOT_TYPES.TABS, 'MainTabs');
  }

  public navigateToAuthTabs() {
    this.setRoot(NAVIGATION_ROOT_TYPES.TABS, 'AuthTabs');
  }

  public navigateToLoginScreen() {
    this.setRoot(NAVIGATION_ROOT_TYPES.STACKS, 'SignInStack');
  }

  public navigateToSignUpScreen() {
    this.setRoot(NAVIGATION_ROOT_TYPES.STACKS, 'SignUpStack');
  }

  public navigateToArticleForm(slug?: string) {
    if (this._navioInstance) {
      this._navioInstance.push('ArticleForm', slug ? { slug } : undefined);
    }
  }

  public navigateToEditProfile() {
    if (this._navioInstance) {
      this._navioInstance.push('EditProfile');
    }
  }

  public navigateToAuthorProfile(username: string) {
    if (this._navioInstance) {
      this._navioInstance.push('AuthorProfile', { username });
    }
  }

  public navigateToArticle(slug: string) {
    if (this._navioInstance) {
      this._navioInstance.push('Article', { slug });
    }
  }

  public goBack() {
    if (this._navioInstance) {
      this._navioInstance.goBack();
    }
  }
}

export const navigationService = new NavigationService();
