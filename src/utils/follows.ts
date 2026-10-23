const FOLLOWS_KEY = 'verdict_followed_authors';

export const getFollowedAuthors = (): string[] => {
  try {
    const raw = localStorage.getItem(FOLLOWS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const isAuthorFollowed = (idOrName: string | number): boolean => {
  const list = getFollowedAuthors();
  const key = String(idOrName).toLowerCase();
  return list.some(item => item.toLowerCase() === key);
};

export const toggleAuthorFollow = (idOrName: string | number): boolean => {
  try {
    const list = getFollowedAuthors();
    const key = String(idOrName);
    const keyLower = key.toLowerCase();
    let updated: string[];
    let newState = false;

    if (list.some(item => item.toLowerCase() === keyLower)) {
      updated = list.filter(item => item.toLowerCase() !== keyLower);
      newState = false;
    } else {
      updated = [...list, key];
      newState = true;
    }

    localStorage.setItem(FOLLOWS_KEY, JSON.stringify(updated));
    return newState;
  } catch {
    return false;
  }
};
