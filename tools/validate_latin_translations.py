import argparse
import json
import sys
from pathlib import Path


LATIN_PATH = Path("www/data/latin.js")
DEFAULT_LANGUAGES = ["en"]
ALL_TARGET_LANGUAGES = ["en", "pt", "pl", "it", "fr", "fil", "de", "vi", "ro", "hr", "hu", "ko"]


def load_latin_data():
    source = LATIN_PATH.read_text(encoding="utf-8")
    payload = source.split("=", 1)[1].strip()
    if payload.endswith(";"):
        payload = payload[:-1]
    return json.loads(payload)


def main():
    parser = argparse.ArgumentParser(description="Validate daily Latin phrase translation coverage.")
    parser.add_argument("--all", action="store_true", help="Require every non-Spanish supported language.")
    args = parser.parse_args()

    required_languages = ALL_TARGET_LANGUAGES if args.all else DEFAULT_LANGUAGES
    data = load_latin_data()
    phrases = data.get("frases", [])
    errors = []

    if len(phrases) != data.get("total"):
        errors.append(f"Expected total={data.get('total')}, found {len(phrases)} phrases.")

    for phrase in phrases:
        phrase_id = phrase.get("id", "<missing id>")
        if not phrase.get("latin"):
            errors.append(f"{phrase_id}: missing latin text.")
        if not phrase.get("traduccion"):
            errors.append(f"{phrase_id}: missing Spanish translation.")

        translations = phrase.get("translations", {})
        for language in required_languages:
            entry = translations.get(language)
            if not entry:
                errors.append(f"{phrase_id}: missing translations.{language}.")
                continue
            if not entry.get("text"):
                errors.append(f"{phrase_id}: missing translations.{language}.text.")
            if not entry.get("source"):
                errors.append(f"{phrase_id}: missing translations.{language}.source.")

    if errors:
        print("\n".join(errors), file=sys.stderr)
        raise SystemExit(1)

    print(f"Latin translations OK for: {', '.join(required_languages)}")


if __name__ == "__main__":
    main()
