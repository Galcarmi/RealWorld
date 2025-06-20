import { initReactI18next } from 'react-i18next';

import i18n from 'i18next';

import * as Localization from 'expo-localization';

import en from './translations/en.json';
import es from './translations/es.json';
import fr from './translations/fr.json';

export const SUPPORTED_LANGUAGES = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

const getDeviceLanguage = (): SupportedLanguage => {
  const deviceLanguage = Localization.locale.split('-')[0] as SupportedLanguage;

  if (Object.keys(SUPPORTED_LANGUAGES).includes(deviceLanguage)) {
    return deviceLanguage;
  }

  return 'en';
};

const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
  fr: {
    translation: fr,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: getDeviceLanguage(),
  fallbackLng: 'en',
  debug: __DEV__,

  interpolation: {
    escapeValue: false,
  },

  react: {
    useSuspense: false,
  },
});

export default i18n;
