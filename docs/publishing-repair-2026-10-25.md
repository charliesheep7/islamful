# Publishing recovery — October 25, 2026

The October 25 Desktop run stopped receiving tool results at a Write call that would create a generic bundle-builder script. It reached the watchdog deadline without saving either article. This does not establish whether the tool host or a permission prompt was the underlying cause. Increasing the writing timeout again would not fix that missing result.

The existing Claude task now uses `scripts/build-reviewed-bundle.mjs` through its bounded Bash wrapper with JSON stdin. The helper consumes prepared queue context and real source captures, retains explicit review decisions, validates the result and refuses to overwrite an existing bundle. It does not generate prose, call an LLM, choose keywords, fabricate source hashes or automatically pass a review. The existing daily quota, locks, receipts, production verification and researched queue remain in effect.

For this owner-requested recovery, Codex completed source review and writing of the two queued assignments the stalled run had prepared: is-064 (eating and wudu), is-065 (music and wudu). The original captures and inspected project-owned hero assets were retained. Audit notes distinguish this manual recovery from Claude authorship. Normal scheduled authorship remains Claude; successful future Desktop execution is not inferred from these repairs.

A metadata-only search snippet adjustment targets `/blog/is-lottery-haram`, based on finalized GSC October16–22 query/device data. Original article identity, canonical and hreflang remain unchanged. Compare the next complete seven-day window once available; short-run changes do not prove causation.

Validation: publisher and queue unit tests, bounded-builder rejection/overwrite tests, both canonical article gates, and full production build. Live status requires the release verifier's exact deployed commit and article marker checks.
