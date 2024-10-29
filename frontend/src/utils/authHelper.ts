import { AxiosRequestConfig } from 'axios';
import { User } from "firebase/auth";

export const getUserToken = async (user: User): Promise<string | null> => {
  const token = await user.getIdToken();
  return token;
};

export const addAuthorizationHeader = async (
  user: User,
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
