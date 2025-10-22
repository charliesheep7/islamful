#!/usr/bin/env node

/**
 * Ensures the platform-specific lightningcss native binary exists.
 * This is required because npm omits optional platform packages when the lockfile
 * is generated on another OS, which breaks Vercel (Linux) installs.
 */

import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import https from 'node:https'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const log = (message) => {
  if (process.env.npm_lifecycle_event !== 'postinstall') {
    console.log(message)
  } else {
    console.log(`[lightningcss] ${message}`)
  }
}

const fail = (message, error) => {
  const details = error ? `\n${error.stack || error.message || error}` : ''
  console.error(`[lightningcss] ${message}${details}`)
  process.exit(1)
}

const resolveLightningcssDir = () => {
  try {
    const entry = require.resolve('lightningcss')
    return path.resolve(path.dirname(entry), '..')
  } catch {
    log('lightningcss package not found, skipping native binary check.')
    process.exit(0)
  }
}

const computePlatformIdentifier = () => {
  if (process.env.LIGHTNINGCSS_FORCE_PLATFORM) {
    return process.env.LIGHTNINGCSS_FORCE_PLATFORM
  }

  const parts = [process.platform, process.arch]

  if (process.platform === 'linux') {
    try {
      const { MUSL, familySync } = require('detect-libc')
      const family = familySync()
      if (family === MUSL) {
        parts.push('musl')
      } else if (process.arch === 'arm') {
        parts.push('gnueabihf')
      } else {
        parts.push('gnu')
      }
    } catch {
      if (process.arch === 'arm') {
        parts.push('gnueabihf')
      } else {
        parts.push('gnu')
      }
    }
  } else if (process.platform === 'win32') {
    parts.push('msvc')
  }

  return parts.join('-')
}

const ensurePackageInstalled = (pkgName) => {
  try {
    require.resolve(`${pkgName}/package.json`)
    return true
  } catch {
    return false
  }
}

const downloadTarball = (url, destination) =>
  new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination)
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(
            new Error(`Unexpected status code ${response.statusCode} while downloading ${url}`)
          )
          return
        }
        response.pipe(file)
        file.on('finish', () => file.close(resolve))
      })
      .on('error', (err) => {
        fs.unlink(destination, () => reject(err))
      })
  })

const main = async () => {
  const lightningcssDir = resolveLightningcssDir()
  const pkgJsonPath = path.join(lightningcssDir, 'package.json')

  let lightningcssPkg
  try {
    lightningcssPkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'))
  } catch (err) {
    fail('Unable to read lightningcss package.json to detect version.', err)
  }

  const version = lightningcssPkg.version
  const platformId = computePlatformIdentifier()
  const nativeModuleName = `lightningcss.${platformId}.node`
  const nativeModulePath = path.join(lightningcssDir, nativeModuleName)
  const optionalPackage = `lightningcss-${platformId}`

  if (fs.existsSync(nativeModulePath)) {
    log(`Found native binary ${nativeModuleName}, nothing to do.`)
    return
  }

  if (ensurePackageInstalled(optionalPackage)) {
    log(`Optional package ${optionalPackage} already present.`)
    return
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lightningcss-'))
  const tarballPath = path.join(tmpDir, `${optionalPackage}-${version}.tgz`)
  const extractDir = path.join(tmpDir, 'package')
  const downloadUrl = `https://registry.npmjs.org/${optionalPackage}/-/${optionalPackage}-${version}.tgz`

  log(`Downloading ${optionalPackage}@${version} from npm to install missing native binary.`)

  try {
    await downloadTarball(downloadUrl, tarballPath)
  } catch (err) {
    fail(`Failed to download ${optionalPackage}@${version}`, err)
  }

  const tarResult = spawnSync('tar', ['-xzf', tarballPath, '-C', tmpDir], { stdio: 'pipe' })
  if (tarResult.status !== 0) {
    const stderr = tarResult.stderr ? tarResult.stderr.toString().trim() : ''
    fail(
      `Unable to extract ${optionalPackage} tarball.`,
      tarResult.error || new Error(stderr || 'tar extraction failed')
    )
  }

  const extractedBinary = path.join(extractDir, nativeModuleName)
  if (!fs.existsSync(extractedBinary)) {
    fail(`Extracted tarball did not contain ${nativeModuleName}.`)
  }

  try {
    fs.mkdirSync(lightningcssDir, { recursive: true })
    fs.copyFileSync(extractedBinary, nativeModulePath)
    log(`Installed ${nativeModuleName} for ${optionalPackage}.`)
  } catch (err) {
    fail(`Failed to copy ${nativeModuleName} into lightningcss directory`, err)
  }
}

main().catch((err) => {
  fail('Unexpected error ensuring lightningcss native binary.', err)
})
