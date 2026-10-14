# Ramadan countdown and fasting-day view

Reviewed on 13 October 2026 for assignment is-165. This extends the existing timetable rather than creating country keyword pages.

The date basis remains a calculated planning estimate or the user's locally entered first fasting date and 29/30-day choice. [Sahih al-Bukhari 1909](https://sunnah.com/bukhari:1909), read for this change, describes starting and ending the month with the crescent and completing thirty days of Sha'ban when obscured. It does not establish a universally confirmed future Gregorian date. The existing page retains this source and local-confirmation guidance.

The new indicator counts civil fasting dates in the selected city's IANA timezone. It says “first fast” and “fasting day,” not the precise moment the religious month begins at sunset. It does not detect whether someone is fasting or declare Eid. The planned final date remains subject to the local announcement. An unspecified city explicitly uses UTC until a city is chosen.

Date selection is shared between the immediate indicator and submitted timetable. It uses the existing bounded Umm al-Qura/tabular calendar functions and correction setting, or a contiguous locally entered range. Invalid fields clear the indicator; API failure cannot remove a valid date-only result. Browser time updates the local date while the page is open. Server output is a dated “As of” snapshot, refreshed hourly through route revalidation; without JavaScript it does not pretend to be a live clock.

Existing city data covers Casablanca in Morocco, Dubai/Abu Dhabi in the UAE, and Mecca/Medina/Riyadh/Jeddah in Saudi Arabia. Their timezone/city selection is not a claim that a country has announced a Ramadan date. No new location detection, analytics or fasting history is collected. Existing saved city/method behavior is retained.

Verification must cover before/during/after, local midnight and different simultaneous city dates, 29/30-day endings, local overrides, calendar corrections and future years, invalid input, network failure, English/Arabic mobile, server snapshots and the existing daily fasting/timetable flows. Completion requires the exact production release and public checks, recorded separately in the publishing queue.
