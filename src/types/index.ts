import type { DeityId } from '../constants/theme';

export interface Mantra {
  id: string;
  title: string;
  titleHindi: string;
  deity: DeityId;
  sanskrit: string;
  transliteration: string;
  meaning: string;
  meaningHindi: string;
  benefits: string;
}

export interface Aarti {
  id: string;
  title: string;
  deity: DeityId;
  lyrics: string[];
  meaning?: string;
}

export interface Chalisa {
  id: string;
  title: string;
  deity: DeityId;
  doha: string[];
  chaupai: string[];
}

export interface Bhajan {
  id: string;
  title: string;
  deity: DeityId;
  lyrics: string[];
}

export interface PujaStep {
  order: number;
  title: string;
  description: string;
}

export interface PujaGuide {
  id: string;
  title: string;
  festival?: string;
  deity: DeityId;
  duration: string;
  samagri: string[];
  steps: PujaStep[];
}

export interface Scripture {
  id: string;
  title: string;
  category: 'gita' | 'ramayan' | 'puran' | 'stotra' | 'katha';
  chapters?: number;
  excerpt: string;
}

export interface Wallpaper {
  id: string;
  title: string;
  deity: DeityId;
  gradient: [string, string];
}

export interface DailyStatus {
  id: string;
  quote: string;
  quoteHindi: string;
  author?: string;
  deity: DeityId;
}

export interface Rashifal {
  rashi: string;
  rashiHindi: string;
  symbol: string;
  prediction: string;
  predictionHindi: string;
  luckyColor: string;
  luckyNumber: number;
}

export interface KnowledgeCard {
  id: string;
  title: string;
  content: string;
  deity?: DeityId;
}

/**
 * How strongly a festival is observed. `not-observed` removes the row for a
 * region entirely rather than ranking it low.
 */
export type Prominence = 'headline' | 'major' | 'observed' | 'not-observed';

/**
 * One year's observance.
 *
 * Usually a plain ISO date. The object form exists because some observances
 * genuinely have two defensible dates in the same year — Durga Ashtami 2026
 * falls on 18 Oct by the Bengali panjika and pandal schedule but 19 Oct under
 * the strict sunrise-tithi rule. Showing one and hiding the other is worse
 * than showing both, so the data can carry the alternative and a note.
 */
export type FestivalDate = string | { date: string; altDate?: string; note?: string };

export interface Festival {
  id: string;
  /** Pan-India English name. Always present — the universal safe fallback. */
  name: string;
  nameHindi?: string;
  description: string;
  deity: DeityId;
  /**
   * Gregorian start date per year: `{ 2026: '2026-11-08', 2027: '...' }`.
   *
   * Keyed by year rather than a single `date` deliberately: a single-year field
   * is what let every festival in this app silently expire, leaving the
   * Festival Hub rendering an empty screen. Author at least two years ahead and
   * re-check before the last one runs out.
   */
  dates: Record<number, FestivalDate>;
  /** Observance length in days, including the start day. Default 1. */
  spanDays?: number;
  prominence: Prominence;
}

/** A festival resolved to one concrete year, which is what screens render. */
export interface ResolvedFestival {
  id: string;
  name: string;
  nameHindi?: string;
  description: string;
  deity: DeityId;
  /** ISO `YYYY-MM-DD`. Compared and sorted as a string, so the format matters. */
  date: string;
  /** Set only where a second date is equally defensible. */
  altDate?: string;
  note?: string;
  spanDays?: number;
  prominence: Prominence;
}

export type TabId = 'home' | 'explore' | 'jaap' | 'mandir' | 'profile';

export type ScreenName =
  | TabId
  | 'mantra-detail'
  | 'aarti-list'
  | 'aarti-detail'
  | 'chalisa-list'
  | 'chalisa-detail'
  | 'bhajan-list'
  | 'bhajan-detail'
  | 'puja-list'
  | 'puja-detail'
  | 'scripture-list'
  | 'scripture-detail'
  | 'wallpapers'
  | 'daily-status'
  | 'rashifal'
  | 'knowledge'
  | 'premium'
  | 'favorites'
  | 'stotram-list'
  | 'stotram-detail'
  | 'ringtone-list'
  | 'ringtone-detail'
  | 'temple-list'
  | 'temple-detail'
  | 'muhurat'
  | 'festival-hub'
  | 'language-settings'
  | 'auth';

export interface NavigationState {
  screen: ScreenName;
  params?: Record<string, string>;
}
