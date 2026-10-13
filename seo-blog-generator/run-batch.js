// Prepare canonical assignments for Codex authoring; no API key or automatic publication.
import { main } from '../scripts/article-publisher.mjs'
await main(['--prepare', '--limit', process.env.SEO_BATCH_SIZE || '10']).catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
