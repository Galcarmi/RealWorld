interface NavigationServiceType {
  setRoot: (rootType: string, rootName: string) => void;
  navigateToMainTabs: () => void;
  navigateToAuthTabs: () => void;
}

class NavigationService implements NavigationServiceType {
  private navioInstance: any = null;

  public setNavioInstance(navio: any) {
    this.navioInstance = navio;
  }

  public setRoot(rootType: string, rootName: string) {
    if (this.navioInstance) {
      this.navioInstance.setRoot(rootType, rootName);
    }
  }

  public navigateToMainTabs() {
    this.setRoot('tabs', 'MainTabs');
  }

  public navigateToAuthTabs() {
    this.setRoot('tabs', 'AuthTabs');
  }
}

export const navigationService = new NavigationService(); 