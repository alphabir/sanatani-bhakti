import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { Colors } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { AD_UNITS } from './config';

/**
 * The one place a banner is allowed to render.
 *
 * Returning null when the user owns "Remove Ads" keeps the entitlement check in
 * a single location, so no screen can accidentally leak an ad to a paying user.
 *
 * Deliberately NOT used on JaapScreen or MandirScreen — see docs/ADS.md.
 */
export function AdBanner() {
  const { adsRemoved } = useApp();
  const [failed, setFailed] = useState(false);

  if (adsRemoved || failed) return null;

  return (
    <View style={styles.wrap}>
      <BannerAd
        unitId={AD_UNITS.banner}
        size={BannerAdSize.LARGE_ANCHORED_ADAPTIVE_BANNER}
        onAdFailedToLoad={() => setFailed(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Collapses to nothing until an ad actually arrives, so an unfilled request
  // never leaves a grey gap above the tab bar.
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
});
