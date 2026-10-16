"""Import unmodified QuranEnc CSV exports; preserve translations, footnotes and notices.

Usage: python3 scripts/import-quran-translations.py FRENCH_CSV GERMAN_CSV
Download the current editions from https://quranenc.com/en/home first.
"""
import csv
import hashlib
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
CORPUS = json.loads((ROOT / 'data/quran/corpus.json').read_text())
EDITIONS = [
    ('fr', 'french_rashid', 'Rachid Maach', '1.0.3', '2026-06-21'),
    ('de', 'german_rwwad', 'Rowwad Translation Center', '1.0.15', '2026-07-26'),
]

def parse(path, locale, key, publisher, version, updated):
    raw = Path(path).read_bytes()
    rows = list(csv.reader(raw.decode('utf-8-sig').splitlines(keepends=True)))
    notice = rows[0][0]
    assert f'# Translation ID: {key}' in notice, 'Wrong translation edition'
    assert f'(v{version}-csv.' in notice, 'Review and update edition metadata before import'
    assert rows[1] == ['id', 'sura', 'aya', 'translation', 'footnotes']
    expected = [(c['number'], v['number']) for c in CORPUS['chapters'] for v in c['verses']]
    assert len(rows[2:]) == len(expected) == 6236
    chapters = [[] for _ in range(114)]
    for position, (row, address) in enumerate(zip(rows[2:], expected), 1):
        global_id, surah, ayah, translation, footnotes = row
        assert int(global_id) == position
        assert (int(surah), int(ayah)) == address
        assert translation.strip(), f'Empty verse {address}'
        chapters[int(surah)-1].append({'number': int(ayah), 'translation': translation, 'footnotes': footnotes})
    return {
        'locale': locale, 'key': key, 'publisher': publisher, 'version': version,
        'updated': updated, 'source': 'https://quranenc.com',
        'url': f'https://quranenc.com/en/browse/{key}',
        'download': f'https://quranenc.com/en/home/d/csv/{key}',
        'terms': 'https://quranenc.com/en/home/api/',
        'sourceSha256': hashlib.sha256(raw).hexdigest(),
        'notice': notice, 'chapters': chapters,
    }

if __name__ == '__main__':
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    # Validate both before changing either output file.
    prepared = [parse(path, *edition) for path, edition in zip(sys.argv[1:], EDITIONS)]
    dest = ROOT / 'data/quran/translations'
    dest.mkdir(exist_ok=True)
    for data in prepared:
        (dest / f"{data['locale']}.json").write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':'))+'\n')
        print(f"Imported {data['locale']}: 114 chapters, 6236 translations and original footnotes; version {data['version']}")
