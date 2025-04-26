import { getAuthToken } from "./cookieValue";

export const AuthorizedHeader = (): Record<string, string> => {
  const { tokenType, accessToken } = getAuthToken();
  if (!tokenType || !accessToken) {
    return {};
  }

  const formattedTokenType = `${tokenType.charAt(0).toUpperCase()}${tokenType.slice(1)}`;
  return tokenType && accessToken
    ? { Authorization: `${formattedTokenType} ${accessToken}` }
    : {};
};
