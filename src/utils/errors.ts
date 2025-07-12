import { ResponseErrors } from '../services';

import { showErrorAlert } from './alertUtils';

export const showErrorModals = (errors: ResponseErrors) => {
  Object.entries(errors).forEach(([key, value]) => {
    const message = Array.isArray(value) ? value.join(', ') : value;
    showErrorAlert(key, message);
  });
};
