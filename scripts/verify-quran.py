"""Independent integrity check of generated reader content against pinned source records."""
from pathlib import Path
import json, hashlib, xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]/'data/quran'
corpus=json.loads((ROOT/'corpus.json').read_text()); index=json.loads((ROOT/'index.json').read_text()); manifest=json.loads((ROOT/'provenance.json').read_text())
for name, expected in manifest['files'].items():
    raw=(ROOT/'source'/name).read_bytes()
    assert hashlib.sha256(raw).hexdigest()==expected['sha256'], name
ar=ET.parse(ROOT/'source/tanzil-uthmani.xml').getroot()
translations=json.loads((ROOT/'source/clearquran-itani.json').read_text())['data']['surahs']
ar_map={(int(s.attrib['index']),int(v.attrib['index'])):v.attrib['text'] for s in ar for v in s}
en_map={(s['number'],v['numberInSurah']):v['text'] for s in translations for v in s['ayahs']}
reader_map={(s['number'],v['number']):(v['arabic'],v['translation']) for s in corpus['chapters'] for v in s['verses']}
assert len(ar_map)==len(en_map)==len(reader_map)==6236
assert set(reader_map)==set(ar_map)==set(en_map)
for key,(arabic,english) in reader_map.items():
    assert arabic==ar_map[key],key
    assert english==en_map[key],key
assert len(corpus['chapters'])==len(index['chapters'])==114
assert [s['number'] for s in corpus['chapters']]==list(range(1,115))
assert len({s['slug'] for s in index['chapters']})==114
assert 'Tanzil Quran Text' in corpus['arabicNotice'] and 'CHANGING IT IS NOT ALLOWED' in corpus['arabicNotice']
assert corpus['chapters'][0]['bismillah'] is None and corpus['chapters'][8]['bismillah'] is None
assert sum(bool(s['bismillah']) for s in corpus['chapters'])==112
meta=ET.parse(ROOT/'source/tanzil-metadata.xml').getroot()
def partitions(tag):
    return sorted((next(s['start'] for s in index['chapters'] if s['number']==int(e.attrib['sura']))+int(e.attrib['aya']),int(e.attrib['index'])) for e in meta.find(tag))
juzs,pages=partitions('juzs'),partitions('pages')
for s in corpus['chapters']:
    assert s['bismillah']==ar[s['number']-1][0].attrib.get('bismillah')
    expected=index['chapters'][s['number']-1]
    assert len(s['verses'])==expected['count']
    for v in s['verses']:
        assert v['global']==expected['start']+v['number']
        assert v['juz']==max(i for start,i in juzs if start<=v['global'])
        assert v['page']==max(i for start,i in pages if start<=v['global'])
print('All 6,236 Arabic and translation strings match pinned sources exactly; all juz/page/global references and 114 chapters verified; source checksums and copyright notice preserved.')
