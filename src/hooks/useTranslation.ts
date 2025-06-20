import { useCallback } from 'react';
import { useTranslation as useI18nTranslation } from 'react-i18next';

import { languageStore } from '../store/languageStore';

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();

  const getCurrentLanguage = useCallback(() => {
    return languageStore.currentLanguage;
  }, []);

  const isRTL = useCallback((): boolean => {
    return i18n.dir() === 'rtl';
  }, [i18n]);

  return {
    t,
    getCurrentLanguage,
    isRTL,
    currentLanguage: languageStore.currentLanguage,
    isLoading: languageStore.isLoading,
    supportedLanguages: languageStore.supportedLanguageKeys,
    languageNames: languageStore.languageNames,
  };
};

export const useT = () => {
  const { t } = useTranslation();
  return t;
};

export default useTranslation;
