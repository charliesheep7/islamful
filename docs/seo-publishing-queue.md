# Islamful researched publishing queue

`data/seo/publishing-queue.json` is the current editorial work list for this growth project. Its 165 assignments group search variants by reader task, distinguish published work from remaining work, and retain original market-specific observations. The adjacent CSV is the original research evidence, not an article-per-row command. No search volumes are added together as an audience forecast.

## Choose work

Run from this repository (or invoke the script by absolute path):

```sh
node scripts/publishing-queue.mjs --validate
node scripts/publishing-queue.mjs --format markdown
node scripts/publishing-queue.mjs --next
node scripts/publishing-queue.mjs --action update_article --locale en --next
node scripts/publishing-queue.mjs --action new_article --next
node scripts/publishing-queue.mjs --status all
node --test tests/publishing-queue.mjs
```

Default output includes all queued work in priority order. `--next` is a convenience, not a production-capacity ceiling. Source-review, data and product-design tasks remain visible through `--status all`; completed rows are not selected again. A query with partial country data can still be supported by complete evidence in another market. Null is unknown, while a recorded zero stays zero.

The selector is read-only. It validates sources and destinations and emits a complete assignment with evidence, brief, related pages and next step. It never calls an AI API, changes files, updates counters or publishes. When nothing matches, it returns an empty plan and does not silently fall back to the old generic keyword sheet.

## Author and publish

1. Use the specified target path/source file. `update_article` means revise that exact existing article and retain title, original publication date, author and image. `new_article` must not overwrite an existing path. Existing related pages are a lexical review list, not proof of query cannibalization or authority to redirect them.
2. Check relevant primary sources as part of authoring. A queued row is an assignment, not a claim of completed source review. Respect scholarly differences, clinical distinctions and licensed data. Do not invent missing metrics or copy third-party articles. No separate human-approval gate is introduced by this queue.
3. Tool assignments require actual working inputs/results and suitable calculation/behavior verification. Do not send `new_tool` or `improve_tool` rows into a prose-only blog generator.
4. Connect the article to its useful next step. Link the appropriate Islamful utility. The site currently has no app, so do not add fictional app-download calls to action.
5. Run relevant content/link checks and the production build for website changes, review the diff and publish under the user’s standing production authorization. Verify the actual live page and corresponding deployment commit. A passing selector does not prove article quality or live publication.
6. Update the queue row after successful release: `action: live`, `status: live_reviewed`, actual source file, source-review state and release evidence (date/commit/URL). Keep metrics unchanged. Revalidate. Update/refine remaining briefs when evidence changes; do not reset progress by regenerating the October13 snapshot.

## Assignment publisher

`scripts/article-publisher.mjs` replaces the numbered EN/AR runner. The legacy `run-batch.js` delegates to it; numbered input files remain preserved. The scheduler keeps its existing cadence and accepts a configurable batch size (default 10 attempts, not a capacity ceiling). It selects queued articles only; tools retain their own implementation work.

```sh
node scripts/article-publisher.mjs --prepare --id ASSIGNMENT_ID
node scripts/article-publisher.mjs --generate --limit 10
node scripts/article-publisher.mjs --apply .publishing-runs/ASSIGNMENT_ID/bundle.json
node scripts/article-publisher.mjs --prepare --retry FAILED_ASSIGNMENT_ID
node scripts/article-publisher.mjs --verify FULL_PRODUCTION_COMMIT_SHA
node --test tests/publishing-queue.mjs tests/article-publisher.mjs
```

Prepare captures the complete brief/addenda and an existing-file hash. Generate uses the Responses API with primary-domain web search, fetches cited pages, writes a structured draft and performs a separate source/content review. It retains the previous default model, `gpt-5-mini-2025-08-07`; `SEO_MODEL` can configure it. See [web search](https://developers.openai.com/api/docs/guides/tools-web-search) and [structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs). Credentials stay in `OPENAI_API_KEY`, outside the repository.

An editor/agent can also provide a genuinely source-reviewed bundle through the same validator and guarded writer. Record `agent_source_review`; do not claim API generation or independent scholar/clinician review. The initial real articles use that route because no local API key or repository Actions secret was available during migration. **API-backed generation and unattended deployment still need their first verified real run.** Islamful's inactivity-disabled workflow is not silently described as running.

Failed reviews, stale evidence, unchecked links, executable MDX, invented individual bylines and stale assignment/file hashes stop publication. Updates retain existing metadata except summary, FAQs and lastmod. New articles use an explicit AI-assisted editorial byline and cannot overwrite a file. Full source extracts/drafts stay in ignored `.publishing-runs`; committed audits contain source identities, hashes, scoped claim checks and review method.

`awaiting_release` is separate from `live_reviewed`. A full production build runs before pushing content. Completion requires GitHub's successful Production deployment for the exact commit, matching article bytes at that commit and the version marker on the live canonical page. A failed deployment stays pending; the next scheduled run reconciles it before selecting another batch. Never regenerate it as a new article.

Source/draft/review failures become `needs_sources` with per-assignment failure details. Correct the cause and explicitly requeue with `--prepare --retry ID`. Successful assignments in a mixed batch may proceed only after the full build passes. Missing credentials fail before queue changes. There is no fallback to an unreviewed draft or a legacy topic. Failed source fetches need working primary-source access; they must not be replaced by invented evidence.

The checks reduce predictable publication errors. A model review is not religious or clinical expertise, and build success is not factual endorsement. DeenBack articles receive a truthful direct-download block. Enrolment in its optional recovery quiz remains an explicit reviewed entry in `data/recovery.ts`; broad reference articles do not automatically enter that cohort.

## Expanded SEMrush assignments (October 13)

119 article assignments are queued after merging the researched candidates into specific new or existing destinations. Additional tools, completed work and research-only items retain their own states. The larger queue is not a production-capacity ceiling or a claim that these articles have been written.

Schema version 2 retains the original CSV and adds `semrush-scale-evidence-2026-10-13.json`. Each new observation references a stable capture ID. Validation checks the evidence file checksum and compares the assignment's keyword, country, volume, KD, capture row and date against the captured record. Missing KD remains null. Provider session URLs and access tokens are excluded.

`research_additions` records the candidate-to-target decision; `brief_addenda` carries the merged questions, outline, source work and intent cautions. Writers must read these fields as well as the original brief. Completed assignments keep their original completion state. Enriching a completed row with a new query is not a claim that a new feature or new article was deployed.

Queries with the same task share one destination. Existing prayer guides own their rak‘ah variants; adjacent wudu cases are consolidated where one answer serves them; broad ruling references are lower priority than DeenBack recovery content. An old-year search observation is never relabelled as current-year demand. Mixed fasting queries require intent checks before drafting.

The selector remains read-only. The separate assignment publisher handles authoring and release state. Source checks and verified live release remain required; its API-backed scheduled path still needs a real credentialed run.

A separate queued tool assignment, `is-165`, covers the Ramadan countdown/current-day extension. The existing timetable remains recorded as live; new feature work is not silently treated as already implemented.
