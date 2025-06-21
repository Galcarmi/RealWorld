let tokenProviderFn: (() => string | null) | null = null;

export const setGlobalTokenProvider = (provider: () => string | null): void => {
  tokenProviderFn = provider;
};

export const getToken = (): string | null => {
  return tokenProviderFn ? tokenProviderFn() : null;
};
