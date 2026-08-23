import json
import sys
from pathlib import Path


REQUIRED_LANGUAGES = ["en"]
ALL_TARGET_LANGUAGES = ["en", "pt", "pl", "it", "fr", "fil", "de", "vi", "ro", "hr", "hu", "ko"]
VERSES_PATH = Path("www/data/verses.js")


def load_verses():
    source = VERSES_PATH.read_text(encoding="utf-8")
    payload = source.split("=", 1)[1].strip()
    if payload.endswith(";"):
        payload = payload[:-1]
    return json.loads(payload)


def validate(required_languages):
    data = load_verses()
    errors = []
    verses = data.get("versiculos", [])

    if len(verses) != 366:
        errors.append(f"Expected 366 verses, found {len(verses)}.")

    for verse in verses:
        verse_id = verse.get("id", "<missing id>")
        translations = verse.get("translations") or {}
        for language in required_languages:
            entry = translations.get(language)
            if not entry:
                errors.append(f"{verse_id}: missing translations.{language}.")
                continue
            for field in ("text", "reference", "source"):
                if not str(entry.get(field, "")).strip():
                    errors.append(f"{verse_id}: translations.{language}.{field} is empty.")

    return errors


def main():
    required = ALL_TARGET_LANGUAGES if "--all" in sys.argv else REQUIRED_LANGUAGES
    errors = validate(required)
    if errors:
        for error in errors:
            print(error, file=sys.stderr)
        raise SystemExit(1)
    print(f"Verse translations OK for: {', '.join(required)}")


if __name__ == "__main__":
    main()
