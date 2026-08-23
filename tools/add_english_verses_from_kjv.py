import json
import re
import sys
import urllib.request
from pathlib import Path


KJV_URL = "https://raw.githubusercontent.com/midvash/bible-data/main/versions/en/kjv/kjv.json"
VERSES_PATH = Path("www/data/verses.js")

BOOKS_ES_TO_KJV = {
    "1 Corintios": "1 Corinthians",
    "1 Juan": "1 John",
    "1 Pedro": "1 Peter",
    "1 Tesalonicenses": "1 Thessalonians",
    "2 Corintios": "2 Corinthians",
    "2 Timoteo": "2 Timothy",
    "Apocalipsis": "Revelation",
    "Cantares": "Song of Solomon",
    "Colosenses": "Colossians",
    "Deuteronomio": "Deuteronomy",
    "Efesios": "Ephesians",
    "Filipenses": "Philippians",
    "Hebreos": "Hebrews",
    "Juan": "John",
    "Lamentaciones": "Lamentations",
    "Lucas": "Luke",
    "Marcos": "Mark",
    "Mateo": "Matthew",
    "Proverbios": "Proverbs",
    "Romanos": "Romans",
    "Salmos": "Psalms",
    "Santiago": "James",
}

REFERENCE_RE = re.compile(r"^(?P<book>.+?)\s+(?P<chapter>\d+):(?P<verses>[\d,-]+)$")


def load_verses_data():
    source = VERSES_PATH.read_text(encoding="utf-8")
    payload = source.split("=", 1)[1].strip()
    if payload.endswith(";"):
        payload = payload[:-1]
    return json.loads(payload)


def load_kjv_data():
    with urllib.request.urlopen(KJV_URL, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))


def build_kjv_index(kjv):
    index = {}
    for book in kjv["books"]:
        book_name = book.get("englishName") or book["book"]
        chapters = {}
        for chapter in book["chapters"]:
            chapters[int(chapter["chapter"])] = {
                int(verse["number"]): verse["text"] for verse in chapter["verses"]
            }
        index[book_name] = chapters
    return index


def expand_verses(spec):
    verses = []
    for part in spec.split(","):
        part = part.strip()
        if "-" in part:
            start, end = part.split("-", 1)
            verses.extend(range(int(start), int(end) + 1))
        else:
            verses.append(int(part))
    return verses


def kjv_for_reference(reference, kjv_index):
    match = REFERENCE_RE.match(reference)
    if not match:
        raise ValueError(f"Unsupported reference format: {reference}")

    spanish_book = match.group("book")
    kjv_book = BOOKS_ES_TO_KJV.get(spanish_book)
    if not kjv_book:
        raise ValueError(f"Missing book mapping: {spanish_book}")

    chapter = int(match.group("chapter"))
    verse_numbers = expand_verses(match.group("verses"))
    chapter_data = kjv_index[kjv_book][chapter]
    texts = [chapter_data[number] for number in verse_numbers]
    return " ".join(texts), f"{kjv_book} {chapter}:{match.group('verses')}"


def main():
    verses_data = load_verses_data()
    kjv_index = build_kjv_index(load_kjv_data())

    missing = []
    for verse in verses_data["versiculos"]:
        try:
            text, reference = kjv_for_reference(verse["referencia"], kjv_index)
        except Exception as exc:
            missing.append((verse["id"], verse["referencia"], str(exc)))
            continue

        translations = verse.setdefault("translations", {})
        translations["en"] = {
            "text": text,
            "reference": reference,
            "source": "KJV",
        }

    if missing:
        for item in missing:
            print("missing", item, file=sys.stderr)
        raise SystemExit(1)

    output = (
        "window.SANTO_ROSARIO_VERSES = "
        + json.dumps(verses_data, ensure_ascii=False, indent=2)
        + ";\n"
    )
    VERSES_PATH.write_text(output, encoding="utf-8")
    print(f"Updated {len(verses_data['versiculos'])} verses with English KJV translations.")


if __name__ == "__main__":
    main()
