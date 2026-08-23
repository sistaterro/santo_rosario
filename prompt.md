# Task For Antigravity / Google

This repository is a vanilla HTML/CSS/JS Capacitor Android app for praying the Santo Rosario. The app must keep working fully offline.

## Goal

Complete the daily Latin phrase localization for every supported non-Spanish UI language.

The Latin daily phrases live in:

```text
www/data/latin.js
```

Each phrase already keeps:

```js
{
  id: "l001",
  latin: "In hac domo habitat oratio.",
  traduccion: "En esta casa habita la plegaria.",
  translations: {
    en: {
      text: "Prayer dwells in this house.",
      source: "English editorial translation from Latin/Spanish"
    }
  }
}
```

English has already been populated. Your job is to add or audit translations for:

```text
pt, pl, it, fr, fil, de, vi, ro, hr, hu, ko
```

Do not modify the `id`, `latin`, `traduccion`, `calendario`, `total`, or yearly assignment logic.

## Required Schema

For every item in `window.SANTO_ROSARIO_LATIN.frases`, preserve the current fields and add language entries under `translations`.

Use this exact field shape:

```js
translations[languageCode] = {
  text: string,
  source: string
}
```

## Translation Guidance

- Translate the meaning of the Latin phrase into the target language.
- Use the Spanish `traduccion` and English `translations.en.text` as guides when helpful.
- Keep the tone short, devotional, warm, and easy to read.
- Prefer natural target-language prayer wording over overly literal grammar.
- Do not translate the `latin` field itself.
- Do not use copyrighted modern prayer-book text when a phrase is liturgical; produce a simple editorial translation if needed.
- Keep `source` explicit. Suggested value:

```text
Editorial translation from Latin/Spanish/English
```

## Runtime Behavior To Preserve

The app reads the active language from `window.SantoRosarioI18n.getLanguage()`.

`www/js/app.js` currently resolves the daily Latin phrase like this:

1. Always display the original `phrase.latin`.
2. Use `phrase.translations[currentLanguage]` for the translation if present.
3. If the current language is not Spanish and the specific translation is missing, use `phrase.translations.en`.
4. Otherwise fall back to the Spanish `phrase.traduccion`.

Do not break that behavior.

## Validation Requirements

After editing, run:

```bash
node --check www/data/latin.js
node --check www/js/app.js
npm.cmd run sync
npm.cmd run build:android
```

Also run:

```bash
python tools/validate_latin_translations.py
python tools/validate_latin_translations.py --all
```

The first validation command checks the English baseline. The second command must pass after every target language is complete.

The validation checks:

- the phrase count matches `total`
- every phrase has Latin text
- every phrase has Spanish translation
- every phrase has the required translation entries
- every translation entry has non-empty `text` and `source`

## Do Not Do

- Do not add network calls to the app.
- Do not add a backend.
- Do not replace `www/data/latin.js` with JSON fetched at runtime.
- Do not change the yearly calendar assignments.
- Do not remove the original Latin phrase.
- Do not remove the Spanish base translation.
- Do not introduce React, TypeScript, or a heavy framework.

## Notes

The app supports these UI languages:

```text
es, pt, en, pl, it, fr, fil, de, vi, ro, hr, hu, ko
```

The daily Bible verse system in `www/data/verses.js` is separate. Do not change it for this task unless explicitly requested.
