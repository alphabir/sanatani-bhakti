import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Persistent key-value storage.
 *
 * Backed by AsyncStorage, which uses SQLite on Android, the native key-value
 * store on iOS, and localStorage on web — so a single implementation persists
 * correctly on every platform the app ships to.
 */
export const Storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },
  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch {
      // A failed write must never crash a devotional flow mid-prayer.
    }
  },
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // Ignore — see setItem.
    }
  },
  /** Reads many keys in one native round-trip. Used on cold start. */
  async multiGet(keys: readonly string[]): Promise<Record<string, string | null>> {
    try {
      const pairs = await AsyncStorage.multiGet(keys as string[]);
      return Object.fromEntries(pairs);
    } catch {
      return Object.fromEntries(keys.map((k) => [k, null]));
    }
  },
};

export const STORAGE_KEYS = {
  PUNYA_POINTS: '@sanatani/punya',
  STREAK: '@sanatani/streak',
  LAST_ACTIVE: '@sanatani/lastActive',
  FAVORITES: '@sanatani/favorites',
  IS_PREMIUM: '@sanatani/premium',
  SELECTED_RASHI: '@sanatani/rashi',
  JAAP_TOTAL: '@sanatani/jaapTotal',
  USER_NAME: '@sanatani/userName',
  LANGUAGE: '@sanatani/language',
  ONBOARDING_DONE: '@sanatani/onboardingDone',
  ADS_REMOVED: '@sanatani/adsRemoved',
  AUTH_USER: '@sanatani/authUser',
  AUTH_TOKEN: '@sanatani/authToken',
  ASTRO_CREDITS: '@sanatani/astroCredits',
  IS_VIP: '@sanatani/isVip',
  TOTAL_DAKSHINA: '@sanatani/totalDakshina',
} as const;
