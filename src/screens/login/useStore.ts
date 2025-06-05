import { authStore } from '../../store/authStore';

const useStore = () => {
  const { isLoading, errors, authValues: user } = authStore;

  return {
    isLoading,
    user,
    errors,
  };
};

export { useStore };
