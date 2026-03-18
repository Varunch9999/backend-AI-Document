let cachedSummary = null;
let cachedSuggestions = null;

export const getCachedSummary = () => cachedSummary;
export const setCachedSummary = (summary) => {
  cachedSummary = summary;
};

export const getCachedSuggestions = () => cachedSuggestions;
export const setCachedSuggestions = (suggestions) => {
  cachedSuggestions = suggestions;
};

export const resetCache = () => {
  cachedSummary = null;
  cachedSuggestions = null;
};