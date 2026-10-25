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
