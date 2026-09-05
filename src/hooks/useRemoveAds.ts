import { useCallback, useEffect, useRef, useState } from 'react';
import { purchaseErrorListener, purchaseUpdatedListener, type Product } from 'expo-iap';
import { useApp } from '../context/AppContext';
import {
  acknowledgePurchase,
  fetchRemoveAdsProduct,
  ownsRemoveAds,
  purchaseRemoveAds,
  REMOVE_ADS_SKU,
} from '../services/billing';

/**
 * Restores the Remove Ads entitlement at launch.
 *
 * Without this, a user who reinstalls the app — or clears its data — would see
 * ads again despite having paid. Play expects entitlements to survive both.
 */
export function useBillingEntitlementSync(): void {
  const { setAdsRemoved } = useApp();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const owned = await ownsRemoveAds();
      // Only ever grant here. A transient store failure returns false, and we
      // must not revoke a paid user's ad-free status because Play was offline.
      if (!cancelled && owned) setAdsRemoved(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [setAdsRemoved]);
}

export type PurchaseAvailability = 'checking' | 'available' | 'unavailable' | 'owned';

/** Drives the Remove Ads purchase screen. */
export function useRemoveAds() {
  const { adsRemoved, setAdsRemoved } = useApp();
  const [product, setProduct] = useState<Product | null>(null);
  const [availability, setAvailability] = useState<PurchaseAvailability>('checking');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setAdsRemovedRef = useRef(setAdsRemoved);
  setAdsRemovedRef.current = setAdsRemoved;

  // The purchase result arrives here, not from requestPurchase().
  useEffect(() => {
    const updated = purchaseUpdatedListener(async (purchase) => {
      if (purchase.productId !== REMOVE_ADS_SKU) return;
      if (purchase.purchaseState !== 'purchased') return;

      await acknowledgePurchase(purchase);
      setAdsRemovedRef.current(true);
      setAvailability('owned');
      setBusy(false);
      setError(null);
    });

    const failed = purchaseErrorListener((e) => {
      setBusy(false);
      // A user-cancelled purchase is not an error worth showing.
      const cancelled = String(e.code).toLowerCase().includes('cancel');
      setError(cancelled ? null : e.message || 'Purchase failed');
    });

    return () => {
      updated.remove();
      failed.remove();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (adsRemoved) {
        if (!cancelled) setAvailability('owned');
        return;
      }
      const found = await fetchRemoveAdsProduct();
      if (cancelled) return;
      setProduct(found);
      setAvailability(found ? 'available' : 'unavailable');
    })();
    return () => {
      cancelled = true;
    };
  }, [adsRemoved]);

  const buy = useCallback(async () => {
    setError(null);
    setBusy(true);
    try {
      await purchaseRemoveAds();
      // Outcome arrives on the listener above; keep `busy` until it does.
    } catch (e) {
      setBusy(false);
      setError(e instanceof Error ? e.message : 'Purchase could not be started');
    }
  }, []);

  const restore = useCallback(async () => {
    setError(null);
    setBusy(true);
    const owned = await ownsRemoveAds();
    setBusy(false);
    if (owned) {
      setAdsRemovedRef.current(true);
      setAvailability('owned');
    } else {
      setError('No previous purchase found for this Google account.');
    }
  }, []);

  return {
    /** Store-localised price string, e.g. "₹149.00". Null until loaded. */
    price: product?.displayPrice ?? null,
    availability,
    busy,
    error,
    buy,
    restore,
  };
}
