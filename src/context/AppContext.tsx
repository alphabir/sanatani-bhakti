import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { LanguageCode } from '../i18n/languages';
import { DEFAULT_LANGUAGE } from '../i18n/languages';
import type { NavigationState, ScreenName, TabId } from '../types';
import { Storage, STORAGE_KEYS } from '../services/storage';
import { InsForgeService } from '../services/insforge';

const TAB_SCREENS: TabId[] = ['home', 'explore', 'jaap', 'mandir', 'profile'];

interface AppContextValue {
  nav: NavigationState;
  navigate: (screen: ScreenName, params?: Record<string, string>) => void;
  goBack: () => void;
  /** True when the nav stack has somewhere to return to. Drives the Android back button. */
  canGoBack: boolean;
  punyaPoints: number;
  addPunya: (points: number, reason?: string) => void;
  streak: number;
  /**
   * Whether the user has bought the one-time "Remove Ads" product.
   * This controls ads ONLY — every piece of devotional content is free.
   */
  adsRemoved: boolean;
  setAdsRemoved: (v: boolean) => void;
  astroCredits: number;
  isVip: boolean;
  totalDakshina: number;
  useAstroCredit: () => boolean;
  addAstroCredits: (amount: number) => void;
  setIsVip: (active: boolean) => void;
  addDakshina: (amount: number) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  selectedRashi: number;
  setSelectedRashi: (i: number) => void;
  jaapTotal: number;
  addJaap: (count: number) => void;
  userName: string;
  setUserName: (name: string) => void;
  mandirFlowers: number;
  mandirDiyas: number;
  offerFlower: () => void;
  lightDiya: () => void;
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  onboardingDone: boolean;
  completeOnboarding: () => void;
  isReady: boolean;
  cloudSyncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  syncToCloud: () => Promise<boolean>;
  user: import('../services/insforge').AuthUser | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (email: string, password: string, name?: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

/** Computes the streak for today from the last-active date, without touching state. */
function nextStreak(lastActive: string | null, storedStreak: number): number | null {
  const today = new Date().toDateString();
  if (lastActive === today) return null; // already counted today

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return lastActive === yesterday.toDateString() ? storedStreak + 1 : 1;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [navStack, setNavStack] = useState<NavigationState[]>([{ screen: 'home' }]);
  const [punyaPoints, setPunyaPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [adsRemoved, setAdsRemovedState] = useState(false);
  const [astroCredits, setAstroCreditsState] = useState(3);
  const [isVip, setIsVipState] = useState(false);
  const [totalDakshina, setTotalDakshinaState] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedRashi, setSelectedRashiState] = useState(0);
  const [jaapTotal, setJaapTotal] = useState(0);
  const [userName, setUserNameState] = useState('Bhakt');
  const [mandirFlowers, setMandirFlowers] = useState(0);
  const [mandirDiyas, setMandirDiyas] = useState(0);
  const [language, setLanguageState] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [user, setUser] = useState<import('../services/insforge').AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const nav = navStack[navStack.length - 1]!;

  useEffect(() => {
    (async () => {
      const v = await Storage.multiGet(Object.values(STORAGE_KEYS));

      const storedStreak = parseInt(v[STORAGE_KEYS.STREAK] || '0', 10);
      if (v[STORAGE_KEYS.PUNYA_POINTS]) setPunyaPoints(parseInt(v[STORAGE_KEYS.PUNYA_POINTS]!, 10));
      if (v[STORAGE_KEYS.FAVORITES]) {
        try {
          setFavorites(JSON.parse(v[STORAGE_KEYS.FAVORITES]!));
        } catch {
          setFavorites([]);
        }
      }
      if (v[STORAGE_KEYS.ADS_REMOVED] === 'true') setAdsRemovedState(true);
      if (v[STORAGE_KEYS.ASTRO_CREDITS] !== null && v[STORAGE_KEYS.ASTRO_CREDITS] !== undefined) {
        setAstroCreditsState(parseInt(v[STORAGE_KEYS.ASTRO_CREDITS]!, 10));
      } else {
        setAstroCreditsState(3);
        void Storage.setItem(STORAGE_KEYS.ASTRO_CREDITS, '3');
      }
      if (v[STORAGE_KEYS.IS_VIP] === 'true') {
        setIsVipState(true);
        setAdsRemovedState(true);
      }
      if (v[STORAGE_KEYS.TOTAL_DAKSHINA]) {
        setTotalDakshinaState(parseInt(v[STORAGE_KEYS.TOTAL_DAKSHINA]!, 10));
      }
      if (v[STORAGE_KEYS.SELECTED_RASHI]) setSelectedRashiState(parseInt(v[STORAGE_KEYS.SELECTED_RASHI]!, 10));
      if (v[STORAGE_KEYS.JAAP_TOTAL]) setJaapTotal(parseInt(v[STORAGE_KEYS.JAAP_TOTAL]!, 10));
      if (v[STORAGE_KEYS.USER_NAME]) setUserNameState(v[STORAGE_KEYS.USER_NAME]!);
      if (v[STORAGE_KEYS.LANGUAGE]) setLanguageState(v[STORAGE_KEYS.LANGUAGE] as LanguageCode);
      if (v[STORAGE_KEYS.ONBOARDING_DONE] === 'true') setOnboardingDone(true);

      let initialUser: import('../services/insforge').AuthUser | null = null;
      if (v[STORAGE_KEYS.AUTH_USER]) {
        try {
          initialUser = JSON.parse(v[STORAGE_KEYS.AUTH_USER]!);
          setUser(initialUser);
          if (initialUser?.name) setUserNameState(initialUser.name);
        } catch {
          initialUser = null;
        }
      }

      // Check live InsForge session
      InsForgeService.getCurrentUser().then((remoteUser) => {
        if (remoteUser) {
          setUser(remoteUser);
          if (remoteUser.name) setUserNameState(remoteUser.name);
          void Storage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(remoteUser));
        }
      }).catch(() => {});

      const updated = nextStreak(v[STORAGE_KEYS.LAST_ACTIVE], storedStreak);
      if (updated === null) {
        setStreak(storedStreak);
      } else {
        setStreak(updated);
        await Storage.setItem(STORAGE_KEYS.STREAK, String(updated));
        await Storage.setItem(STORAGE_KEYS.LAST_ACTIVE, new Date().toDateString());
      }

      setIsReady(true);

      // Background sync to InsForge cloud with unique user ID if available
      void InsForgeService.syncUserData({
        userName: v[STORAGE_KEYS.USER_NAME] || initialUser?.name || 'Bhakt',
        punyaPoints: parseInt(v[STORAGE_KEYS.PUNYA_POINTS] || '0', 10),
        streak: updated ?? storedStreak,
        jaapTotal: parseInt(v[STORAGE_KEYS.JAAP_TOTAL] || '0', 10),
        favorites: v[STORAGE_KEYS.FAVORITES] ? JSON.parse(v[STORAGE_KEYS.FAVORITES]!) : [],
        language: (v[STORAGE_KEYS.LANGUAGE] as LanguageCode) || DEFAULT_LANGUAGE,
        adsRemoved: v[STORAGE_KEYS.ADS_REMOVED] === 'true',
        userId: initialUser?.id,
      }).then((res) => {
        if (res.ok) setCloudSyncStatus('synced');
      });
    })();
  }, []);

  const navigate = useCallback((screen: ScreenName, params?: Record<string, string>) => {
    if (TAB_SCREENS.includes(screen as TabId)) {
      setNavStack([{ screen, params }]);
    } else {
      setNavStack((prev) => [...prev, { screen, params }]);
    }
  }, []);

  const goBack = useCallback(() => {
    setNavStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const addPunya = useCallback((points: number) => {
    setPunyaPoints((prev) => {
      const next = prev + points;
      Storage.setItem(STORAGE_KEYS.PUNYA_POINTS, String(next));
      return next;
    });
  }, []);

  const setAdsRemoved = useCallback(async (v: boolean) => {
    setAdsRemovedState(v);
    await Storage.setItem(STORAGE_KEYS.ADS_REMOVED, String(v));
  }, []);

  const toggleFavorite = useCallback(async (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      Storage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(next));
      return next;
    });
  }, []);

  const setSelectedRashi = useCallback(async (i: number) => {
    setSelectedRashiState(i);
    await Storage.setItem(STORAGE_KEYS.SELECTED_RASHI, String(i));
  }, []);

  const addJaap = useCallback((count: number) => {
    setJaapTotal((prev) => {
      const next = prev + count;
      Storage.setItem(STORAGE_KEYS.JAAP_TOTAL, String(next));
      return next;
    });
    addPunya(Math.floor(count / 10) + 1);
  }, [addPunya]);

  const setUserName = useCallback(async (name: string) => {
    setUserNameState(name);
    await Storage.setItem(STORAGE_KEYS.USER_NAME, name);
  }, []);

  const setLanguage = useCallback(async (code: LanguageCode) => {
    setLanguageState(code);
    await Storage.setItem(STORAGE_KEYS.LANGUAGE, code);
  }, []);

  const completeOnboarding = useCallback(async () => {
    setOnboardingDone(true);
    await Storage.setItem(STORAGE_KEYS.ONBOARDING_DONE, 'true');
  }, []);

  const syncToCloud = useCallback(async (): Promise<boolean> => {
    setCloudSyncStatus('syncing');
    const res = await InsForgeService.syncUserData({
      userName,
      punyaPoints,
      streak,
      jaapTotal,
      favorites,
      language,
      adsRemoved,
      userId: user?.id,
    });
    setCloudSyncStatus(res.ok ? 'synced' : 'error');
    return res.ok;
  }, [userName, punyaPoints, streak, jaapTotal, favorites, language, adsRemoved, user?.id]);

  const login = useCallback(async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    setAuthLoading(true);
    try {
      const res = await InsForgeService.signIn({ email, password });
      if (res.error || !res.user) {
        return { ok: false, error: res.error || 'Failed to sign in' };
      }
      setUser(res.user);
      if (res.user.name) {
        setUserNameState(res.user.name);
        void Storage.setItem(STORAGE_KEYS.USER_NAME, res.user.name);
      }
      await Storage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(res.user));
      if (res.accessToken) {
        await Storage.setItem(STORAGE_KEYS.AUTH_TOKEN, res.accessToken);
      }
      // Sync user data to link unique user ID
      void InsForgeService.syncUserData({
        userName: res.user.name || userName,
        punyaPoints,
        streak,
        jaapTotal,
        favorites,
        language,
        adsRemoved,
        userId: res.user.id,
      });
      return { ok: true };
    } finally {
      setAuthLoading(false);
    }
  }, [userName, punyaPoints, streak, jaapTotal, favorites, language, adsRemoved]);

  const register = useCallback(async (email: string, password: string, name?: string): Promise<{ ok: boolean; error?: string }> => {
    setAuthLoading(true);
    try {
      const res = await InsForgeService.signUp({ email, password, name });
      if (res.error || !res.user) {
        return { ok: false, error: res.error || 'Failed to register account' };
      }
      setUser(res.user);
      if (name) {
        setUserNameState(name);
        void Storage.setItem(STORAGE_KEYS.USER_NAME, name);
      }
      await Storage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(res.user));
      if (res.accessToken) {
        await Storage.setItem(STORAGE_KEYS.AUTH_TOKEN, res.accessToken);
      }
      void InsForgeService.syncUserData({
        userName: name || userName,
        punyaPoints,
        streak,
        jaapTotal,
        favorites,
        language,
        adsRemoved,
        userId: res.user.id,
      });
      return { ok: true };
    } finally {
      setAuthLoading(false);
    }
  }, [userName, punyaPoints, streak, jaapTotal, favorites, language, adsRemoved]);

  const logout = useCallback(async () => {
    setAuthLoading(true);
    try {
      await InsForgeService.signOut();
      setUser(null);
      await Storage.removeItem(STORAGE_KEYS.AUTH_USER);
      await Storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const offerFlower = useCallback(() => {
    setMandirFlowers((n) => n + 1);
    addPunya(5);
  }, [addPunya]);

  const lightDiya = useCallback(() => {
    setMandirDiyas((n) => n + 1);
    addPunya(10);
  }, [addPunya]);

  const useAstroCredit = useCallback((): boolean => {
    if (isVip) return true;
    if (astroCredits <= 0) return false;
    setAstroCreditsState((prev) => {
      const next = Math.max(0, prev - 1);
      void Storage.setItem(STORAGE_KEYS.ASTRO_CREDITS, String(next));
      return next;
    });
    return true;
  }, [isVip, astroCredits]);

  const addAstroCredits = useCallback((amount: number) => {
    setAstroCreditsState((prev) => {
      const next = prev + amount;
      void Storage.setItem(STORAGE_KEYS.ASTRO_CREDITS, String(next));
      return next;
    });
  }, []);

  const setIsVip = useCallback(async (active: boolean) => {
    setIsVipState(active);
    await Storage.setItem(STORAGE_KEYS.IS_VIP, String(active));
    if (active) {
      setAdsRemovedState(true);
      await Storage.setItem(STORAGE_KEYS.ADS_REMOVED, 'true');
    }
  }, []);

  const addDakshina = useCallback((amount: number) => {
    setTotalDakshinaState((prev) => {
      const next = prev + amount;
      void Storage.setItem(STORAGE_KEYS.TOTAL_DAKSHINA, String(next));
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      nav,
      navigate,
      goBack,
      canGoBack: navStack.length > 1,
      punyaPoints,
      addPunya,
      streak,
      adsRemoved,
      setAdsRemoved,
      astroCredits,
      isVip,
      totalDakshina,
      useAstroCredit,
      addAstroCredits,
      setIsVip,
      addDakshina,
      favorites,
      toggleFavorite,
      selectedRashi,
      setSelectedRashi,
      jaapTotal,
      addJaap,
      userName,
      setUserName,
      mandirFlowers,
      mandirDiyas,
      offerFlower,
      lightDiya,
      language,
      setLanguage,
      onboardingDone,
      completeOnboarding,
      isReady,
      cloudSyncStatus,
      syncToCloud,
      user,
      isAuthenticated: Boolean(user),
      authLoading,
      login,
      register,
      logout,
    }),
    [
      nav, navStack.length, navigate, goBack, punyaPoints, addPunya, streak,
      adsRemoved, setAdsRemoved, astroCredits, isVip, totalDakshina,
      useAstroCredit, addAstroCredits, setIsVip, addDakshina, favorites,
      toggleFavorite, selectedRashi, setSelectedRashi, jaapTotal, addJaap,
      userName, setUserName, mandirFlowers, mandirDiyas, offerFlower, lightDiya,
      language, setLanguage, onboardingDone, completeOnboarding, isReady,
      cloudSyncStatus, syncToCloud, user, authLoading, login, register, logout,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
