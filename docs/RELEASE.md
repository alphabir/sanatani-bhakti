# Getting Sanatani Bhakti onto the Play Store

Everything in the app is built and verified. What remains is account setup and
asset supply — the parts only you can do. Work through this in order; later
steps depend on earlier ones.

---

## Stage 1 — Get it running on a real phone (no accounts needed)

You can do this today. Nothing here costs money.

```bash
npm install -g eas-cli
```

```bash
eas login
```

Create a free Expo account when prompted, then:

```bash
eas init
```

This writes `extra.eas.projectId` into `app.json`. Then build an installable APK:

```bash
eas build --profile preview --platform android
```

The build runs on Expo's servers — **you do not need Android Studio or the
Android SDK.** When it finishes you get a download link; install the APK on your
phone.

### Verify these five things on the phone

These are the bugs that made the app non-functional on Android. Check each:

1. **Persistence** — pick a language, earn some punya, then force-stop the app
   and reopen it. It must **not** ask for a language again, and your punya,
   streak and favourites must survive. *(This was the single biggest bug: the
   app used browser `localStorage`, which does not exist on Android, so
   everything reset on every launch.)*
2. **Layout** — the orange header sits **below** the status bar, and the tab bar
   sits **above** the gesture navigation bar. Check on a notched phone if you
   have one.
3. **Back button** — go three screens deep, press the hardware Back button three
   times. You should walk back to Home, not have the app quit. A fourth press
   exits.
4. **Share** — Daily Status → Share opens the real Android share sheet.
5. **Wallpapers** — tap any wallpaper; it saves to your gallery and offers "Set
   as wallpaper".

Test ads appear on browse screens, labelled **Test Ad**. That is correct — they
stay test ads until Stage 3.

---

## Stage 2 — Supply your content assets

The app is honest about missing assets: features with no content are hidden
rather than shown as dead buttons. Filling these in is what makes the app worth
installing.

### Ringtones (currently hidden)

The Ringtones feature does not appear anywhere in the app right now, because no
audio ships. See [`assets/audio/README.md`](../assets/audio/README.md) for the
filenames and — importantly — the licensing rules.

**Read the licensing section.** The Hanuman Chalisa text is public domain; a
*recording* of someone singing it is not. Shipping audio you do not have rights
to risks a copyright strike and account termination. Ripping from YouTube is not
a licence.

### Wallpapers (working, but generic)

Wallpapers currently render as real gradients and save correctly, but they are
abstract, not deity artwork. When you have licensed HD images, add an `image`
field to the `Wallpaper` type and the screen will use it with the gradient as
fallback — no rewrite needed.

---

## Stage 3 — AdMob (this is what earns money)

1. Create an AdMob account: <https://admob.google.com>
2. Add an Android app. If the app is not published yet, choose **"No, it is not
   listed on a supported app store"** — you can link it later.
3. Create two ad units: one **Banner**, one **Interstitial**.
4. Put the IDs in the app:
   - `app.json` → `react-native-google-mobile-ads` → `androidAppId` (the
     `ca-app-pub-XXXX~YYYY` form)
   - `src/ads/config.ts` → `PRODUCTION_BANNER_ID` and
     `PRODUCTION_INTERSTITIAL_ID` (the `ca-app-pub-XXXX/YYYY` form)

**Do not skip this:** never run a development build against live ad units.
Clicking your own ads is invalid traffic, and Google terminates AdMob accounts
for it — usually permanently, with unpaid earnings forfeited. The `__DEV__`
guard in `config.ts` prevents this; leave it in place.

AdMob pays out once you pass the threshold (US$100 in most regions) and have
completed tax and payment details. Expect the first payment to take a couple of
months.

See [`ADS.md`](./ADS.md) for where ads are placed and why the Jaap and Mandir
screens are deliberately ad-free.

---

## Stage 4 — Play Console

1. Pay the one-time **US$25** registration fee: <https://play.google.com/console>
   Identity verification takes a few days — start this early, it is often the
   longest pole.
2. Create the app (name: **Sanatani Bhakti**, type: App, free).

### Store listing assets you must produce

| Asset | Spec | Note |
|---|---|---|
| App icon | 512 × 512 PNG | Downscale `assets/icon.png` (already 1024 × 1024) |
| Feature graphic | 1024 × 500 PNG/JPG | Required. Shown at the top of your listing |
| Phone screenshots | ≥ 2, min 1080 px on the short side | Take from the preview build |
| Short description | ≤ 80 chars | |
| Full description | ≤ 4000 chars | |

Describe only what ships. If ringtones are still hidden, do not mention
ringtones — a listing promising features the app lacks is rejected under the
Minimum Functionality policy.

### App content declarations

- **Privacy policy** — host [`PRIVACY_POLICY.md`](../PRIVACY_POLICY.md) at a
  public URL and paste it here. Fill in your name and support email first.
- **Ads** — answer **Yes, my app contains ads.**
- **Data safety** — declare: *Advertising ID — collected, shared, for
  Advertising*. Nothing else leaves the device.
- **Advertising ID declaration** — the app targets API 36, so you must declare
  advertising ID use and tick **Advertising or marketing**. The Google Mobile
  Ads SDK merges the `AD_ID` permission into the manifest automatically; you do
  not need to add it by hand.
- **Target audience** — do **not** select a children's age group. Doing so pulls
  the app into the Families policy, which severely restricts which ad formats
  you may serve and would cut your revenue.
- **Content rating** — complete the questionnaire. A devotional reference app
  rates Everyone.

---

## Stage 5 — In-app purchase

Only possible once the app has been uploaded to a testing track at least once.

1. Set up a **payments profile / merchant account** in Play Console.
2. Monetise → In-app products → create a **one-time product** with product ID
   exactly `remove_ads`. Set your price and **activate** it.
3. Add your own Google account under **Licence testing** so you can buy it
   without being charged.

Until this product exists and is active, the Remove Ads screen correctly shows
"Not available yet" and the buy button stays hidden. That is intentional — the
app never displays a price it did not receive from Play.

### Verify

Purchase `remove_ads` with a licence-test account → every banner disappears
immediately. Then uninstall, reinstall, and tap **Restore purchase** → ad-free
status comes back.

---

## Stage 6 — Ship

```bash
eas build --profile production --platform android
```

This produces an **AAB**, which is what Play requires. Upload it to **Internal
testing** first, not Production — internal testing reaches your own devices in
minutes and is the only way to test the real purchase flow.

When you are satisfied, promote to Production. First review typically takes a
few days; new developer accounts can take longer.

```bash
eas submit --platform android --profile production
```

---

## Known issue to decide on

`npx expo-doctor` reports one remaining item: **Expo SDK 56 with React Native
0.85 ships a Hermes version with a known memory regression.** The fix is in SDK
57 / React Native 0.86.2.

This is not a crash and the app works, but your audience skews toward low-RAM
Android devices, where a memory regression bites hardest. `AGENTS.md` pins this
project to SDK 56, so upgrading is your call, not an automatic fix. If you want
it:

```bash
npx expo install expo@^57.0.9 --fix
```

Budget time to re-test everything afterwards — it is a major version bump.

---

## Ongoing

- Bump `version` in `app.json` for each release. `versionCode` auto-increments
  via the `production` profile in `eas.json`.
- **From 31 August 2026, new Play submissions must target Android 16 (API 36).**
  Already satisfied — `expo-build-properties` pins `targetSdkVersion: 36`.
