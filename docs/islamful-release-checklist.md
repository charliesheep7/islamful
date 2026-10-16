# Islamful login, sharing and multilingual release

User explicitly authorized production publication on 2026-10-15 after fixing issues and completing every-page translations. This is the release scope, not permission to publish an incomplete subset.

## Required before deployment

- Finish remaining tool pages: halal checking, fasting times, Ramadan calendar and city pages. Preserve concurrent Ramadan feature work.
- Translate blog listing/tag/pagination controls and every existing article into Arabic, French and German. Current source inventory: 143 English MDX articles in `data/blog/en`, no other blog-language directories. Preserve existing source metadata and review links/quotes. Do not advertise missing translations as complete.
- Complete prelaunch content checks noted in `docs/auth-and-sharing.md`: hadith grading attribution, Wordle spellings, privacy/analytics consistency, Quran source refresh checks and old English/Arabic mortgage guide claims.
- Verify Google sign-in through a real callback, production Supabase configuration and deployment environment. Email updates must remain an explicit opt-in; email/password sending is still deferred under the user's earlier instruction to skip sender setup.
- Verify sharing and attribution across every public tool/game/blog route, including private-input exclusion, failed/cancelled shares and PNG download tracking.
- Run production build and a full route/language/link audit; fix defects found. Previous feature tests are scoped evidence, not whole-site certification.
- Review current remote production changes against this dirty checkout before integrating. Do not overwrite concurrent Ramadan/publishing work. Current local branch at inspection: `codex/ramadan-countdown`, HEAD `041ba69`; production deployment history includes newer commits.
- Publish via the existing GitHub/Vercel production route and verify the exact released commit plus live sign-in, email opt-in, sharing, translations, canonical/hreflang and sitemap.

## Current evidence

- Repo: `charliesheep7/islamful`; production deployment 7056446906 at commit `59e1b775016ec05a654726a96d68e54be4d41662` reported success on 2026-10-14. This is deployment discovery, not release of our changes.
- Inheritance repair now has source-backed targeted cases and 3,888 arithmetic conservation checks. Four-language browser flows pass after repair. See source and verification details in `docs/auth-and-sharing.md`.
- Other completed features and outstanding limitations are recorded in `docs/auth-and-sharing.md`. Nothing from this task has yet been deployed.
