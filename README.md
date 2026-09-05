# Sanatani Bhakti — Hindu Devotional App

All-in-one Sanatan Dharma app for Android. Expo SDK 56 / React Native 0.85.

**All devotional content is free.** The only purchase is an optional one-time
"Remove Ads".

## Run it

### On a real Android phone (recommended)

Ads and in-app purchases are native modules, so they do **not** work in Expo Go.
Build a development or preview build instead:

```bash
eas build --profile preview --platform android
```

This builds on Expo's servers — no Android Studio or Android SDK needed locally.
Full walkthrough in [`docs/RELEASE.md`](docs/RELEASE.md).

### In a browser (layout iteration only)

```bash
npm run dev
```

Then open <http://localhost:8082>.

Useful for tweaking layout, but **do not use it to verify behaviour**. Ads,
purchases, audio, the share sheet, gallery saving and the hardware Back button
are all Android-only. Verifying on web is what originally left the app
non-functional on Android.

## Features

| Module | Status |
|---|---|
| **Multi-language** | 11 Indian languages. Hindi and English complete; the other 9 are partial and fall back to English per-string |
| **Home** | Daily panchang, status, mantra of the day, festivals, quick access |
| **Mantras** | 12 mantras with Sanskrit, meaning, benefits |
| **Aarti** | 10 aartis with full lyrics |
| **Chalisa** | Hanuman and others |
| **Bhajans** | 8 bhajans |
| **Stotrams** | Shiv Tandav, Mahishasura Mardini, Vishnu Sahasranama |
| **Jaap Counter** | 108 / 1008 with haptic feedback. Deliberately ad-free |
| **Virtual Mandir** | Light diya, offer flowers, ring bell. Deliberately ad-free |
| **Puja Vidhi** | 5 step-by-step guides with samagri checklist |
| **Rashifal** | All 12 rashis |
| **Muhurat** | Brahma, Abhijit, Godhuli, Rahu Kaal timings |
| **Daily Status** | Shareable quotes via the native Android share sheet |
| **Wallpapers** | 20 gradient wallpapers — saves to gallery, sets as wallpaper |
| **Famous Temples** | 10 pilgrimage sites with timings and significance |
| **Festival Hub** | Upcoming festivals with puja links |
| **Scriptures** | Gita, Sunderkand, stotras |
| **Knowledge** | Divine facts cards |
| **Punya Points** | Gamification and streaks, persisted across restarts |
| **Ringtones** | ⚠️ Hidden until you add audio — see [`assets/audio/README.md`](assets/audio/README.md) |
| **Remove Ads** | One-time Google Play purchase. Needs a Play merchant account |

Features with no content are hidden rather than shown as dead buttons. Google
rejects apps under the Minimum Functionality policy for advertising features
that do nothing.

## Project structure

```
sanatani_app/
├── App.tsx                  # SafeAreaProvider, ads init, billing sync
├── app.json                 # Expo config + native plugin config
├── eas.json                 # Build profiles: development / preview / production
├── src/
│   ├── ads/                 # AdMob: config, consent+init, banner, interstitial
│   ├── hooks/               # useRemoveAds — purchase + restore
│   ├── services/            # storage (AsyncStorage), billing, media
│   ├── constants/theme.ts
│   ├── i18n/                # 11 Indian languages
│   ├── data/
│   ├── context/             # AppContext: nav stack, punya, entitlement
│   ├── components/
│   ├── screens/
│   └── navigation/
├── assets/audio/            # Ringtone MP3s (you supply — see its README)
├── docs/
│   ├── RELEASE.md           # Play Store step-by-step
│   └── ADS.md               # Ad placement policy
└── PRIVACY_POLICY.md        # Host this publicly; Play requires it
```

## Checks

```bash
npx tsc --noEmit
```

```bash
npx expo-doctor
```

One `expo-doctor` failure is expected and documented under "Known issue to
decide on" in [`docs/RELEASE.md`](docs/RELEASE.md).

## Before you publish

Read [`docs/RELEASE.md`](docs/RELEASE.md). Short version of what only you can do:

1. AdMob account → real ad unit IDs into `src/ads/config.ts` and `app.json`
2. Play Console account (US$25) → store listing and declarations
3. Play merchant account → create the `remove_ads` product
4. Licensed MP3s and HD deity images
5. Host `PRIVACY_POLICY.md` at a public URL

---

*Jai Shree Ram 🙏*
