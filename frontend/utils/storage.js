import { Platform } from 'react-native';

const STORAGE_KEY_TOKEN = 'rentease_token';
const STORAGE_KEY_USER = 'rentease_user';

// Universal storage helper across React Native and Web
export const storage = {
  async setItem(key, value) {
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.localStorage.setItem(key, stringValue);
      }
      return true;
    } catch (e) {
      console.warn('Storage setItem error:', e);
      return false;
    }
  },

  async getItem(key) {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        return window.localStorage.getItem(key);
      }
      return null;
    } catch (e) {
      console.warn('Storage getItem error:', e);
      return null;
    }
  },

  async removeItem(key) {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      return true;
    } catch (e) {
      console.warn('Storage removeItem error:', e);
      return false;
    }
  },
};

export const saveAuthSession = async (token, user) => {
  await storage.setItem(STORAGE_KEY_TOKEN, token);
  await storage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
};

export const getAuthSession = async () => {
  const token = await storage.getItem(STORAGE_KEY_TOKEN);
  const userJson = await storage.getItem(STORAGE_KEY_USER);
  const user = userJson ? JSON.parse(userJson) : null;
  return { token, user };
};

export const clearAuthSession = async () => {
  await storage.removeItem(STORAGE_KEY_TOKEN);
  await storage.removeItem(STORAGE_KEY_USER);
};
