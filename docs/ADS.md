# Ad placement policy

Where ads may and may not appear in Sanatani Bhakti, and why. Read this before
adding a banner to a new screen.

## The one rule that protects your account

**Never place an ad near a repeated tap target.**

The Jaap screen has a 220 px circle that users tap between 108 and 1008 times in
a single sitting. A banner anywhere near it guarantees accidental clicks. Google
classifies those as *invalid traffic*, and the penalty is permanent termination
of the AdMob account with forfeiture of unpaid earnings — often on a first
offence, with no appeal in practice.

This is why `BANNER_SCREENS` in
[`src/navigation/RootNavigator.tsx`](../src/navigation/RootNavigator.tsx) is an
**allowlist**, not a blocklist. Any screen added later is ad-free by default
until someone deliberately opts it in.

## Current placement

| Screen group | Banner | Reason |
|---|---|---|
| Home, Explore, all list screens, Rashifal, Knowledge, Muhurat, Festivals, Wallpapers, Favourites, Temple detail | Yes | Browse surfaces. Users are scanning, not praying. |
| **Jaap** | **Never** | Repeated tap target — invalid-traffic risk (see above). |
| **Mandir** | **Never** | Full-bleed dark worship UI; an ad destroys it. |
| **Premium** | **Never** | Never advertise on top of the purchase flow. |
| **Profile** | **Never** | Contains the purchase entry point. |
| Prayer-text detail screens — aarti, chalisa, bhajan, stotram, scripture, mantra | **Never** | Nobody should read a chalisa with an ad beside it. This costs some revenue and is worth it. |

## Interstitials

Configured in [`src/ads/config.ts`](../src/ads/config.ts), paced by
[`src/ads/useAppInterstitial.ts`](../src/ads/useAppInterstitial.ts).

- Minimum **90 seconds** between impressions.
- Nothing at all until the user has opened **5** detail screens (no ad on a
  first run — first impressions decide retention).
- Otherwise at most one per **8** screen opens.
- One `force: true` trigger: completing a full mala. It fires **1.2 s after**
  the completion state renders, never on the tap itself.

`force` skips the every-Nth rule but still honours the warm-up and the 90 s
interval. There is no way to bypass those, by design.

## Consent

`AdsConsent.gatherConsent()` runs **before** `mobileAds().initialize()` in
[`src/ads/init.ts`](../src/ads/init.ts). This ordering is mandatory: the SDK may
begin preloading ads on `initialize`, and serving a personalised ad to an EEA/UK
user before consent is a policy violation, not merely a bug. Do not reorder it.

Users can reopen the form at any time via **Profile → Ad privacy settings**,
which is required for EEA/UK users to withdraw consent.

## Test vs production IDs

`USING_TEST_ADS` in `src/ads/config.ts` is true whenever `__DEV__` is set or the
production IDs are still placeholders. **Never** point a development build at a
live ad unit — see the invalid-traffic warning above. Test ads render and
behave identically, so there is no reason to.

## When you swap in real IDs

1. Replace `PRODUCTION_BANNER_ID` and `PRODUCTION_INTERSTITIAL_ID` in
   `src/ads/config.ts`.
2. Replace `androidAppId` in `app.json` with your real App ID.
3. Build a **release** build and confirm real ads render.
4. In AdMob, add your own test devices so any manual testing you do on a release
   build still serves test ads.
