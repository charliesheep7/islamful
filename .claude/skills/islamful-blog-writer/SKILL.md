---
name: islamful-blog-writer
description: Publish source-reviewed Islamful articles from the researched SEMrush assignment queue, with hero images and verified release tracking.
---

# Islamful researched publishing

Claude authors the articles. Read `AGENTS.md`, `docs/seo-publishing-queue.md` and `data/seo/publishing-queue.json` from the current checkout first. The JSON queue is the sole work and completion tracker. Never select from the legacy keywords.csv, written.csv, Google Sheet or invented keyword variants. No OpenAI API key is required.

## Selection

The existing Desktop task publishes up to two English article assignments per day, including updates; its 14:00 catch-up fills only the daily shortfall. Use the lifecycle guard's returned target, not a new quota. Run `node scripts/publishing-queue.mjs --validate`. Inspect `--locale en --status awaiting_release` first and finish pending releases before writing. Then use `--locale en --action new_article` and `--locale en --action update_article`, merging eligible rows in ascending priority then ID order. Keep the supplied exact source file and URL; read all brief_addenda, research_additions, observations and related-page cautions. Tools remain implementation tasks and must not become prose placeholders. Exhaustion means report it and stop; never replenish with unresearched keywords.

## Author a reviewed bundle

1. Run `node scripts/article-publisher.mjs --prepare --id ID`; read `.publishing-runs/ID/context.json`. For an update read the full existing page. Preserve its title, original date, author and image metadata.
2. Retrieve and read actual primary references with the available source-reading tools; retain exact text and hashes privately in `.publishing-runs/ID/`. At least two checked sources are required. A guessed URL, citation from memory, error page or stale audit is not a checked source. Respect source access errors and choose another legitimate source or report the blocker. No fabricated scholarly/medical claims or search metrics.
3. Write a useful native article around its distinct reader task: clear answer, concise purposeful sections, primary evidence and a useful next step. Islamful serves everyday Muslim needs; link the relevant existing tool and related guides. It has no app: no app-store CTA, fabricated diagnostic result or unsupported religious certainty. Avoid filler FAQs, duplicate subtitles, mandatory template word counts and keyword-swapped pages. Old seo-prompts.ts templates are optional background only, never the selection or structure authority.
4. Supply `.publishing-runs/ID/bundle.json` using the contract in `scripts/article-publisher.mjs`: id, assignment/baseline hashes; article with title/summary/tags/faqs/body; checked sources with url/title/supports/checked_at/content_sha256; review with method agent_source_review, passed/issues/notes, exact article hash and claim_checks. Body is plain Markdown. The fixture in tests/article-publisher.mjs explains the schema but is synthetic, never evidence.
5. New articles need a suitable inspected hero. Prefer a relevant approved project-owned generated illustration; otherwise use the existing local hero generator, inspect its result, and do not claim it is AI-generated. Include `article.hero: {src, alt, sha256}` before computing the review hash. Updates retain their original hero. No image API/key is required. Do not duplicate the hero in the body.
6. Apply through `node scripts/article-publisher.mjs --apply .publishing-runs/ID/bundle.json`. Do not bypass this by writing raw MDX or editing its rendered output afterward. It writes the article, audit and awaiting_release status; new articles use the truthful editorial byline. Keep private context/bundle/source files for lifecycle gate revalidation.

## Validate and publish live

Run `node --test tests/publishing-queue.mjs tests/article-publisher.mjs`, the canonical article gate `node scripts/claude-publishing-gate.mjs data/blog/en/SLUG.mdx`, inspect links and hero, and run the full production build. Use the existing Desktop guard stages, deadlines and exact-file receipts. Fix failures without bypassing hooks. Stage only the article, its new hero, queue, its publication audit and generated tag counts. No app/tool/source-code edits in an unattended blog run. Preserve unrelated changes and remote progress; never force-push.

After commit, rerun the gate on committed bytes and record the guard receipt again, then use the guarded push. Report pushed content as pending until the exact production deployment and page marker match. The existing GitHub workflow verifies pending releases and commits the verified queue/audit state; leave metadata-only finalization to it in Desktop runs, since the Desktop quota hook expects an article change. Dispatch that existing workflow after deployment when available. If verification fails, keep awaiting_release and report the exact issue; never create replacement pages to hide a failed release. Check canonical, sitemap, live hero and useful tool links. IndexNow is separate and does not prove Google indexing.

Report assignment IDs, new/update counts, URLs, exact commit, verified versus pending status and remaining eligible queue counts. Follow the actual daily target and deadline; there is no extra catch-up quota.

## Bounded bundle writing (October 25)

Use the checked-in `scripts/build-reviewed-bundle.mjs` for bundle assembly. Do not create a new helper script or use Desktop Write/Edit for private draft files outside the original checkout; the October 25 run stalled on that tool call before any article was saved. Author one JSON spec and pass it to the helper on stdin through the existing guarded Bash command with a quoted heredoc. The helper reads the prepared context and saved source captures, computes hashes, validates the explicit review and writes the bundle atomically. It never writes a review decision for you.

Spec fields: `id`, `article` (normal publisher fields), `sources` entries with `capture` (e.g. `src/quran_com_5_6.json`), `title`, `supports`, and `review` with explicit `method`, `passed`, `issues`, `notes`, `claim_checks`. Each claim check needs `claim`, `source_url`, `explanation`, `supported`. Capture files must contain actual retrieved `text`, `url`, `checked_at`, `content_sha256`. Review them before using them. An existing bundle is never overwritten; inspect and reuse it, or preserve it under a distinct backup name before deliberate revision. Do not import executable draft specs.

```sh
python3 /Users/sihancheng/.claude/scheduled-tasks/publishing-runtime/guard.py exec --site islamful --run RUN --seconds 30 -- node scripts/build-reviewed-bundle.mjs <<'REVIEWED_SPEC'
{ "id": "REPLACE_WITH_ACTUAL_ID_AND_COMPLETE_REVIEWED_SPEC" }
REVIEWED_SPEC
```

The JSON above is a schema reminder, not a valid article or source evidence. Read `output_file` after each bounded command. Apply and gate the first completed article before beginning the second. Keep the existing daily quota, source checks and release verification.
