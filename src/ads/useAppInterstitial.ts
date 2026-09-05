import { useCallback, useEffect } from 'react';
import { useInterstitialAd } from 'react-native-google-mobile-ads';
import { useApp } from '../context/AppContext';
import { AD_UNITS, INTERSTITIAL_RULES } from './config';

// Module-level so pacing survives remounts. Resetting these on every screen
// mount would let the frequency cap be bypassed by simply navigating.
let lastShownAt = 0;
let screenOpens = 0;

/** Call once per non-tab screen the user opens. Drives interstitial pacing. */
export function noteScreenOpen(): void {
  screenOpens += 1;
}

export function currentScreenOpens(): number {
  return screenOpens;
}

/**
 * Interstitial with this app's pacing rules applied.
 *
 * Passing `null` as the unit id when ads are removed destroys the underlying ad
 * instance, so a paying user never even loads an ad.
 */
export function useAppInterstitial() {
  const { adsRemoved } = useApp();
  const { isLoaded, isClosed, load, show } = useInterstitialAd(
    adsRemoved ? null : AD_UNITS.interstitial,
  );

  useEffect(() => {
    if (!adsRemoved) load();
  }, [adsRemoved, load]);

  // Preload the next one as soon as the user dismisses the current one.
  useEffect(() => {
    if (isClosed && !adsRemoved) load();
  }, [isClosed, adsRemoved, load]);

  /**
   * Shows an interstitial only if every pacing rule passes.
   *
   * `force` skips the "every Nth screen open" rule for genuine milestone
   * moments (a completed mala), but never skips the warm-up period or the
   * minimum interval — those exist to stop the app interrupting prayer.
   *
   * @returns whether an ad was actually shown
   */
  const maybeShow = useCallback(
    (options?: { force?: boolean }): boolean => {
      if (adsRemoved || !isLoaded) return false;
      if (screenOpens < INTERSTITIAL_RULES.warmupScreenOpens) return false;
      if (Date.now() - lastShownAt < INTERSTITIAL_RULES.minIntervalMs) return false;
      if (!options?.force && screenOpens % INTERSTITIAL_RULES.everyNScreenOpens !== 0) {
        return false;
      }

      lastShownAt = Date.now();
      show();
      return true;
    },
    [adsRemoved, isLoaded, show],
  );

  return { maybeShow };
}
