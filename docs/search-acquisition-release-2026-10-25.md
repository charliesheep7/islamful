# Search entry point improvements — 2026-10-25

This release adds Prayer and Quran to the four-language navigation, selects related tools by the current reader task, and keeps tool recommendations in the visitor's language. The compact menu remains available below the desktop navigation breakpoint. The links are present in server-rendered HTML.

English Qibla, game and city-prayer metadata avoid appending the brand twice. Wordle metadata describes the existing daily five-letter, six-attempt game and hint. No additional game functionality is claimed.

The English leaving-home dua now appears before its decorative image. The lobster answer appears before its hero in all four languages. Original titles, publication dates, authors, URLs and image identities are preserved.

## Scoped content source review

Agent review on 2026-10-25, not an independent scholar certification:

- [Darul Iftaa Chicago, Eating Lobster](https://daruliftaa.us/fatwa/361/), answered by Mufti Mahdi I. Chowdhury and checked by Mufti Abrar Mirza: the Hanafi distinction concerns classification as fish. Removed the unsupported scales requirement from the lobster articles and FAQs.
- [SeekersGuidance, Faraz Rabbani on lobster and shrimp](https://seekersguidance.org/answers/hanafi-fiqh/is-lobster-permissible-according-to-the-hanafi-school/): lobster and shrimp must not be collapsed into the same ruling. Corrected the blanket shrimp prohibition and linked the explanation.
- [SeekersGuidance, Is It Permissible To Eat Shrimp?](https://seekersguidance.org/answers/hanafi-fiqh/is-eat-permitted-to-eat-shrimp/): independently checked the distinction and preparation caveat.
- Removed unsupported claims about a universal live-boiling consensus and freshwater species being outside the permission. This does not add a replacement ruling on those topics.

The review covers these specific changes, not every inherited statement in the site's article library. The existing researched publishing queue is unchanged and validates successfully.

## Validation before release

- Node 22 production build passed, 583 content documents and 1,584 generated routes.
- Targeted ESLint and build type checking passed.
- Publishing queue validation passed, 165 assignments.
- HTTP checks across 15 distinct routes verified status 200, canonical, language, server-rendered Prayer/Quran links, localized Tahajjud → night-tool links, article source links and selected nonduplicated titles.
- Browser checks verified English article ordering and desktop navigation, and Arabic localized related links without horizontal overflow at the inspected desktop viewport.

Private GSC exports, research metrics, the detailed plan and deployment receipts remain in the owner's local report directory; they are not part of this public repository.

## Completion release: search intent, clusters and discovery

The second release source-checks and rewrites the sushi and nose-piercing answers in English, Arabic, French and German. Sushi distinguishes fish from non-fish seafood (eel is fish), does not claim sushi rice always needs mirin, and provides an ingredient checklist. Nose-piercing guidance attributes the Hanafi permission, custom condition and differing Shafi‘i-context guidance rather than inventing agreement among four schools. It separates permission to pierce from displaying adornment. Original titles, dates, authors, images and routes remain unchanged; summaries, FAQs and actual revision dates are updated.

Scoped agent source review, 2026-10-25:

- [Jamiatul Ulama KZN, Eating sushi?](https://jamiat.org.za/eating-sushi/), Mufti Suhail Tarmahomed: fish sushi conditional on the other ingredients.
- [Kikkoman, Sushi rice](https://www.kikkoman.com/en/cookbook/basic/rice/sushimeshi.html): a primary recipe with rice vinegar, sugar and salt, not a certification of other recipes.
- [Darul Iftaa Chicago, Non-Fish Seafood](https://daruliftaa.us/fatwa/322/), Mufti Sawad Alam, checked by Mufti Abrar Mirza: fish classification explicitly includes eel. The article separately cites the previously checked [Hanafi shrimp answer](https://seekersguidance.org/answers/hanafi-fiqh/is-eat-permitted-to-eat-shrimp/), avoiding an artificial consensus.
- [Faraz A. Khan, Are Nose Rings Allowed for Women?](https://seekersguidance.org/answers/hanafi-fiqh/are-nose-rings-allowed-for-women/): Hanafi permission for women and distinction for men.
- [Faraz Rabbani, Ear & Nose Piercings for Women](https://seekersguidance.org/answers/hanafi-fiqh/ear-nose-piercings-for-women/): customary acceptance condition.
- [Shazia Ahmad, Concealing a nose piercing](https://seekersguidance.org/answers/shafii-fiqh/if-i-get-my-nose-pierced-do-i-need-to-conceal-it-from-men/): differing guidance and a distinct question about display. No new scholar endorsement is claimed.

The already source-reviewed anime answer now precedes its image in all languages. Arabic, French and German leaving-home dua text also precedes the decorative image. A server-rendered related-reading component connects existing, published articles within Wudu, night prayer, Quran, daily adhkar and food topics; missing translations are omitted instead of generating nonexistent destinations. Quran chapters and adhkar routines link back to relevant guides. The component remains on the server and does not ship the article corpus to clients.

City prayer pages explain their actual configured time zone and default method, seasonal clock changes and the difference between calculated prayer starts and mosque iqamah schedules. No mosque endorsement or new calculation method is invented. English/Arabic WebPage modification dates depend on the returned schedule. Sitemap template revision dates now reflect this actual content release, not every future build clock.

Translated game and Arabic Qibla title handling avoids repeated brand suffixes. French/German home titles and article breadcrumbs are corrected. Four visible language-home links in the footer are present without opening a JavaScript menu, creating a crawlable path into every language.

Validation uses CLI, HTTP and the read-only GSC API. No computer use is performed for this completion release. Private full-crawl, link-graph, release and GSC receipts remain outside this public repository. An unavailable local Aladhan request exercises the existing empty-state behavior; an HTTP 200 alone does not establish that a timetable loaded. Live London HTML was independently checked to contain dated prayer data and clock values.

The full rendered crawl includes sitemap URLs plus blog pagination. It identified English archive pages 30–31 advertising six nonexistent Arabic/French/German equivalents. Archive hreflang now counts published posts per language and includes only valid counterpart pages. English archive generation and pagination exclude drafts consistently. This does not redirect or delete articles.
