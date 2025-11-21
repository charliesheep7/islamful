import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const statePath = path.join(__dirname, 'state.json')

// Read state
let state = { en: 1, ar: 1 }
if (fs.existsSync(statePath)) {
  try {
    state = JSON.parse(fs.readFileSync(statePath, 'utf8'))
  } catch (e) {
    console.error('Error reading state.json, using defaults', e)
  }
}

console.log(`Starting generation with state: EN=${state.en}, AR=${state.ar}`)

try {
  // Run English generation
  console.log(`Generating English article #${state.en}...`)
  execSync(`node generate-en.js ${state.en}`, {
    cwd: __dirname,
    stdio: 'inherit',
  })
  state.en += 1

  // Run Arabic generation
  console.log(`Generating Arabic article #${state.ar}...`)
  execSync(`node generate-ar.js ${state.ar}`, {
    cwd: __dirname,
    stdio: 'inherit',
  })
  state.ar += 1

  // Update state file
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2))
  console.log(`Generation complete. New state: EN=${state.en}, AR=${state.ar}`)
} catch (error) {
  console.error('Error during generation:', error.message)
  process.exit(1)
}
