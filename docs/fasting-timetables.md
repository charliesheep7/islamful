# Fasting and Ramadan timetables

## Destinations and purpose

`/fasting-times` and `/ramadan-calendar`, with Arabic equivalents, support recurring suhoor/iftar use and seasonal planning. The Ramadan family includes the existing **49** city records in each language (98 city URLs). They are linked from both hubs, city prayer pages, the tools registry, homepage and sitemap. No app promotion, account, geolocation, fasting-completion inference or new analytics events are introduced.

Research basis: prior SEMrush observations include US iftar time 8,100/KD18, sehri time 1,600/KD18 and Ramadan calendar 2,900/KD15; UK 3,600/KD20, 590/KD19 and 2,400/KD35 respectively. These are dated research observations, not promises, city-level volumes or verified Arabic keyword demand. Broader "fasting times" had higher difficulty. The city pages provide actual dated utility rather than a renamed generic article.

## Date and time contracts

- The daily tool accepts city/date/method or explicit local Fajr and Maghrib plus an IANA timezone. Manual wall times reject invalid, nonexistent and ambiguous DST times. Duration is actual elapsed time.
- Ramadan defaults to the current Ramadan if in month 9, otherwise the upcoming Ramadan, determined in the selected city's timezone (UTC reference at the general hub). Umm al-Qura/tabular settings and ±2-day adjustment use the shared Hijri calendar implementation. These are estimates; no moon sighting or Eid date is asserted.
- Local mode accepts a user-entered first fasting day and 29 or 30 days. It does not verify a local announcement or assume that all entered days are religiously eligible to fast. Dates stay within the supported 1900–2100 range.
- The calendar API receives exact coordinates, method, timezone and `iso8601=true`. Every returned date, method, timezone and time offset is validated. Imsak and sunrise are never used as replacement Fajr. Missing times remain unavailable, including partial month outages; complete failure produces retry guidance.
- One/two Gregorian month requests cover a timetable. City pages render the initial timetable on the server with a 12-second timeout and one-hour fetch cache; interactive requests have a 20-second timeout and cancel/version guards. Changing settings immediately clears the old result so it cannot be shown under a new label.
- A countdown exists only for a row matching today's date in its timezone with both valid boundaries. It changes from Fajr to Maghrib, then says the displayed Maghrib has passed. It does not mark a fast complete. After midnight an old daily table remains dated and the countdown disappears; use "Use today" and submit to refresh.
- Initial city pages use their route's city rather than overwriting it from storage. General tools can reuse a validated stored city/method, including the Today homepage preference; fetching requires submit. Only city/method/version are saved after success. No dates, manual times, fasting eligibility or activity history are saved. Storage failure keeps calculation usable.
- CSV includes dates, Fajr/Maghrib, timezone, method, basis, missing-value status and preparation time. Downloads work offline for an already loaded result. Printing excludes controls and preserves the displayed timetable. Saved exports need local rechecking; they are not automatically updated.

## Sources and default correction

Guidance paraphrases Quran 2:187 (dawn to nightfall) and Sahih al-Bukhari 1909 (beginning/ending Ramadan), linking the exact references. It explains method differences and local authority rather than making personal eligibility rulings. No fabricated scholar review or certification.

Live Aladhan February/March 2027 London calendars were checked, including the March 28 DST change. Its methods endpoint identifies ID11 as MUIS Singapore and ID20 as Kementerian Agama Indonesia. The existing Jakarta/Bali defaults incorrectly used ID11 and it was absent from the method selector. This change supplies both language labels for 11/20 and defaults those two Indonesian records to 20. Visitors can still choose their community's method. This is a provider-method correction, not verification of every local mosque's timetable.

## Validation and limits

Tests cover strict provider validation, all catalog default labels, calendar ranges, month lengths, DST, missing months, cancellation, boundary countdowns and export provenance. Production-browser checks cover actual forms, saved choices, race/failure handling, manual/no-network calculation, Arabic input, local dates, partial outage, downloads, printing, blocked storage, mobile layout and no-JavaScript city HTML. Initial-HTML samples cover multiple timezones and both locales; sitemap/discovery checks cover every new URL. Current GSC cohort is 102 canonical routes, missing rows null and release date unset.

These tools do not yet provide reminders, make-up fasting records, health eligibility advice, individualized rulings or a complete Ramadan worship planner. They are draft-branch implementations; preview success does not establish production availability, indexing or traffic uplift.
