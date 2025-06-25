import { useTranslation as useI18nTranslation } from 'react-i18next';

const useTranslation = () => {
  const { t } = useI18nTranslation();

  return {
    t,
  };
};

export { useTranslation };
