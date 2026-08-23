# Task For Antigravity / Google

This repository is a vanilla HTML/CSS/JS Capacitor Android app for praying the Santo Rosario. The app must keep working fully offline.

## Goal

Audit and, if needed, complete the daily Bible verse localization for every supported UI language.

The Spanish daily verses are public-domain RVR1909 and live in:

```text
www/data/verses.js
```

English has already been populated from public-domain KJV. Other languages may also already be present; verify coverage before editing. Translation entries use:

```js
verse.translations.en = {
  text: "...",
  reference: "...",
  source: "KJV"
}
```

Your job is to verify or add verse translations for:

```text
pt, pl, it, fr, fil, de, vi, ro, hr, hu, ko
```

Do not modify the Spanish `texto`, `referencia`, `libro`, `capitulo`, `versiculos`, or `traduccion` fields.

## Required Schema

For every item in `window.SANTO_ROSARIO_VERSES.versiculos`, preserve the current fields and add language entries under `translations`.

Example:

```js
{
  "id": "v001",
  "texto": "... Spanish RVR1909 ...",
  "referencia": "Salmos 89:1",
  "libro": "Salmos",
  "capitulo": 89,
  "versiculos": "1",
  "traduccion": "RVR1909",
  "translations": {
    "en": {
      "text": "... KJV English ...",
      "reference": "Psalms 89:1",
      "source": "KJV"
    },
    "pt": {
      "text": "...",
      "reference": "Salmos 89:1",
      "source": "Generated from RVR1909/KJV"
    }
  }
}
```

Use this exact field shape:

```js
translations[languageCode] = {
  text: string,
  reference: string,
  source: string
}
```

## Translation Guidance

- Prefer public-domain Bible wording in the target language when a reliable public-domain source is available.
- If no public-domain Bible source is available, generate a faithful translation using the Spanish RVR1909 `texto` and the English KJV `translations.en.text` as guides.
- Do not use copyrighted modern Bible translations.
- Keep references localized when natural, but preserve chapter and verse numbers exactly.
- Keep the devotional tone, but prioritize clarity for older readers.
- Preserve verse ranges exactly, for example `John 10:27-28`.
- Keep `source` explicit. Suggested values:
  - public-domain source abbreviation if using one
  - otherwise `Generated from RVR1909/KJV`

## Runtime Behavior To Preserve

The app reads the active language from `window.SantoRosarioI18n.getLanguage()`.

`www/js/app.js` currently resolves the daily verse like this:

1. Use `verse.translations[currentLanguage]` if present.
2. If the current language is not Spanish and the specific translation is missing, use `verse.translations.en`.
3. Otherwise fall back to Spanish RVR1909 fields.

Do not break that behavior.

## Validation Requirements

After editing, run:

```bash
node --check www/data/verses.js
node --check www/js/app.js
npm.cmd run sync
npm.cmd run build:android
```

Also run the existing validation script:

```bash
python tools/validate_verse_translations.py
python tools/validate_verse_translations.py --all
```

The first command validates the current English baseline. The second command must pass after you add every target language.

The validation checks:

- all 366 verses exist
- every verse has `translations.en`
- every verse has the target languages listed above
- every translation entry has non-empty `text`, `reference`, and `source`
- no supported language code is misspelled

## Do Not Do

- Do not add network calls to the app.
- Do not add a backend.
- Do not replace `www/data/verses.js` with JSON fetched at runtime.
- Do not change the yearly calendar assignments.
- Do not remove the original Spanish RVR1909 text.
- Do not introduce React, TypeScript, or a heavy framework.

## Notes

The app supports these UI languages:

```text
es, pt, en, pl, it, fr, fil, de, vi, ro, hr, hu, ko
```

The daily Latin phrase system in `www/data/latin.js` is separate. Do not change it for this task unless explicitly requested.
