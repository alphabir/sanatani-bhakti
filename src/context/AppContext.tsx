import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';
import type { LanguageCode } from '../i18n/languages';
import { DEFAULT_LANGUAGE } from '../i18n/languages';
import type { NavigationState, ScreenName, TabId } from '../types';
import { Storage, STORAGE_KEYS } from '../services/storage';
import { InsForgeService } from '../services/insforge';
import { Session } from '../services/session';

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
  /**
   * True once this device has ANY server identity — including the silent guest
   * account. Almost every UI decision wants `isGuest` instead: after Phase 1B
   * this is true for everyone, so gating a "Sign in" button on it would hide
   * the button forever.
   */
  isAuthenticated: boolean;
  /** True while the identity is the device's auto-created guest account. */
  isGuest: boolean;
  authLoading: boolean;
  deleteAccount: () => Promise<{ ok: boolean; error: string | null }>;
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
  const [isGuest, setIsGuest] = useState(true);
  // Set when identity bootstrap failed (first launch with no network, which is
  // common in India). Drives a retry when the app next comes to the foreground.
  const identityPending = useRef(false);

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

      // Show the cached user immediately so Profile is not blank for a frame.
      // This is a cache, not proof of a session — bootstrapIdentity() below
      // establishes the real one.
      if (v[STORAGE_KEYS.AUTH_USER]) {
        try {
          const cached = JSON.parse(v[STORAGE_KEYS.AUTH_USER]!);
          setUser(cached);
          if (cached?.name) setUserNameState(cached.name);
        } catch {
          // ignore a corrupt cache
        }
      }

      const updated = nextStreak(v[STORAGE_KEYS.LAST_ACTIVE], storedStreak);
      if (updated === null) {
        setStreak(storedStreak);
      } else {
        setStreak(updated);
        await Storage.setItem(STORAGE_KEYS.STREAK, String(updated));
        await Storage.setItem(STORAGE_KEYS.LAST_ACTIVE, new Date().toDateString());
      }

      // First paint happens here and is never gated on the network. Everything
      // above this line is local storage only; identity comes after.
      setIsReady(true);

      void bootstrapIdentity();
    })();
  }, []);

  /**
   * Establishes this device's server identity, then reconciles with the cloud.
   *
   * Deliberately runs after `setIsReady(true)`: the README's rule is that the
   * app opens straight into worship, and a signUp round-trip in front of first
   * paint would put a spinner between the user and the app on every cold start
   * — and a 30s hang on a bad connection.
   */
  const bootstrapIdentity = useCallback(async () => {
    let account = await InsForgeService.restoreSession();
    if (!account) account = await InsForgeService.createGuest();

    if (!account) {
      // Offline first launch. Not an error the user should see — devotional
      // content is all local. Retry when the app next comes to the foreground.
      identityPending.current = true;
      return;
    }
    identityPending.current = false;

    setUser(account);
    if (account.name) setUserNameState(account.name);
    void Storage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(account));

    const row = await InsForgeService.ensureStatsRow();
    if (row) setIsGuest(row.isGuest);

    // Pull before push. Sync has always been push-only, so a second device
    // would have flattened whatever the first one earned.
    const remote = await InsForgeService.pullUserData();
    let mergedPunya = punyaPoints;
    let mergedJaap = jaapTotal;
    let mergedFavorites = favorites;
    if (remote) {
      mergedPunya = Math.max(punyaPoints, remote.punyaPoints ?? 0);
      mergedJaap = Math.max(jaapTotal, remote.jaapTotal ?? 0);
      mergedFavorites = Array.from(new Set([...favorites, ...(remote.favorites ?? [])]));
      if (typeof remote.streak === 'number') setStreak((s) => Math.max(s, remote.streak!));
      if (mergedPunya !== punyaPoints) {
        setPunyaPoints(mergedPunya);
        void Storage.setItem(STORAGE_KEYS.PUNYA_POINTS, String(mergedPunya));
      }
      if (mergedJaap !== jaapTotal) {
        setJaapTotal(mergedJaap);
        void Storage.setItem(STORAGE_KEYS.JAAP_TOTAL, String(mergedJaap));
      }
      if (mergedFavorites.length !== favorites.length) {
        setFavorites(mergedFavorites);
        void Storage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(mergedFavorites));
      }
    }

    const res = await InsForgeService.syncUserData({
      userName: userName || account.name || 'Bhakt',
      punyaPoints: mergedPunya,
      streak,
      jaapTotal: mergedJaap,
      favorites: mergedFavorites,
      language,
      adsRemoved,
      userId: account.id,
    });
    if (res.ok) setCloudSyncStatus('synced');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Retry identity when the app returns to the foreground, so a user who opened
  // the app offline gets an account as soon as they have signal — without which
  // chanting and the astrologer would stay locked out for the whole session.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active' && identityPending.current) void bootstrapIdentity();
    });
    return () => sub.remove();
  }, [bootstrapIdentity]);

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

  /**
   * Guest -> real account.
   *
   * The guest's progress needs no server-side merge: it already lives in local
   * state on this device, so pushing local values onto the new account's row
   * carries punya, jaap and favourites across. `pullUserData` first, so an
   * account that already has progress on another device is merged rather than
   * flattened.
   *
   * The guest credential is dropped so the next cold boot restores the real
   * account instead of signing back in as the guest. The guest row itself stays
   * on the server marked `is_guest`, for a later cleanup job to reap.
   */
  const completeUpgrade = useCallback(
    async (userId: string, name?: string) => {
      await Session.clearGuestCredential();
      setIsGuest(false);

      const remote = await InsForgeService.pullUserData();
      const mergedPunya = Math.max(punyaPoints, remote?.punyaPoints ?? 0);
      const mergedJaap = Math.max(jaapTotal, remote?.jaapTotal ?? 0);
      const mergedFavorites = Array.from(new Set([...favorites, ...(remote?.favorites ?? [])]));

      if (mergedPunya !== punyaPoints) {
        setPunyaPoints(mergedPunya);
        void Storage.setItem(STORAGE_KEYS.PUNYA_POINTS, String(mergedPunya));
      }
      if (mergedJaap !== jaapTotal) {
        setJaapTotal(mergedJaap);
        void Storage.setItem(STORAGE_KEYS.JAAP_TOTAL, String(mergedJaap));
      }
      if (mergedFavorites.length !== favorites.length) {
        setFavorites(mergedFavorites);
        void Storage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(mergedFavorites));
      }

      await InsForgeService.ensureStatsRow();
      const res = await InsForgeService.syncUserData({
        userName: name || userName,
        punyaPoints: mergedPunya,
        streak,
        jaapTotal: mergedJaap,
        favorites: mergedFavorites,
        language,
        adsRemoved,
        userId,
      });
      setCloudSyncStatus(res.ok ? 'synced' : 'error');
    },
    [userName, punyaPoints, streak, jaapTotal, favorites, language, adsRemoved],
  );

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
      await completeUpgrade(res.user.id, res.user.name);
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
      await completeUpgrade(res.user.id, name || res.user.name);
      return { ok: true };
    } finally {
      setAuthLoading(false);
    }
  }, [userName, punyaPoints, streak, jaapTotal, favorites, language, adsRemoved]);

  /**
   * Signing out drops the real account and returns the device to a fresh guest,
   * rather than leaving it with no identity at all — otherwise chanting and the
   * astrologer would 401 until the next cold start.
   */
  const logout = useCallback(async () => {
    setAuthLoading(true);
    try {
      await InsForgeService.signOut();
      setUser(null);
      setIsGuest(true);
      await Storage.removeItem(STORAGE_KEYS.AUTH_USER);
      await Storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await bootstrapIdentity();
    } finally {
      setAuthLoading(false);
    }
  }, [bootstrapIdentity]);

  const deleteAccount = useCallback(async (): Promise<{ ok: boolean; error: string | null }> => {
    setAuthLoading(true);
    try {
      const res = await InsForgeService.deleteAccount();
      if (res.ok) {
        setUser(null);
        setIsGuest(true);
        await Storage.removeItem(STORAGE_KEYS.AUTH_USER);
        await Storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      }
      return res;
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
      isGuest,
      authLoading,
      login,
      register,
      logout,
      deleteAccount,
    }),
    [
      nav, navStack.length, navigate, goBack, punyaPoints, addPunya, streak,
      adsRemoved, setAdsRemoved, astroCredits, isVip, totalDakshina,
      useAstroCredit, addAstroCredits, setIsVip, addDakshina, favorites,
      toggleFavorite, selectedRashi, setSelectedRashi, jaapTotal, addJaap,
      userName, setUserName, mandirFlowers, mandirDiyas, offerFlower, lightDiya,
      language, setLanguage, onboardingDone, completeOnboarding, isReady,
      cloudSyncStatus, syncToCloud, user, isGuest, authLoading, login, register, logout,
      deleteAccount,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
