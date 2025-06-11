import { NavioInstance } from '../navigation/navio';

interface NavigationServiceType {
  setRoot: (rootType: 'stacks' | 'tabs' | 'drawers', rootName: string) => void;
  navigateToMainTabs: () => void;
  navigateToAuthTabs: () => void;
  navigateToNewArticle: () => void;
  navigateToEditProfile: () => void;
  navigateToAuthorProfile: (username: string) => void;
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
    this.setRoot('tabs', 'MainTabs');
  }

  public navigateToAuthTabs() {
    this.setRoot('tabs', 'AuthTabs');
  }

  public navigateToLoginScreen() {
    this.setRoot('stacks', 'SignInStack');
  }

  public navigateToNewArticle() {
    if (this._navioInstance) {
      this._navioInstance.push('NewArticle');
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
}

export const navigationService = new NavigationService();
