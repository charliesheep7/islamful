# Daily adhkar

`/adhkar` and `/ar/adhkar` link to morning, evening and after-prayer routines. `/dhikr` remains the standalone tasbeeh counter. All source texts and links render on the server; counters, preferences and audio need JavaScript.

## Content

`data/adhkar.ts` defines the selected collections, exact Arabic supplications, concise original English explanations, source links, named grades and counts. They are not presented as an exhaustive catalogue or a mandatory overall order. A target of one where `countedInSource` is false is explicitly a checklist marker, not an asserted prescribed repetition count.

- Morning/evening short surahs: Abu Dawud 5082; three complete recitations of each. Post-prayer short surahs: Abu Dawud 1523, with one checklist reading of each.
- Sayyid al-Istighfar: Bukhari 6306.
- Morning “by You”: Abu Dawud 5068; evening: Ibn Majah 3868. Keep their cited wording/endings distinct; Tirmidhi 3391 has a different variant.
- Dominion/day/night supplication: Muslim 2723b. Morning/evening word and pronoun changes also checked against the author's Hisn al-Muslim page: https://binwahaf.com/ar/audio-book-lesson/1117/.
- Protection: Abu Dawud 5088; pardon/wellbeing: Abu Dawud 5074 (plural عوراتي variant); Knower of unseen/seen: Tirmidhi 3392; hundredfold praise: Muslim 2692; morning praise: Muslim 2726a; evening refuge: Tirmidhi 3604b.
- After prayer: Muslim 591 and 593a. Tasbih alternatives: Muslim 596a (33/33/34) or 597a (33/33/33 plus the final tahlil). The app never combines these as two required rounds.

The three Quran surahs reuse the pinned, verified reader corpus, its exact English translation, credits and notice. Only this Quran content has audio in this implementation. Listening never increments a recitation count. Non-Quran audio and phonetic transliteration are not provided or advertised.

Source checking is editorial, not independent scholarly approval. Do not add fixed repetition counts, timing boundaries, grades or outcome promises without matching evidence. Tests verify the catalog's invariants, not religious authenticity by themselves.

## Saved progress

The shared progress hook validates a versioned, bounded count map. Storage is local to this browser, keyed by routine; after-prayer sessions additionally require the user's explicit prayer choice and tasbih variant. The standalone counter has separate keys. English and Arabic share the same keys. Counts reset by the device's local calendar day, checked on a timer/focus and before a count change. No UTC-date assumption, prayer-completion inference, streak/reward score or backend account.

Current-page state continues when storage is blocked or quota-limited. Other tabs' persisted changes are read before writing and synchronized through storage events; localStorage does not provide transactional simultaneous cross-tab writes. Reset requires an explicit confirmation and removes only the selected session's stored counts. The old unsafe `islamful-dhikr-v2` record is not imported into the new session model and is left untouched; it used UTC dates and inferred prayer completion from rounds.

No new analytics or external request is made to save counts. The site's independently configured analytics is outside this component. Audio uses the existing allowlisted CDN only after an explicit request.

## Verification

Run the normal production build and `node --test tests/*.test.mjs`. With the production server on port 3098, run `node tests/adhkar-browser.mjs`; `TEST_BASE_URL` and `TEST_SCREENSHOT` are optional. Browser media is controlled to verify that audio does not count or restart on unrelated interactions; this does not verify every live audio file or physical mobile playback.
