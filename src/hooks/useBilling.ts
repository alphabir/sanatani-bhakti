import { useCallback, useEffect, useRef, useState } from 'react';
import {
  purchaseErrorListener,
  purchaseUpdatedListener,
  type Product,
} from 'expo-iap';
import { useApp } from '../context/AppContext';
import {
  acknowledgePurchase,
  ASTRO_PACK_5_SKU,
  DAKSHINA_21_SKU,
  DAKSHINA_51_SKU,
  fetchAllStoreProducts,
  getOwnedPurchases,
  isConsumableSku,
  purchaseProduct,
  REMOVE_ADS_SKU,
  VIP_MONTHLY_SKU,
} from '../services/billing';

export interface BillingState {
  products: Product[];
  loading: boolean;
  purchasingSku: string | null;
  error: string | null;
  buy: (sku: string) => Promise<boolean>;
  restore: () => Promise<{ success: boolean; count: number; message: string }>;
  getPrice: (sku: string, fallback?: string) => string;
}

export function useBilling(): BillingState {
  const {
    setAdsRemoved,
    addAstroCredits,
    setIsVip,
    addDakshina,
    addPunya,
    syncToCloud,
  } = useApp();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [purchasingSku, setPurchasingSku] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const contextRef = useRef({
    setAdsRemoved,
    addAstroCredits,
    setIsVip,
    addDakshina,
    addPunya,
    syncToCloud,
  });
  contextRef.current = {
    setAdsRemoved,
    addAstroCredits,
    setIsVip,
    addDakshina,
    addPunya,
    syncToCloud,
  };

  // 1. Fetch live products from Google Play
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const items = await fetchAllStoreProducts();
      if (mounted) {
        setProducts(items);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // 2. Listen to purchases delivered by the Play Billing client
  useEffect(() => {
    const updateSub = purchaseUpdatedListener(async (purchase) => {
      const sku = purchase.productId;
      const isConsumable = isConsumableSku(sku);

      // Acknowledge with Google Play
      await acknowledgePurchase(purchase, isConsumable);

      // Apply in-app entitlement
      const ctx = contextRef.current;
      if (sku === REMOVE_ADS_SKU) {
        ctx.setAdsRemoved(true);
      } else if (sku === ASTRO_PACK_5_SKU) {
        ctx.addAstroCredits(5);
        ctx.addPunya(50, 'Astro Pack Purchased');
      } else if (sku === DAKSHINA_21_SKU) {
        ctx.addDakshina(21);
        ctx.addPunya(108, 'Shubh Dakshina Seva');
      } else if (sku === DAKSHINA_51_SKU) {
        ctx.addDakshina(51);
        ctx.addPunya(251, 'Maha Dakshina Seva');
      } else if (sku === VIP_MONTHLY_SKU) {
        ctx.setIsVip(true);
        ctx.setAdsRemoved(true);
        ctx.addPunya(500, 'VIP Membership Active');
      }

      // Sync entitlements to InsForge cloud
      void ctx.syncToCloud();

      setPurchasingSku(null);
      setError(null);
    });

    const errorSub = purchaseErrorListener((e) => {
      setPurchasingSku(null);
      const cancelled = String(e.code).toLowerCase().includes('cancel');
      setError(cancelled ? null : e.message || 'Transaction was not completed');
    });

    return () => {
      updateSub.remove();
      errorSub.remove();
    };
  }, []);

  // 3. Buy function
  const buy = useCallback(async (sku: string): Promise<boolean> => {
    setError(null);
    setPurchasingSku(sku);
    try {
      await purchaseProduct(sku);
      return true;
    } catch (err: any) {
      setPurchasingSku(null);
      setError(err?.message || 'Could not initiate purchase');
      return false;
    }
  }, []);

  // 4. Restore function
  const restore = useCallback(async (): Promise<{
    success: boolean;
    count: number;
    message: string;
  }> => {
    setError(null);
    setLoading(true);
    try {
      const owned = await getOwnedPurchases();
      setLoading(false);

      if (owned.length === 0) {
        return {
          success: false,
          count: 0,
          message: 'No previous purchases found for this Google account.',
        };
      }

      let restoredCount = 0;
      const ctx = contextRef.current;
      for (const p of owned) {
        if (p.productId === REMOVE_ADS_SKU) {
          ctx.setAdsRemoved(true);
          restoredCount++;
        } else if (p.productId === VIP_MONTHLY_SKU) {
          ctx.setIsVip(true);
          ctx.setAdsRemoved(true);
          restoredCount++;
        }
      }

      void ctx.syncToCloud();
      return {
        success: true,
        count: restoredCount,
        message: `Successfully restored ${restoredCount} purchase(s).`,
      };
    } catch (err: any) {
      setLoading(false);
      return {
        success: false,
        count: 0,
        message: err?.message || 'Failed to query purchases from Google Play.',
      };
    }
  }, []);

  // 5. Price helper
  const getPrice = useCallback(
    (sku: string, fallback?: string): string => {
      const p = products.find((item) => item.id === sku);
      if (p?.displayPrice) return p.displayPrice;
      if (fallback) return fallback;
      switch (sku) {
        case DAKSHINA_21_SKU:
          return '₹21';
        case DAKSHINA_51_SKU:
          return '₹51';
        case ASTRO_PACK_5_SKU:
          return '₹49';
        case VIP_MONTHLY_SKU:
          return '₹99/mo';
        case REMOVE_ADS_SKU:
          return '₹149';
        default:
          return 'Buy';
      }
    },
    [products]
  );

  return {
    products,
    loading,
    purchasingSku,
    error,
    buy,
    restore,
    getPrice,
  };
}
