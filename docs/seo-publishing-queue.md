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

## Existing publisher state

The old Google Sheet and repository topic/keyword files remain preserved. The legacy `seo-blog-generator/run-batch.js` uses numbered EN/AR JSONL lists and state counters, not these queue assignments. Its current English counter is38 but topic38 is absent. It can overwrite an existing target and falls back to original model output if its QA fails. This is not the workflow to feed all new rows into blindly.

The Islamful GitHub workflow is disabled for inactivity; the last visible runs in June failed. This change does not silently re-enable it. No scheduled publisher is migrated or re-enabled by this change. Future integration must consume these action types and completion records, handle exhausted queues cleanly, enforce no-overwrite and source/content validation, and verify a real run before claiming automatic publishing works.

Current entry point for an agent/editor is the selector above. Preserve unrelated existing publishing processes and successful content until their ownership and behavior are known.

## Expanded SEMrush assignments (October 13)

119 article assignments are queued after merging the researched candidates into specific new or existing destinations. Additional tools, completed work and research-only items retain their own states. The larger queue is not a production-capacity ceiling or a claim that these articles have been written.

Schema version 2 retains the original CSV and adds `semrush-scale-evidence-2026-10-13.json`. Each new observation references a stable capture ID. Validation checks the evidence file checksum and compares the assignment's keyword, country, volume, KD, capture row and date against the captured record. Missing KD remains null. Provider session URLs and access tokens are excluded.

`research_additions` records the candidate-to-target decision; `brief_addenda` carries the merged questions, outline, source work and intent cautions. Writers must read these fields as well as the original brief. Completed assignments keep their original completion state. Enriching a completed row with a new query is not a claim that a new feature or new article was deployed.

Queries with the same task share one destination. Existing prayer guides own their rak‘ah variants; adjacent wudu cases are consolidated where one answer serves them; broad ruling references are lower priority than DeenBack recovery content. An old-year search observation is never relabelled as current-year demand. Mixed fasting queries require intent checks before drafting.

The selector remains read-only. The scheduled generator has not yet been migrated; do not claim this expanded queue is unattended publishing. Source checks, authoring, validation and verified live release are still required for every queued item.

A separate queued tool assignment, `is-165`, covers the Ramadan countdown/current-day extension. The existing timetable remains recorded as live; new feature work is not silently treated as already implemented.
