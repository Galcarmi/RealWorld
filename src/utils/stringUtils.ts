export const getInitials = (name: string, count: number): string => {
  if (!name || typeof name !== 'string') {
    return '';
  }

  const words = name.trim().split(/\s+/);
  const initials = words
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, count)
    .join('');

  return initials;
};

export const getUserInitial = (username: string): string => {
  return getInitials(username, 1);
};
