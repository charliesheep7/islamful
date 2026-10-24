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

Claude researches and writes from the canonical queue. No OpenAI API key is needed. The legacy batch entry point now prepares assignments only; it does not generate or publish articles. The scheduled workflow verifies already reviewed releases and is a clean no-op when no release is pending. It does not author content unattended.

```sh
node scripts/article-publisher.mjs --prepare --limit 10
node scripts/article-publisher.mjs --prepare --id ASSIGNMENT_ID
node scripts/article-publisher.mjs --apply .publishing-runs/ASSIGNMENT_ID/bundle.json
node scripts/article-publisher.mjs --verify FULL_PRODUCTION_COMMIT_SHA
node --test tests/publishing-queue.mjs tests/article-publisher.mjs
```

Prepare captures the full assignment, addenda and existing-file hash. The author checks primary sources, authors the article and supplies an `agent_source_review` bundle with exact article hash, scoped source evidence and supported claim checks. Apply validates evidence, links and hashes before writing. Failed checks stop publication without marking an assignment complete. Correct the bundle and retry; never invent evidence.

Updates preserve their existing metadata except summary, FAQs and lastmod. New articles use an explicit AI-assisted editorial byline. Full extracts and draft bundles stay in ignored `.publishing-runs`; committed audits contain source identities, hashes and review findings. This is not independent scholar or clinician review.

Run the full production build before publishing. An applied article remains `awaiting_release` until verification confirms a successful exact-commit Production deployment, matching article bytes and the live version marker. Concurrent edits stop verification instead of being overwritten. Failed releases stay pending. Tools remain separate implementation assignments. Islamful articles link to real site tools; the site has no app-download CTA.

New-article bundles may include `article.hero: { src, alt, sha256 }`. Use an inspected, project-owned raster image under `/static/images/`, descriptive plain alt text and its exact SHA-256. The publisher validates the local image, includes it in the article and image metadata, and records it in the audit. Release verification requires matching local, committed and public image bytes. Existing-article updates preserve their original image metadata. This is image support for reviewed bundles, not an automatic image generator or unattended article writer.

## Expanded SEMrush assignments (October 13)

119 article assignments are queued after merging the researched candidates into specific new or existing destinations. Additional tools, completed work and research-only items retain their own states. The larger queue is not a production-capacity ceiling or a claim that these articles have been written.

Schema version 2 retains the original CSV and adds `semrush-scale-evidence-2026-10-13.json`. Each new observation references a stable capture ID. Validation checks the evidence file checksum and compares the assignment's keyword, country, volume, KD, capture row and date against the captured record. Missing KD remains null. Provider session URLs and access tokens are excluded.

`research_additions` records the candidate-to-target decision; `brief_addenda` carries the merged questions, outline, source work and intent cautions. Writers must read these fields as well as the original brief. Completed assignments keep their original completion state. Enriching a completed row with a new query is not a claim that a new feature or new article was deployed.

Queries with the same task share one destination. Existing prayer guides own their rak‘ah variants; adjacent wudu cases are consolidated where one answer serves them; broad ruling references are lower priority than DeenBack recovery content. An old-year search observation is never relabelled as current-year demand. Mixed fasting queries require intent checks before drafting.

The selector remains read-only. The separate assignment publisher handles authoring and release state. Source checks and verified live release remain required; authoring happens in Claude without an API key.

A separate queued tool assignment, `is-165`, covers the Ramadan countdown/current-day extension. The existing timetable remains recorded as live; new feature work is not silently treated as already implemented.

## Reviewed tool releases

Implemented tools use `awaiting_tool_release`, separate from article publication. Each records its version marker, reviewed implementation files with SHA-256 hashes, and source-review document. Queue validation refuses changed or missing files. The article publisher does not process these rows. Verify the exact successful Production commit, both localized routes, actual calculation behavior, canonicals and sitemap before recording `live_reviewed`. Preserve the original observations.

## Claude Desktop routine — October 15

The enabled `daily-islamful-blogs` task reads the repository skill and this researched queue, with two English article assignments per day (new or update), at 10:00 and a 14:00 catch-up in Asia/Shanghai. The catch-up fills only the shortfall. The existing local lifecycle guard retains owner validation, one-writer lock, quotas, deadlines and exact article receipts. Its Islamful-specific adapter accepts publisher audits and queue records, counts updates toward the daily quota, and revalidates the exact context/bundle/rendered bytes. The old keyword/written CSVs are not used.

The GitHub scheduled release verifier finalizes live status; Claude writes and pushes reviewed content. Keep a pending release pending until the exact successful production deployment is verified. The Arabic queue and tool work remain separate; no French/German demand is invented from English queries.

## Deployment handoff — October 24

The existing release verifier also runs when a Production deployment succeeds. Claude should finish source review, validation, build and push, then retain `awaiting_release` and end its authoring session. It need not remain running to poll Vercel. The verifier still requires an exact production commit and matching public bytes/markers before recording `live_reviewed`. A failed or unavailable deployment stays pending. Manual workflow dispatch and the existing twice-daily verifier remain recovery paths.
