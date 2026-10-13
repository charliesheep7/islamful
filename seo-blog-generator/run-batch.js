// Legacy entry point now delegates to the canonical assignment queue.
// Run from the repository root after installing root dependencies.
import { main } from '../scripts/article-publisher.mjs'
await main(['--generate', '--limit', process.env.SEO_BATCH_SIZE || '2']).catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
