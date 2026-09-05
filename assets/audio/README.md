# Ringtone audio assets

Drop licensed MP3 files here, then uncomment the matching `file:` line in
[`src/data/ringtones.ts`](../../src/data/ringtones.ts).

Until a file exists **and** its `file:` line is uncommented, that ringtone is
filtered out of the app entirely — no screen, no dead play button. The
Ringtones entry disappears from Explore and Quick Actions when none are
present. This is deliberate: Google rejects apps under the Minimum
Functionality policy for advertising features that do nothing.

## Expected filenames

| Filename | Ringtone | Target length |
|---|---|---|
| `om-chant.mp3` | Om Chanting | 0:30 |
| `temple-bell.mp3` | Temple Bell | 0:15 |
| `hanuman-chalisa-hook.mp3` | Hanuman Chalisa (opening doha) | 0:45 |
| `gayatri-mantra.mp3` | Gayatri Mantra | 0:40 |
| `shiv-tandav.mp3` | Shiv Tandav (opening) | 1:00 |
| `krishna-flute.mp3` | Krishna Flute | 0:50 |
| `aarti-bell.mp3` | Aarti Bell | 0:20 |
| `ram-dhun.mp3` | Ram Dhun | 0:35 |

The `duration` strings in `ringtones.ts` are display labels only — update them
to match your actual files, or they will misinform users.

## Licensing — read before shipping

**The text is not the recording.** The Hanuman Chalisa, Shiv Tandav Stotram and
Gayatri Mantra are public-domain works many centuries old. Any *specific
performance or recording* of them is a separate copyrighted work owned by the
performer and label.

Uploading a recording you do not have rights to will get the app struck under
Play's Intellectual Property policy, and can result in the developer account
being terminated. Ripping audio from YouTube is not a licence.

Safe sources:

- Audio you record or commission yourself (cleanest — you own it outright).
- Tracks explicitly licensed CC0 or CC-BY (keep the attribution text and add it
  to the app's about screen if CC-BY).
- Stock libraries with a commercial licence that covers redistribution inside an
  application, not merely synchronisation in a video.

Keep a written record of the licence for each file. Play may ask for proof.

## Format notes

- MP3, mono is fine for bells and chants, 128 kbps is plenty.
- Keep each file under ~1 MB. Everything here is bundled into the APK/AAB, so
  eight large files directly inflate your download size and hurt install rates
  on the low-end devices this app targets.
- Trim silence from the start — a ringtone that begins with 400 ms of nothing
  sounds broken.
