import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Header } from '../components/Header';
import { TabBar } from '../components/TabBar';
import { AdBanner } from '../ads/AdBanner';
import { noteScreenOpen, useAppInterstitial } from '../ads/useAppInterstitial';
import { Colors } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n';
import type { ScreenName, TabId } from '../types';
import { HomeScreen } from '../screens/HomeScreen';
import { ExploreScreen } from '../screens/ExploreScreen';
import { JaapScreen } from '../screens/JaapScreen';
import { MandirScreen } from '../screens/MandirScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { MantraDetailScreen } from '../screens/MantraDetailScreen';
import { AartiListScreen, AartiDetailScreen } from '../screens/AartiScreens';
import { ChalisaListScreen, ChalisaDetailScreen, BhajanListScreen, BhajanDetailScreen } from '../screens/ChalisaBhajanScreens';
import { PujaListScreen, PujaDetailScreen } from '../screens/PujaScreens';
import {
  RashifalScreen,
  DailyStatusScreen,
  WallpapersScreen,
  ScriptureListScreen,
  ScriptureDetailScreen,
  KnowledgeScreen,
  FavoritesScreen,
  PremiumScreen,
} from '../screens/FeatureScreens';
import {
  StotramListScreen,
  StotramDetailScreen,
  RingtoneListScreen,
  RingtoneDetailScreen,
  TempleListScreen,
  TempleDetailScreen,
  MuhuratScreen,
  FestivalHubScreen,
} from '../screens/NewFeatureScreens';
import { LanguageOnboardingScreen, LanguageSettingsScreen } from '../screens/LanguageScreen';
import { AuthScreen } from '../screens/AuthScreen';

const TAB_SCREENS: TabId[] = ['home', 'explore', 'jaap', 'mandir', 'profile'];

/**
 * Screens permitted to show a banner — an allowlist, so anything new is
 * ad-free until someone deliberately opts it in.
 *
 * Excluded on purpose:
 *  - `jaap`    — a 220px target tapped up to 1008 times in a row. A nearby ad
 *                produces accidental clicks, which AdMob treats as invalid
 *                traffic and permanently bans accounts for.
 *  - `mandir`  — full-bleed dark worship UI; an ad breaks it visually.
 *  - `premium` / `profile` — never advertise on top of the purchase flow.
 *  - prayer-text detail screens (aarti, chalisa, bhajan, stotram, scripture,
 *    mantra) — nobody should read a chalisa with an ad beside it.
 */
const BANNER_SCREENS: ReadonlySet<ScreenName> = new Set<ScreenName>([
  'home',
  'explore',
  'aarti-list',
  'chalisa-list',
  'bhajan-list',
  'stotram-list',
  'puja-list',
  'scripture-list',
  'temple-list',
  'temple-detail',
  'ringtone-list',
  'rashifal',
  'knowledge',
  'festival-hub',
  'muhurat',
  'wallpapers',
  'favorites',
]);

/**
 * Screens that must never trigger an interstitial on open, and do not count
 * toward the pacing counter.
 *
 * Interrupting someone on their way to the purchase screen costs a sale and
 * reads as extortion ("pay to make this stop"). Language settings is excluded
 * because it is a recovery flow — a user who cannot read the UI is the last
 * person who should hit a full-screen ad.
 */
const NO_INTERSTITIAL_SCREENS: ReadonlySet<ScreenName> = new Set<ScreenName>([
  'premium',
  'language-settings',
  'auth',
]);

function renderScreen(screen: ScreenName) {
  switch (screen) {
    case 'home': return <HomeScreen />;
    case 'explore': return <ExploreScreen />;
    case 'jaap': return <JaapScreen />;
    case 'mandir': return <MandirScreen />;
    case 'profile': return <ProfileScreen />;
    case 'auth': return <AuthScreen />;
    case 'mantra-detail': return <MantraDetailScreen />;
    case 'aarti-list': return <AartiListScreen />;
    case 'aarti-detail': return <AartiDetailScreen />;
    case 'chalisa-list': return <ChalisaListScreen />;
    case 'chalisa-detail': return <ChalisaDetailScreen />;
    case 'bhajan-list': return <BhajanListScreen />;
    case 'bhajan-detail': return <BhajanDetailScreen />;
    case 'puja-list': return <PujaListScreen />;
    case 'puja-detail': return <PujaDetailScreen />;
    case 'rashifal': return <RashifalScreen />;
    case 'daily-status': return <DailyStatusScreen />;
    case 'wallpapers': return <WallpapersScreen />;
    case 'scripture-list': return <ScriptureListScreen />;
    case 'scripture-detail': return <ScriptureDetailScreen />;
    case 'knowledge': return <KnowledgeScreen />;
    case 'favorites': return <FavoritesScreen />;
    case 'premium': return <PremiumScreen />;
    case 'stotram-list': return <StotramListScreen />;
    case 'stotram-detail': return <StotramDetailScreen />;
    case 'ringtone-list': return <RingtoneListScreen />;
    case 'ringtone-detail': return <RingtoneDetailScreen />;
    case 'temple-list': return <TempleListScreen />;
    case 'temple-detail': return <TempleDetailScreen />;
    case 'muhurat': return <MuhuratScreen />;
    case 'festival-hub': return <FestivalHubScreen />;
    case 'language-settings': return <LanguageSettingsWrapper />;
    default: return <HomeScreen />;
  }
}

function LanguageSettingsWrapper() {
  const { language, setLanguage } = useApp();
  return <LanguageSettingsScreen selected={language} onSelect={setLanguage} />;
}

export function RootNavigator() {
  const {
    nav, navigate, language, setLanguage, onboardingDone,
    completeOnboarding, isReady, canGoBack, goBack,
  } = useApp();
  const { t } = useTranslation();
  const [pendingLang, setPendingLang] = useState(language);
  const { maybeShow } = useAppInterstitial();

  // Held in a ref so the screen-change effect below depends on the screen
  // alone. Depending on `maybeShow` directly would re-run it whenever the ad
  // finished loading, which could show two interstitials for one navigation.
  const maybeShowRef = useRef(maybeShow);
  maybeShowRef.current = maybeShow;

  const screen = nav.screen;

  // Android hardware back button. Without this, Back quits the app from any
  // depth instead of returning to the previous screen.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack) {
        goBack();
        return true; // handled — do not exit
      }
      // Selecting a tab resets the stack, so a secondary tab has nothing to go
      // back to. Android users expect Back to return them to Home there rather
      // than quit, and only to exit from Home itself.
      if (screen !== 'home') {
        navigate('home');
        return true;
      }
      return false; // at Home, let Android close the app
    });
    return () => sub.remove();
  }, [canGoBack, goBack, screen, navigate]);

  // Count non-tab screen opens and let the interstitial pacing decide.
  useEffect(() => {
    if (TAB_SCREENS.includes(screen as TabId)) return;
    if (NO_INTERSTITIAL_SCREENS.has(screen)) return;
    noteScreenOpen();
    maybeShowRef.current();
  }, [screen]);

  if (!isReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!onboardingDone) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <StatusBar style="light" />
        <LanguageOnboardingScreen
          selected={pendingLang}
          onSelect={(code) => {
            setPendingLang(code);
            setLanguage(code);
          }}
          onContinue={completeOnboarding}
        />
      </SafeAreaView>
    );
  }

  const isTab = TAB_SCREENS.includes(screen as TabId);
  const showBack = !isTab;
  const isMandir = screen === 'mandir';

  const SCREEN_TITLES: Partial<Record<ScreenName, string>> = {
    home: t('appName'),
    explore: t('tabExplore'),
    jaap: t('jaapCounter'),
    mandir: t('tabMandir'),
    profile: t('tabProfile'),
    'mantra-detail': t('mantras'),
    'aarti-list': t('aarti'),
    'aarti-detail': t('aarti'),
    'chalisa-list': t('chalisa'),
    'chalisa-detail': t('chalisa'),
    'bhajan-list': t('bhajan'),
    'bhajan-detail': t('bhajan'),
    'puja-list': t('pujaVidhi'),
    'puja-detail': t('pujaVidhi'),
    'scripture-list': t('scriptures'),
    'scripture-detail': t('scriptures'),
    wallpapers: t('wallpapers'),
    'daily-status': t('dailyStatus'),
    rashifal: t('rashifal'),
    knowledge: t('knowledge'),
    premium: t('removeAds'),
    favorites: t('myFavorites'),
    'stotram-list': t('stotrams'),
    'stotram-detail': t('stotrams'),
    'ringtone-list': t('ringtones'),
    'ringtone-detail': t('ringtones'),
    'temple-list': t('temples'),
    'temple-detail': t('temples'),
    muhurat: t('muhurat'),
    'festival-hub': t('festivalHub'),
    'language-settings': t('changeLanguage'),
  };

  const title = SCREEN_TITLES[screen] ?? t('appName');
  const activeTab: TabId = isTab ? (screen as TabId) : 'home';

  return (
    <SafeAreaView
      style={[styles.safe, isMandir && styles.safeMandir]}
      edges={['top', 'bottom']}
    >
      <StatusBar style="light" />
      {!isMandir && <Header title={title} showBack={showBack} />}
      <View style={[styles.body, isMandir && styles.bodyMandir]}>
        {renderScreen(screen)}
      </View>
      {BANNER_SCREENS.has(screen) && <AdBanner />}
      {isTab && <TabBar active={activeTab} onTab={(tab) => navigate(tab)} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // The safe area's own background fills the status-bar strip under
  // edge-to-edge, so it has to match whatever sits directly beneath it.
  safe: { flex: 1, backgroundColor: Colors.background },
  safeMandir: { backgroundColor: '#0A0502' },
  body: { flex: 1, backgroundColor: Colors.background },
  bodyMandir: { backgroundColor: '#0A0502' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
});
