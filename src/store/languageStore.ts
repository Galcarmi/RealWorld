import { makeAutoObservable, runInAction } from 'mobx';
import * as Localization from 'expo-localization';

import i18n, { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../locales/i18n';

class LanguageStore {
  currentLanguage: SupportedLanguage = 'en';
  isLoading: boolean = true;
  isInitialized: boolean = false;

  constructor() {
    makeAutoObservable(this);
    this.initializeLanguage();
  }

  private getDeviceLanguage(): SupportedLanguage {
    const deviceLanguage = Localization.locale.split('-')[0] as SupportedLanguage;
    
    if (Object.keys(SUPPORTED_LANGUAGES).includes(deviceLanguage)) {
      return deviceLanguage;
    }
    
    return 'en';
  }

  private async initializeLanguage() {
    try {
      const languageToUse = this.getDeviceLanguage();
      
      await i18n.changeLanguage(languageToUse);
      
      runInAction(() => {
        this.currentLanguage = languageToUse;
        this.isLoading = false;
        this.isInitialized = true;
      });
    } catch (error) {
      console.warn('Failed to initialize language:', error);
      
      await i18n.changeLanguage('en');
      
      runInAction(() => {
        this.currentLanguage = 'en';
        this.isLoading = false;
        this.isInitialized = true;
      });
    }
  }

  get supportedLanguages() {
    return SUPPORTED_LANGUAGES;
  }

  get languageNames() {
    return Object.entries(SUPPORTED_LANGUAGES).reduce((acc, [key, value]) => {
      acc[key as SupportedLanguage] = value;
      return acc;
    }, {} as Record<SupportedLanguage, string>);
  }

  get supportedLanguageKeys() {
    return Object.keys(SUPPORTED_LANGUAGES) as SupportedLanguage[];
  }
}

export const languageStore = new LanguageStore(); 