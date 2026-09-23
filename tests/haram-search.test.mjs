import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { transform } from 'esbuild'

const source = readFileSync(new URL('../components/tools/haram-search.ts', import.meta.url), 'utf8')
const { code } = await transform(source, { loader: 'ts', format: 'esm' })
const { findLocalEntry } = await import(
  `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`
)

const entries = [{ name: 'pork' }, { name: 'dog' }, { name: 'tattoo' }, { name: 'stocks' }]

test('prewritten topics keep exact and simple plural search', () => {
  assert.equal(findLocalEntry('PORK?', entries)?.name, 'pork')
  assert.equal(findLocalEntry('dogs', entries)?.name, 'dog')
  assert.equal(findLocalEntry('tattoos', entries)?.name, 'tattoo')
  assert.equal(findLocalEntry('stocks', entries)?.name, 'stocks')
  assert.equal(findLocalEntry('Is pork haram in Islam?', entries)?.name, 'pork')
  assert.equal(findLocalEntry('Are tattoos haram?', entries)?.name, 'tattoo')
})

test('qualified and negated questions do not inherit a single-word ruling', () => {
  for (const query of [
    'pork-free',
    'not pork',
    'is pork-free haram',
    'is not pork haram',
    'without pork',
    'dog food',
  ]) {
    assert.equal(findLocalEntry(query, entries), null, query)
  }
})
