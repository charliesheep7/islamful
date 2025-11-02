#!/usr/bin/env node

import { globSync } from 'glob'
import path from 'path'
import fs from 'fs-extra'
import chalk from 'chalk'
import { LinkAuditor } from './link-auditor.js'

async function findNewestMDX() {
  const blogDir = path.resolve('../content/blog')
  const files = globSync('*.mdx', { cwd: blogDir, absolute: true })
  if (files.length === 0) return null
  let newest = files[0]
  let newestMtime = (await fs.stat(newest)).mtimeMs
  for (const f of files.slice(1)) {
    const m = (await fs.stat(f)).mtimeMs
    if (m > newestMtime) {
      newestMtime = m
      newest = f
    }
  }
  return newest
}

async function main() {
  console.log(chalk.cyan('\n🔎 LLM Link Audit: Validating external links return HTTP 200'))
  const target = await findNewestMDX()
  if (!target) {
    console.log(chalk.yellow('No MDX files found to audit. Skipping.'))
    process.exit(0)
  }
  console.log(chalk.gray(`Auditing latest post: ${target}`))

  const auditor = new LinkAuditor()
  const result = await auditor.auditFile(target)

  console.log(chalk.gray(`Links checked: ${result.linksChecked}`))
  if (!result.ok) {
    console.log(
      chalk.red('\n❌ Link audit failed. The following links appear broken or suspicious:')
    )
    for (const f of result.failures) {
      console.log(` - ${chalk.yellow(f.url)} ${chalk.gray('→')} ${chalk.red(f.reason || 'not_ok')}`)
    }
    process.exit(1)
  }

  console.log(chalk.green('\n✅ All links appear valid (HTTP 200).'))
}

main().catch((err) => {
  console.error(chalk.red('Audit failed with error:'), err?.message || err)
  process.exit(1)
})
