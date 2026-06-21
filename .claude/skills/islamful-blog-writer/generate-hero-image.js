#!/usr/bin/env node

/**
 * Islamful Blog Hero Image Generator — LOCAL, no API (static gradient + grain)
 *
 * This is THE hero-image method for the blog pipeline (mirrors DeenUp): every post's
 * hero is generated locally, with NO external API call. It renders a 1200x630 WebP:
 * a linear gradient from Islamful's brand palette (warm cream + brand green #327952 +
 * soft gold) with a film-grain overlay and the article title in a large serif.
 * Deterministic from the slug — the same slug always produces the same image, so it
 * is stable and never depends on a network, key, or image-format conversion.
 *
 * Usage:
 *   node generate-hero-image.js <slug> [palette] [title]
 *
 * Palettes: dawn | meadow | sand | forest | garden  (default: auto — hashed from slug)
 *
 * Title: 3-6 words rendered centered in a large serif. If omitted, derived from the
 * slug (kebab-case → Title Case, first 6 words).
 *
 * Output: public/static/images/blog/<slug>.webp  (matches Islamful frontmatter:
 *   images: ['/static/images/blog/<slug>.webp'])
 *
 * Dependencies: sharp. Resolved from the project first, then this skill's own
 * node_modules (auto-installed once as a reliable fallback), then global.
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const { execSync } = require('child_process')

// Repo root = three levels up from .claude/skills/islamful-blog-writer
const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..')
const SKILL_DIR = __dirname
const WIDTH = 1200
const HEIGHT = 630

// Islamful brand tokens (green #327952 + cream #F6F5EE + soft gold)
const C = {
  // Brand green scale
  green50: '#eef5f0',
  green100: '#d6e7dd',
  green200: '#aecfbb',
  green300: '#7fb295',
  green400: '#549775',
  green500: '#327952', // brand green
  green600: '#2a6645',
  green700: '#235338',
  green800: '#1d4530',
  green900: '#173726',
  green950: '#0d2018',

  // Warm cream / sand neutrals
  cream: '#F6F5EE', // main bg
  cream100: '#efeee3',
  sand200: '#e6e3d4',
  sand300: '#d2cdb8',

  // Soft gold accent (warmth)
  gold: '#c8a24c',
  goldLight: '#e6c878',

  // Ink
  ink: '#1d2b22',
  ink900: '#13201a',
}

// Curated palettes. `ink` = title text color that contrasts the gradient.
const PALETTES = {
  // Light, airy cream → soft green tints; calm/welcoming (duas, beginners, reflection)
  dawn: {
    angle: 125,
    stops: [C.cream, C.green50, C.green100, C.green200],
    glowColor: C.goldLight,
    glowPos: { cx: 72, cy: 28 },
    ink: C.ink900,
  },
  // Mid brand green; everyday how-to guides
  meadow: {
    angle: 135,
    stops: [C.green300, C.green500, C.green600, C.green800],
    glowColor: C.green200,
    glowPos: { cx: 28, cy: 26 },
    ink: C.cream,
  },
  // Neutral warm cream/sand; explainers, reference, history
  sand: {
    angle: 150,
    stops: [C.cream, C.cream100, C.sand200, C.sand300],
    glowColor: C.green200,
    glowPos: { cx: 76, cy: 74 },
    ink: C.ink900,
  },
  // Deep green → near-black; serious/solemn topics (death, judgment, hardship)
  forest: {
    angle: 145,
    stops: [C.green600, C.green800, C.green900, C.ink900],
    glowColor: C.green400,
    glowPos: { cx: 30, cy: 30 },
    ink: C.cream,
  },
  // Saturated brand green; strong/motivational topics
  garden: {
    angle: 130,
    stops: [C.green400, C.green500, C.green600, C.green800],
    glowColor: C.goldLight,
    glowPos: { cx: 70, cy: 30 },
    ink: C.cream,
  },
}

function hashPick(str, arr) {
  const hash = crypto.createHash('sha256').update(str).digest()
  return arr[hash[0] % arr.length]
}

function angleToPoints(angle) {
  const rad = ((angle - 90) * Math.PI) / 180
  const dx = Math.cos(rad)
  const dy = Math.sin(rad)
  return {
    x1: `${50 - dx * 50}%`,
    y1: `${50 - dy * 50}%`,
    x2: `${50 + dx * 50}%`,
    y2: `${50 + dy * 50}%`,
  }
}

function slugToTitle(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .slice(0, 6)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')
}

// Greedy wrap into up to `maxLines` balanced lines by character budget.
function wrapTitle(title, maxCharsPerLine = 22, maxLines = 3) {
  const words = title.trim().split(/\s+/).filter(Boolean)
  const lines = []
  let cur = ''
  for (let i = 0; i < words.length; i++) {
    const w = words[i]
    const candidate = cur ? `${cur} ${w}` : w
    if (candidate.length > maxCharsPerLine && cur) {
      lines.push(cur)
      cur = w
      if (lines.length === maxLines - 1) {
        cur = [w, ...words.slice(i + 1)].join(' ')
        break
      }
    } else {
      cur = candidate
    }
  }
  if (cur) lines.push(cur)
  return lines.slice(0, maxLines)
}

const TITLE_MAX_WIDTH = Math.floor(WIDTH * 0.7)

function fitFontSize(lines, maxPx = TITLE_MAX_WIDTH) {
  const longest = lines.reduce((m, l) => Math.max(m, l.length), 0)
  const base = lines.length === 1 ? 86 : lines.length === 2 ? 74 : 62
  const projected = longest * base * 0.52
  if (projected <= maxPx) return base
  return Math.floor((maxPx / (longest * 0.52)) * 0.98)
}

function escapeXml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function buildSvg(slug, paletteName, titleArg) {
  const name = paletteName || hashPick(slug, Object.keys(PALETTES))
  const p = PALETTES[name]
  if (!p) throw new Error(`Unknown palette: ${paletteName}. Choices: ${Object.keys(PALETTES).join(', ')}`)

  const title = titleArg ? titleArg.trim() : slugToTitle(slug)
  const titleLines = wrapTitle(title)

  const pts = angleToPoints(p.angle)
  const stops = p.stops
    .map((c, i) => {
      const offset = (i / (p.stops.length - 1)) * 100
      return `<stop offset="${offset.toFixed(1)}%" stop-color="${c}" />`
    })
    .join('')

  const seed = parseInt(crypto.createHash('md5').update(slug).digest('hex').slice(0, 4), 16) % 9999

  const titleSize = fitFontSize(titleLines)
  const lineHeight = titleSize * 1.08
  const titleBlockH = lineHeight * titleLines.length
  const titleYStart = HEIGHT / 2 - titleBlockH / 2 + titleSize * 0.82
  const inkColor = p.ink

  const titleTspans = titleLines
    .map(
      (line, i) =>
        `<tspan x="${WIDTH / 2}" y="${titleYStart + i * lineHeight}">${escapeXml(line)}</tspan>`
    )
    .join('')

  const isLightInk = inkColor === C.cream
  const shadow = isLightInk
    ? 'drop-shadow(0 2px 22px rgba(0,0,0,0.45))'
    : 'drop-shadow(0 1px 14px rgba(246,245,238,0.55))'

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="${pts.x1}" y1="${pts.y1}" x2="${pts.x2}" y2="${pts.y2}">
      ${stops}
    </linearGradient>
    <radialGradient id="glow" cx="${p.glowPos.cx}%" cy="${p.glowPos.cy}%" r="60%">
      <stop offset="0%" stop-color="${p.glowColor}" stop-opacity="0.45" />
      <stop offset="45%" stop-color="${p.glowColor}" stop-opacity="0.16" />
      <stop offset="100%" stop-color="${p.glowColor}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="vignette" cx="50%" cy="50%" r="80%">
      <stop offset="55%" stop-color="#000000" stop-opacity="0" />
      <stop offset="100%" stop-color="#000000" stop-opacity="${isLightInk ? 0.32 : 0.14}" />
    </radialGradient>
    <filter id="grainFine" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="1.9" numOctaves="2" seed="${seed}" stitchTiles="stitch" />
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.14 0" />
    </filter>
    <filter id="grainSoft" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="${seed + 1}" stitchTiles="stitch" />
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.40 0" />
    </filter>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)" />
  <rect width="${WIDTH}" height="${HEIGHT}" filter="url(#grainSoft)" opacity="0.40" style="mix-blend-mode: overlay" />
  <rect width="${WIDTH}" height="${HEIGHT}" filter="url(#grainFine)" opacity="0.45" style="mix-blend-mode: overlay" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#vignette)" />
  <text text-anchor="middle"
        font-family="'Libre Baskerville', 'Georgia', 'Iowan Old Style', serif"
        font-style="normal" font-weight="400" font-size="${titleSize}"
        letter-spacing="-0.5" fill="${inkColor}" opacity="0.98"
        style="paint-order: stroke; filter: ${shadow};">
    ${titleTspans}
  </text>
</svg>`
}

function resolveSharp() {
  const candidates = [
    path.join(PROJECT_ROOT, 'node_modules', 'sharp'),
    path.join(PROJECT_ROOT, 'node_modules', 'next', 'node_modules', 'sharp'),
    path.join(SKILL_DIR, 'node_modules', 'sharp'),
  ]
  for (const root of [PROJECT_ROOT, SKILL_DIR]) {
    try {
      const pnpmDir = path.join(root, 'node_modules', '.pnpm')
      if (fs.existsSync(pnpmDir)) {
        for (const entry of fs.readdirSync(pnpmDir)) {
          if (entry.startsWith('sharp@')) {
            candidates.push(path.join(pnpmDir, entry, 'node_modules', 'sharp'))
          }
        }
      }
    } catch {
      /* ignore */
    }
  }
  for (const candidate of candidates) {
    try {
      return require(candidate)
    } catch {
      /* try next */
    }
  }
  try {
    return require('sharp')
  } catch {
    return null
  }
}

// Resolve sharp, self-installing into the skill folder once if missing.
function ensureSharp() {
  let sharp = resolveSharp()
  if (!sharp) {
    console.error('sharp not found — installing into the skill folder (one-time, ~20s)...')
    try {
      execSync('npm install --no-audit --no-fund --loglevel=error', { cwd: SKILL_DIR, stdio: 'inherit' })
      sharp = resolveSharp()
    } catch (e) {
      console.error('Automatic sharp install failed:', e.message)
    }
  }
  if (!sharp) {
    console.error('Error: sharp is unavailable. Install it manually:')
    console.error(`  npm i sharp --prefix ${SKILL_DIR}`)
    process.exit(1)
  }
  return sharp
}

function outPathFor(slug) {
  const outputDir = path.join(PROJECT_ROOT, 'public', 'static', 'images', 'blog')
  fs.mkdirSync(outputDir, { recursive: true })
  return path.join(outputDir, `${slug}.webp`)
}

async function main() {
  const slug = process.argv[2]
  const paletteArg = process.argv[3]
  const titleArg = process.argv[4]
  if (!slug) {
    console.error('Usage: node generate-hero-image.js <slug> [palette] [title]')
    console.error(`Palettes: ${Object.keys(PALETTES).join(', ')}`)
    process.exit(1)
  }
  const sharp = ensureSharp()
  const svg = buildSvg(slug, paletteArg, titleArg)
  const outputPath = outPathFor(slug)
  await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile(outputPath)
  const stats = fs.statSync(outputPath)
  const pickedPalette = paletteArg || hashPick(slug, Object.keys(PALETTES))
  console.log('SUCCESS')
  console.log(`Slug:            ${slug}`)
  console.log(`Palette:         ${pickedPalette}`)
  console.log(`Image saved:     ${outputPath}`)
  console.log(`File size:       ${(stats.size / 1024).toFixed(1)} KB`)
  console.log(`Frontmatter use: images: ['/static/images/blog/${slug}.webp']`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
