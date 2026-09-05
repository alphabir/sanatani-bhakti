import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { initializeAds } from './src/ads/init';
import { useBillingEntitlementSync } from './src/hooks/useRemoveAds';

/** Restores a previous Remove Ads purchase. Must live inside AppProvider. */
function BillingSync() {
  useBillingEntitlementSync();
  return null;
}

export default function App() {
  useEffect(() => {
    // Fire-and-forget: gathers consent then starts the ads SDK. Never blocks
    // first paint — the app must open straight into worship.
    void initializeAds();
  }, []);

  return (
    <SafeAreaProvider>
      <AppProvider>
        <BillingSync />
        <RootNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}
