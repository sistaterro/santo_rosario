Santo Rosario
=============

A lightweight web app for praying the Holy Rosary, packaged as an Android APK with Capacitor.

The app is designed as a practical guide for the way the Rosary is commonly prayed in Argentina: it selects the daily mysteries, guides progress bead by bead, persists the current prayer state during the day, and works fully offline.

## Screenshots

| Home | Daily mysteries |
| --- | --- |
| ![Santo Rosario home](docs/readme-images/image_01.jpeg) | ![Daily mysteries](docs/readme-images/image_02.jpeg) |

| Interactive rosary | Completed rosary |
| --- | --- |
| ![Interactive rosary](docs/readme-images/image_03.jpeg) | ![Completed rosary](docs/readme-images/image_04.jpeg) |

## Features

- Offline-first: no backend, user account, or permanent internet connection required.
- Detects the weekday and automatically selects the corresponding mysteries.
- Shows daily Scripture and a daily Latin phrase with translation.
- Includes a large interactive rosary: the central cross advances the prayer and the beads update visually.
- Persists rosary progress for the current day and resets automatically when the date changes.
- Shows a completion state when the Rosary ends, with a clear restart option.
- Includes i18n catalogs for 13 languages. On first run, it uses the device language when supported; otherwise it falls back to English. User changes persist afterward.

## Languages

General UI copy lives in `www/i18n/`. Available catalogs:

```text
es, pt, en, it, fr, pl, de, fil, vi, ro, hr, hu, ko
```

The language selector label intentionally stays as `Language` so it remains recognizable regardless of the active language. Korean uses standard UTF-8/Hangul support and does not need special runtime handling. Daily Scripture and Latin phrases are handled separately in `www/data/verses.js` and `www/data/latin.js`.

Daily Scripture keeps the Spanish RVR1909 text as the base source and includes localized entries in `translations.*` for all non-Spanish supported languages. Daily Latin phrases keep the Latin text as the displayed phrase and use localized translation entries when available. Missing non-Spanish daily content falls back to English before Spanish.

Editorial note: translations are a functional first pass. Before publishing a language as pastorally final, review it with native speakers and appropriate liturgical sources, especially the longer prayers.

## Project Structure

```text
www/
  index.html
  rosary.html
  css/styles.css
  js/app.js
  i18n/
    languages.js
    es.js, pt.js, en.js, pl.js, it.js, fr.js, fil.js, de.js, vi.js, ro.js, hr.js, hu.js, ko.js
    i18n.js
  data/
    verses.js
    latin.js
android/
docs/readme-images/
assets/
```

## Useful Commands

```bash
npm.cmd install
npm.cmd run sync
npm.cmd run build:android
```

The debug APK is generated at:

```text
app-download/santo_rosario.apk
```

`npm.cmd run build:android` also leaves Gradle's original debug APK at `android/app/build/outputs/apk/debug/app-debug.apk`.

## Technical Notes

- `www/` is the Capacitor `webDir`.
- README screenshots live in `docs/readme-images/`.
- Remote fonts were removed so the app can run offline with system serif fonts.
- Daily data is loaded from JS files in `www/data/`, not JSON, to work reliably offline, in Capacitor, and in local file testing.
- Translatable UI copy is loaded from JS catalogs in `www/i18n/`.
- Language preference is stored in `localStorage` as `santoRosario.language.v1`, with migration from the former `santoRosario.idioma.v1`.
- Rosary progress is stored in `localStorage` as `santoRosario.progress.v1`, with migration from the former `santoRosario.progreso.v1`.
- `npm.cmd run build:android` compiles the debug APK and copies it to `app-download/santo_rosario.apk` for easy GitHub access.
- `rosary.html` uses an interactive SVG rosary; the central cross is the primary advance control and has an initial pulse cue.
