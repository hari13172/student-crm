import { getCookie } from "typescript-cookie";

export const getAuthToken = () => {
  const tokenType = getCookie("token_type");
  const accessToken = getCookie("access_token");
  return { tokenType, accessToken };
};

export const getRefreshToken = () => {
  const tokenType = getCookie("token_type");
  const refreshToken = getCookie("refresh_token");
  return { tokenType, refreshToken };
};
