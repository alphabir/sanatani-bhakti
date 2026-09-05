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

export interface Festival {
  id: string;
  name: string;
  date: string;
  description: string;
  deity: DeityId;
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
