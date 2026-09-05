import { TestIds } from 'react-native-google-mobile-ads';

/**
 * Ad identity lives here and nowhere else.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * TODO(you): replace the two PRODUCTION_* values below with your real AdMob ad
 * unit IDs once your AdMob account exists, and replace `androidAppId` in
 * app.json with your real App ID (the one shaped `ca-app-pub-XXXX~YYYY`).
 * Until then the app serves Google's official test ads, which render exactly
 * like real ones but earn nothing and are safe to click.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * NEVER point a development build at a live ad unit. Impressions and clicks you
 * generate yourself are "invalid traffic" and Google permanently bans AdMob
 * accounts for it — including on a first offence. The `__DEV__` switch below is
 * the guard that prevents this, so do not remove it.
 */

const PRODUCTION_BANNER_ID = 'ca-app-pub-0000000000000000/0000000000';
const PRODUCTION_INTERSTITIAL_ID = 'ca-app-pub-0000000000000000/0000000000';

/** True while the production IDs are still placeholders. */
export const USING_TEST_ADS =
  __DEV__ || PRODUCTION_BANNER_ID.startsWith('ca-app-pub-0000');

export const AD_UNITS = {
  banner: USING_TEST_ADS ? TestIds.BANNER : PRODUCTION_BANNER_ID,
  interstitial: USING_TEST_ADS ? TestIds.INTERSTITIAL : PRODUCTION_INTERSTITIAL_ID,
} as const;

/**
 * Interstitial pacing. A devotional app that interrupts prayer gets uninstalled,
 * so these are deliberately conservative.
 */
export const INTERSTITIAL_RULES = {
  /** Minimum gap between two interstitials. */
  minIntervalMs: 90_000,
  /** Show nothing at all until the user has opened this many detail screens. */
  warmupScreenOpens: 5,
  /** Outside of jaap completion, show at most one per this many screen opens. */
  everyNScreenOpens: 8,
} as const;
