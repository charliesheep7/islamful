"""Validate pinned, unmodified source files and build reader data. No network calls."""
from pathlib import Path
import json, re, hashlib, xml.etree.ElementTree as ET
ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'data/quran/source'
OUT = ROOT / 'data/quran'
arabic_raw = (SRC / 'tanzil-uthmani.xml').read_text()
arabic = ET.fromstring(arabic_raw)
meta = ET.parse(SRC / 'tanzil-metadata.xml').getroot()
translation = json.loads((SRC / 'clearquran-itani.json').read_text())
assert translation['code'] == 200 and translation['data']['edition']['identifier'] == 'en.itani'
assert len(arabic) == len(translation['data']['surahs']) == 114
notice = re.search(r'<!--(.*?)-->', arabic_raw, re.S)[1].strip()
chapters, corpus = [], []
slugs = {1: 'al-fatihah', 2: 'al-baqarah', 3: 'ali-imran', 18: 'al-kahf', 36: 'ya-sin', 55: 'ar-rahman', 56: 'al-waqiah', 67: 'al-mulk'}
juzs = [{'number':int(j.attrib['index']), 'surah':int(j.attrib['sura']), 'ayah':int(j.attrib['aya'])} for j in meta.find('juzs')]
for number, (surah, trans, m) in enumerate(zip(arabic, translation['data']['surahs'], meta.find('suras')), 1):
    a = m.attrib
    assert int(surah.attrib['index']) == trans['number'] == int(a['index']) == number
    count = int(a['ayas']); start = int(a['start'])
    assert len(surah) == len(trans['ayahs']) == count
    slug = slugs.get(number) or re.sub(r'[^a-z0-9]+', '-', a['tname'].lower().replace("'", '')).strip('-')
    chapters.append({'number': number, 'slug': slug, 'name': a['tname'], 'nameAr': a['name'], 'meaning':a['ename'], 'count':count, 'start':start})
    verses = []
    for n, (verse, tr) in enumerate(zip(surah, trans['ayahs']), 1):
        assert int(verse.attrib['index']) == tr['numberInSurah'] == n and tr['number'] == start + n
        assert isinstance(tr['text'], str) and tr['text'] and not re.search(r'<[^>]+>', tr['text'])
        assert verse.attrib['text']
        verses.append({'number':n, 'global':start+n, 'arabic':verse.attrib['text'], 'translation':tr['text'], 'juz':tr['juz'], 'page':tr['page']})
    bismillah = surah[0].attrib.get('bismillah')
    assert bool(bismillah) == (number not in [1, 9])
    corpus.append({'number': number, 'bismillah':bismillah, 'verses': verses})
assert sum(c['count'] for c in chapters) == 6236
assert len(set(c['slug'] for c in chapters)) == 114
assert len(juzs) == 30
for j in juzs:
    assert corpus[j['surah']-1]['verses'][j['ayah']-1]['juz'] == j['number']
def write(name, obj):
    (OUT/name).write_text(json.dumps(obj, ensure_ascii=False, separators=(',', ':'))+'\n')
write('index.json', {'source':'Tanzil metadata v1.0, CC BY; https://tanzil.net/docs/Quran_Metadata', 'chapters':chapters, 'juzs':juzs})
write('corpus.json', {'arabicNotice':notice, 'translationCredit':'Translation by Talal Itani, ClearQuran.com', 'translationLicense':'CC BY-ND 4.0 with additional formatting permissions: https://blog.clearquran.com/download', 'translationSource':'Al Quran Cloud en.itani (God wording), pinned 2026-10-13', 'chapters':corpus})
write('provenance.json', {'imported':'2026-10-13', 'arabic':'Tanzil Uthmani v1.1; marks, sajdah, rub, alef and tatweel options enabled; Arabic strings and separate bismillah attributes preserved verbatim', 'translation':'Talal Itani / ClearQuran, en.itani supplied by Al Quran Cloud; wording preserved verbatim. Not an assertion of matching the latest publisher file.', 'files':{p.name:{'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'bytes':p.stat().st_size} for p in sorted(SRC.iterdir()) if p.is_file()}, 'chapters':114, 'verses':6236})
(OUT/'TANZIL-NOTICE.txt').write_text(notice+'\n')
print('Validated 114 chapters, 6,236 aligned verses, 112 separate bismillah introductions and 30 juz starts. Source wording unchanged.')
