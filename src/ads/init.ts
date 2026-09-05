import mobileAds, { AdsConsent, MaxAdContentRating } from 'react-native-google-mobile-ads';

let started = false;

/**
 * Gathers consent, then starts the Google Mobile Ads SDK.
 *
 * Order matters and is not negotiable: the SDK may begin preloading ads the
 * moment `initialize()` is called, so consent has to be resolved first.
 * Initialising before gathering consent is a policy violation for EEA/UK
 * users, not merely a bug.
 *
 * `gatherConsent()` performs the info update and shows Google's UMP form only
 * when the user's region actually requires it — outside the EEA/UK it resolves
 * immediately without showing anything.
 */
export async function initializeAds(): Promise<void> {
  if (started) return;
  started = true;

  try {
    await AdsConsent.gatherConsent();
  } catch (error) {
    // A consent failure must not brick the app. Ads simply stay unpersonalised
    // or unfilled; every devotional feature keeps working.
    if (__DEV__) console.warn('[ads] consent gathering failed:', error);
  }

  try {
    // A devotional audience skews family-heavy. Capping content at "G" keeps
    // gambling and mature ads out without opting into the Families programme,
    // which would restrict formats far more aggressively.
    await mobileAds().setRequestConfiguration({
      maxAdContentRating: MaxAdContentRating.G,
      tagForChildDirectedTreatment: false,
      tagForUnderAgeOfConsent: false,
    });
    await mobileAds().initialize();
  } catch (error) {
    if (__DEV__) console.warn('[ads] initialization failed:', error);
  }
}

/**
 * Reopens the consent form so users can change their choice after the fact.
 * EEA/UK users must be able to withdraw consent at any time, so this is wired
 * to a visible control on the Profile screen.
 */
export async function showPrivacyOptions(): Promise<void> {
  try {
    await AdsConsent.showPrivacyOptionsForm();
  } catch (error) {
    if (__DEV__) console.warn('[ads] privacy options form failed:', error);
  }
}
