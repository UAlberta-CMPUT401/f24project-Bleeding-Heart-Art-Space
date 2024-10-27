import { AxiosRequestConfig } from 'axios';
import { User } from "firebase/auth";

export const getUserToken = async (user: User | null): Promise<string | null> => {
  if (user) {
    const token = await user.getIdToken();
    return token;
  }
  return null;
};

export const addAuthorizationHeader = async (
  user: User | null,
  config: AxiosRequestConfig
): Promise<AxiosRequestConfig> => {
  try {
    const token = await getUserToken(user);
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  } catch (error) {
    console.error('Error adding authorization header:', error);
    throw error;
  }
};
