import { makeAutoObservable, runInAction } from 'mobx';

import * as Localization from 'expo-localization';

import i18n, {
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from '../locales/i18n';
import { Logger } from '../utils';

class LanguageStore {
  currentLanguage: SupportedLanguage = 'en';
  isLoading: boolean = true;
  isInitialized: boolean = false;

  constructor() {
    makeAutoObservable(this);
    this._initializeLanguage();
  }

  private _getDeviceLanguage(): SupportedLanguage {
    const deviceLanguage = Localization.locale.split(
      '-'
    )[0] as SupportedLanguage;

    if (Object.keys(SUPPORTED_LANGUAGES).includes(deviceLanguage)) {
      return deviceLanguage;
    }

    return 'en';
  }

  private async _initializeLanguage() {
    try {
      const languageToUse = this._getDeviceLanguage();

      await i18n.changeLanguage(languageToUse);

      runInAction(() => {
        this.currentLanguage = languageToUse;
        this.isLoading = false;
        this.isInitialized = true;
      });
    } catch (error) {
      Logger.warn('Failed to initialize language:', error);

      await i18n.changeLanguage('en');

      runInAction(() => {
        this.currentLanguage = 'en';
        this.isLoading = false;
        this.isInitialized = true;
      });
    }
  }
}

export const languageStore = new LanguageStore();
