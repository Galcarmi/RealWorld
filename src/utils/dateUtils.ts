import { DATE_FORMAT } from '../constants';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(DATE_FORMAT.LOCALE, DATE_FORMAT.OPTIONS);
};
