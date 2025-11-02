import fetch from 'node-fetch'
import { google } from 'googleapis'
import fs from 'fs-extra'
import path from 'path'

class IndexingService {
  constructor() {
    this.siteUrl = 'https://fapulous.com'
  }

  /**
   * Request Google to index a new URL using Search Console API
   */
  async requestGoogleIndexing(url, serviceAccountPath) {
    try {
      if (!fs.existsSync(serviceAccountPath)) {
        console.log('⚠️  Google Service Account file not found, skipping Google indexing')
        return { success: false, reason: 'No service account' }
      }

      // Load service account credentials
      const credentials = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'))

      // Create JWT client
      const jwtClient = new google.auth.JWT(
        credentials.client_email,
        null,
        credentials.private_key,
        ['https://www.googleapis.com/auth/webmasters']
      )

      // Authenticate
      await jwtClient.authorize()

      // Create Search Console client
      const searchconsole = google.searchconsole({ version: 'v1', auth: jwtClient })

      // Request indexing
      console.log(`🔍 Requesting Google to index: ${url}`)

      const response = await searchconsole.urlInspection.index.request({
        siteUrl: this.siteUrl,
        requestBody: {
          inspectionUrl: url,
        },
      })

      console.log('✅ Google indexing request successful')
      return { success: true, response: response.data }
    } catch (error) {
      console.error('❌ Google indexing request failed:', error.message)
      return { success: false, error: error.message }
    }
  }

  /**
   * Submit URL to IndexNow (Microsoft/Yandex, also helps with Google)
   */
  async submitToIndexNow(urls, apiKey) {
    try {
      if (!apiKey) {
        console.log('⚠️  IndexNow API key not provided, skipping')
        return { success: false, reason: 'No API key' }
      }

      const hostname = 'fapulous.com'
      const keyLocation = `https://${hostname}/${apiKey}.txt`

      console.log(`📤 Submitting to IndexNow: ${urls.length} URLs`)

      const response = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Fapulous-Blog-Generator',
        },
        body: JSON.stringify({
          host: hostname,
          key: apiKey,
          keyLocation: keyLocation,
          urlList: urls,
        }),
      })

      if (response.ok) {
        console.log('✅ IndexNow submission successful')
        return { success: true, status: response.status }
      } else {
        const errorText = await response.text()
        console.error('❌ IndexNow submission failed:', response.status, errorText)
        return { success: false, error: `HTTP ${response.status}: ${errorText}` }
      }
    } catch (error) {
      console.error('❌ IndexNow submission error:', error.message)
      return { success: false, error: error.message }
    }
  }

  /**
   * Ping search engines about sitemap updates
   */
  async pingSitemaps() {
    try {
      const sitemapUrl = `${this.siteUrl}/sitemap.xml`
      const pingUrls = [
        `https://www.google.com/ping?sitemap=${sitemapUrl}`,
        `https://www.bing.com/ping?sitemap=${sitemapUrl}`,
      ]

      console.log('🔔 Pinging search engines about sitemap update...')

      const results = await Promise.allSettled(
        pingUrls.map(async (url) => {
          const response = await fetch(url, {
            method: 'GET',
            timeout: 10000,
          })
          return { url, status: response.status, ok: response.ok }
        })
      )

      const successful = results.filter((r) => r.status === 'fulfilled' && r.value.ok)
      console.log(`✅ Sitemap ping successful: ${successful.length}/${results.length}`)

      return {
        success: successful.length > 0,
        results: results.map((r) => (r.status === 'fulfilled' ? r.value : r.reason)),
      }
    } catch (error) {
      console.error('❌ Sitemap ping failed:', error.message)
      return { success: false, error: error.message }
    }
  }

  /**
   * Request indexing using all available methods
   */
  async requestIndexing(blogSlug, options = {}) {
    const url = `${this.siteUrl}/blog/${blogSlug}`
    const results = {}

    console.log(`\n🚀 Requesting indexing for: ${url}`)

    // Method 1: Google Search Console API
    if (options.googleServiceAccount) {
      results.google = await this.requestGoogleIndexing(url, options.googleServiceAccount)
    }

    // Method 2: IndexNow
    if (options.indexNowKey) {
      results.indexNow = await this.submitToIndexNow([url], options.indexNowKey)
    }

    // Method 3: Sitemap ping (always try this)
    results.sitemap = await this.pingSitemaps()

    // Summary
    const successCount = Object.values(results).filter((r) => r.success).length
    const totalMethods = Object.keys(results).length

    console.log(`\n📊 Indexing Summary: ${successCount}/${totalMethods} methods successful`)

    if (successCount === 0) {
      console.log(
        '⚠️  All indexing methods failed - the blog post may take longer to appear in search results'
      )
    } else {
      console.log('✅ Blog post submitted for indexing - should appear in search results faster')
    }

    return results
  }
}

export default IndexingService
