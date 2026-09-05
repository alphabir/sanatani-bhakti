/**
 * Web stub for useAppInterstitial.
 * Interstitials are native-only and disabled in browser environments.
 */
export function noteScreenOpen(): void {}

export function currentScreenOpens(): number {
  return 0;
}

export function useAppInterstitial() {
  return {
    maybeShow: (): boolean => false,
  };
}
