# Today homepage

The English and Arabic homepages connect the existing daily tools: selected-city prayer times and fasting boundaries, explicitly saved Quran place, morning/evening adhkar cards and the calculated Islamic date. All tool links, explanatory content, a UTC reference date and native expandable FAQs are in the initial HTML. There is no app-download CTA, account requirement, automatic geolocation or new analytics event.

## State and date rules

- `islamful.today.v1` stores only a version, allowlisted city slug and calculation method. It is written only on explicit city/method selection. “Forget city” removes only this record. Blocked/quota-limited storage leaves the current page usable and shows a warning.
- Quran state is read from `islamful.quran.reader.v1` through the existing validated reader hook. The homepage never writes reader records or infers a reading position.
- Morning/evening completion summaries read `islamful.adhkar.v1.{morning,evening}.daily` with existing validated counts. They use the **device's local date**, just like the routines, even when a different prayer city is selected. The dashboard refreshes every 30 seconds and on focus/visibility/storage changes. It does not clear records or infer prayer completion.
- English and Arabic share these records on the same origin. They do not sync across devices or between separate hostnames. Concurrent local-storage writes are not transactional.
- The date uses the prayer city's timezone, then the saved calendar timezone, then the device timezone (UTC fallback). Saved calendar method/adjustment remain in effect. The homepage never overwrites calendar preferences. An unsupported calculation shows a failure message rather than silently substituting another method.
- Server content labels the UTC date as a **reference date**; the client calculates the current date after hydration. The page requests a five-minute revalidation interval where cacheable. The coming date after Maghrib is shown separately, not detected from sunset or declared as a moon-sighting decision.
- Prayer schedules reuse the dated city widget with separate actual next-day requests, timeout/abort guards and midnight refresh. Changing cities remounts the widget; changing method preserves the last valid dated results if a request fails, with its actual calculation-method label. Fajr/Maghrib fasting values come from the displayed schedule and disappear when the date is stale. No estimate fills a missing time.

## Validation

`node --test tests/*.test.mjs`, production build, changed-file lint, `tests/today-browser.mjs` and the existing `tests/prayer-city-browser.mjs` cover this change. The browser suite uses controlled prayer API responses; earlier prayer-tool work checked the live API. Manual visual inspection is recorded in the execution report. A successful preview is not a production launch or evidence of increased repeat visits.

Remaining work includes production release, live measurement of tool use and repeat visits, broader useful destinations and locale expansion. Quran Answers is an existing separate tool; this change removes its featured-homepage promotion but does not rewrite its behavior.
