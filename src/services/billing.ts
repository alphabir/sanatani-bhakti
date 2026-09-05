import {
  endConnection,
  fetchProducts,
  finishTransaction,
  getAvailablePurchases,
  initConnection,
  requestPurchase,
  type Product,
  type Purchase,
} from 'expo-iap';

/**
 * Google Play Store SKUs for Sanatani Bhakti & Vedic Jyotish:
 *
 * 1. remove_ads: One-time non-consumable removing every banner and interstitial ad.
 * 2. astro_questions_pack_5: Consumable pack of 5 Deep Vedic Jyotish AI questions.
 * 3. shubh_dakshina_21: Consumable voluntary offering after 108 Jaap / Mandir Seva (+108 Punya).
 * 4. shubh_dakshina_51: Consumable voluntary offering (+251 Punya).
 * 5. sadhak_vip_monthly: Auto-renewing subscription for unlimited AI Jyotish, ElevenLabs HD recitation & Ad-free.
 */
export const REMOVE_ADS_SKU = 'remove_ads';
export const ASTRO_PACK_5_SKU = 'astro_questions_pack_5';
export const DAKSHINA_21_SKU = 'shubh_dakshina_21';
export const DAKSHINA_51_SKU = 'shubh_dakshina_51';
export const VIP_MONTHLY_SKU = 'sadhak_vip_monthly';

export const ALL_IN_APP_SKUS = [
  REMOVE_ADS_SKU,
  ASTRO_PACK_5_SKU,
  DAKSHINA_21_SKU,
  DAKSHINA_51_SKU,
];

export const ALL_SUBSCRIPTION_SKUS = [
  VIP_MONTHLY_SKU,
];

export const ALL_SKUS = [...ALL_IN_APP_SKUS, ...ALL_SUBSCRIPTION_SKUS];

export function isConsumableSku(sku: string): boolean {
  return (
    sku === ASTRO_PACK_5_SKU ||
    sku === DAKSHINA_21_SKU ||
    sku === DAKSHINA_51_SKU
  );
}

let connected = false;

/** Opens the Play Billing connection safely. */
export async function connectStore(): Promise<boolean> {
  if (connected) return true;
  try {
    await initConnection();
    connected = true;
    return true;
  } catch (error) {
    if (__DEV__) console.warn('[billing] connection failed:', error);
    return false;
  }
}

export async function disconnectStore(): Promise<void> {
  if (!connected) return;
  try {
    await endConnection();
  } catch {
    // Teardown fallback
  }
  connected = false;
}

/**
 * Fetches all available in-app and subscription products from the store.
 * Always returns whatever products Google Play successfully returns;
 * never throws, falling back to empty list if offline or products aren't published yet.
 */
export async function fetchAllStoreProducts(): Promise<Product[]> {
  if (!(await connectStore())) return [];
  try {
    const [inAppProducts, subProducts] = await Promise.all([
      fetchProducts({ skus: ALL_IN_APP_SKUS, type: 'in-app' }).catch(() => []),
      fetchProducts({ skus: ALL_SUBSCRIPTION_SKUS, type: 'subs' }).catch(() => []),
    ]);

    const combined: Product[] = [
      ...((inAppProducts ?? []) as Product[]),
      ...((subProducts ?? []) as Product[]),
    ];
    return combined;
  } catch (error) {
    if (__DEV__) console.warn('[billing] fetchAllStoreProducts error:', error);
    return [];
  }
}

/**
 * Fetches the Remove Ads product (backwards compatibility).
 */
export async function fetchRemoveAdsProduct(): Promise<Product | null> {
  const all = await fetchAllStoreProducts();
  return all.find((p) => p.id === REMOVE_ADS_SKU) ?? null;
}

/**
 * Initiates the Google Play native purchase flow for any configured SKU.
 * Result arrives asynchronously on purchase listeners.
 */
export async function purchaseProduct(sku: string): Promise<void> {
  if (!(await connectStore())) throw new Error('Google Play Store unavailable');

  const isSub = ALL_SUBSCRIPTION_SKUS.includes(sku);
  await requestPurchase({
    request: {
      google: { skus: [sku] },
      apple: { sku: sku },
    },
    type: isSub ? 'subs' : 'in-app',
  });
}

/** Legacy alias */
export async function purchaseRemoveAds(): Promise<void> {
  return purchaseProduct(REMOVE_ADS_SKU);
}

/**
 * Acknowledges a purchase with the store.
 * If isConsumable is true, finishes the transaction so the user can purchase it again.
 */
export async function acknowledgePurchase(
  purchase: Purchase,
  isConsumableOverride?: boolean
): Promise<void> {
  const consumable =
    typeof isConsumableOverride === 'boolean'
      ? isConsumableOverride
      : isConsumableSku(purchase.productId);

  try {
    await finishTransaction({ purchase, isConsumable: consumable });
  } catch (error) {
    if (__DEV__) console.warn('[billing] finishTransaction failed:', error);
  }
}

/**
 * Checks all owned active non-consumables and subscriptions.
 */
export async function getOwnedPurchases(): Promise<Purchase[]> {
  if (!(await connectStore())) return [];
  try {
    const purchases = (await getAvailablePurchases()) as Purchase[];
    const owned = purchases.filter((p) => p.purchaseState === 'purchased');
    for (const p of owned) {
      if (!isConsumableSku(p.productId)) {
        await acknowledgePurchase(p, false);
      }
    }
    return owned;
  } catch (error) {
    if (__DEV__) console.warn('[billing] getAvailablePurchases failed:', error);
    return [];
  }
}

/**
 * Checks if user owns Remove Ads (backwards compatibility).
 */
export async function ownsRemoveAds(): Promise<boolean> {
  const owned = await getOwnedPurchases();
  return owned.some((p) => p.productId === REMOVE_ADS_SKU);
}
