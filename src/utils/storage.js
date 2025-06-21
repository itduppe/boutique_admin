const STORAGE_KEY = "site-system";

export const setSiteSystem = (site) => {
  localStorage.setItem(STORAGE_KEY, site);
};

export const getSiteSystem = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
};

export const removeSiteSystem = () => {
  localStorage.removeItem(STORAGE_KEY);
};