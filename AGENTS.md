# SEO publishing work

For new SEO writing or keyword selection in this repository, read `docs/seo-publishing-queue.md` and inspect `data/seo/publishing-queue.json` first. Run `node scripts/publishing-queue.mjs --next` to find the highest-priority queued assignment, or use its action/locale filters.

Use the recorded existing target for updates instead of creating a duplicate from a keyword slug. A tool assignment needs a working tool. A queued item is not already source-reviewed or published; complete the appropriate source checks, validation and live verification. Preserve existing article metadata as directed by its assignment. Do not silently fall back to the legacy keyword sheet when the queue has no eligible item.

This does not introduce a new approval requirement or override the user’s explicit task, publishing authorization, app-review preferences or repository safety instructions. The old scheduled generator is separate and has not been migrated to this queue.
