---
name: seo-index
description: Scan all site URLs for indexing status and submit non-indexed ones to IndexNow
---

# SEO Index — Bulk Indexing Scanner

Fetches all URLs from the islamful.com sitemap, checks their Google indexing status, and submits non-indexed URLs to IndexNow (Bing, Yandex, and other participating engines).

**Input**: `$ARGUMENTS` is optional:

- Empty (default) → scan ALL URLs from the sitemap and index any that aren't indexed
- `check` → only check indexing status, don't submit (dry run)
- `blog` → only scan blog URLs
- `cities` → only scan prayer-times city URLs
- `tools` → only scan tool page URLs
- `static` → only scan static pages
- A specific URL (e.g., `https://www.islamful.com/blog/is-music-haram`) → check and index just that URL

## Prerequisites

- Python 3 (standard library only — no external packages needed)
- IndexNow key: `58177d47b0dc5d40d790d5b276f81b2b` (key file at `public/58177d47b0dc5d40d790d5b276f81b2b.txt`)
- For indexing status checks: service account key at `google-indexing-key.json` + `cryptography` library

## Pipeline Steps

### Step 1: Fetch All URLs from Sitemap

Fetch the live sitemap to get every URL on the site:

```bash
curl -sL "https://www.islamful.com/sitemap.xml"
```

Parse the XML to extract all `<loc>` URLs. Group them into categories for reporting:

- **Static pages** (EN + AR): `/`, `/blog`, `/mission`, `/quran`, `/support`, `/privacy`, `/terms` and `/ar/` equivalents
- **Tool pages** (EN + AR): `/prayer-times`, `/haram-check`, `/dua`, `/quran` and `/ar/` equivalents
- **City pages** (EN + AR): `/prayer-times/[city-slug]` and `/ar/prayer-times/[city-slug]`
- **Blog posts** (EN + AR): `/blog/[slug]` and `/ar/blog/[slug]`

If `$ARGUMENTS` filters to a specific category, only keep those URLs.
If `$ARGUMENTS` is a specific URL, use only that URL.

Show: total URL count and breakdown by category.

### Step 2: Check Indexing Status

For each URL, check its indexing status using the Google URL Inspection API.

**Authentication**: Use the service account key at `google-indexing-key.json` to create a JWT and get an access token.

```python
import json, time, base64, urllib.request, ssl

# Load service account
with open('google-indexing-key.json') as f:
    sa = json.load(f)

# Create JWT
header = base64.urlsafe_b64encode(json.dumps({"alg": "RS256", "typ": "JWT"}).encode()).rstrip(b'=')
now = int(time.time())
claims = base64.urlsafe_b64encode(json.dumps({
    "iss": sa["client_email"],
    "scope": "https://www.googleapis.com/auth/webmasters.readonly",
    "aud": sa["token_uri"],
    "iat": now,
    "exp": now + 3600
}).encode()).rstrip(b'=')

# Sign with private key
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding as asym_padding

private_key = serialization.load_pem_private_key(sa["private_key"].encode(), password=None)
signature = private_key.sign(header + b'.' + claims, asym_padding.PKCS1v15(), hashes.SHA256())
jwt_token = header + b'.' + claims + b'.' + base64.urlsafe_b64encode(signature).rstrip(b'=')

# Exchange for access token
token_data = urllib.request.urlopen(urllib.request.Request(
    sa["token_uri"],
    data=urllib.parse.urlencode({
        "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
        "assertion": jwt_token.decode()
    }).encode(),
    headers={"Content-Type": "application/x-www-form-urlencoded"}
)).read()
access_token = json.loads(token_data)["access_token"]
```

**Inspect each URL**:

```python
import urllib.parse

def check_url(url, access_token):
    req = urllib.request.Request(
        "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
        data=json.dumps({
            "inspectionUrl": url,
            "siteUrl": "sc-domain:islamful.com"
        }).encode(),
        headers={
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
    )
    try:
        resp = json.loads(urllib.request.urlopen(req).read())
        verdict = resp.get("inspectionResult", {}).get("indexStatusResult", {}).get("verdict", "UNKNOWN")
        coverage = resp.get("inspectionResult", {}).get("indexStatusResult", {}).get("coverageState", "UNKNOWN")
        return {"url": url, "verdict": verdict, "coverage": coverage, "indexed": verdict == "PASS"}
    except Exception as e:
        return {"url": url, "verdict": "ERROR", "coverage": str(e), "indexed": False}
```

**IMPORTANT rate limiting**: The URL Inspection API has a quota of ~2,000 requests/day. Add a 1-second delay between requests. If there are more than 500 URLs, process in batches and warn the user about quota limits.

For city pages (which can number in the thousands), by default only check a random sample of 50 city URLs unless the user explicitly requests all with `$ARGUMENTS` = `cities`.

Show progress as URLs are checked:

```
Checking [X/Y]: [url] → [INDEXED / NOT INDEXED / ERROR]
```

### Step 3: Collect Non-Indexed URLs

After checking, separate URLs into:

- **Indexed**: verdict = "PASS"
- **Not indexed**: all other verdicts (NEUTRAL, FAIL, VERDICT_UNSPECIFIED, etc.)
- **Errors**: API errors or timeouts

Show summary table:

```
INDEXING STATUS REPORT
======================
Category         Total  Indexed  Not Indexed  Errors
─────────────────────────────────────────────────────
Static (EN)      7      5        2            0
Static (AR)      7      3        4            0
Tools (EN)       4      4        0            0
Tools (AR)       4      2        2            0
Cities (EN)      50*    30       20           0
Cities (AR)      50*    25       25           0
Blog (EN)        5      3        2            0
Blog (AR)        0      0        0            0
─────────────────────────────────────────────────────
TOTAL            127    72       55           0

* sampled (out of [total] total city pages)
```

If `$ARGUMENTS` is `check`, stop here and don't submit.

### Step 4: Submit Non-Indexed URLs to IndexNow

Submit all non-indexed URLs to IndexNow. This notifies Bing, Yandex, and other participating search engines (Google has started honoring IndexNow as well).

**IndexNow key**: `58177d47b0dc5d40d790d5b276f81b2b`
**Key file**: `public/58177d47b0dc5d40d790d5b276f81b2b.txt` (serves as verification)

IndexNow supports batch submission of up to 10,000 URLs in a single POST request.

```python
import urllib.request, json

def submit_indexnow(urls):
    indexnow_key = "58177d47b0dc5d40d790d5b276f81b2b"
    req = urllib.request.Request(
        "https://api.indexnow.org/indexnow",
        data=json.dumps({
            "host": "www.islamful.com",
            "key": indexnow_key,
            "keyLocation": f"https://www.islamful.com/{indexnow_key}.txt",
            "urlList": urls
        }).encode(),
        headers={
            "Content-Type": "application/json; charset=utf-8"
        }
    )
    try:
        resp = urllib.request.urlopen(req)
        return {"success": True, "status": resp.status, "urls_submitted": len(urls)}
    except urllib.error.HTTPError as e:
        return {"success": False, "status": e.code, "error": e.read().decode()}
    except Exception as e:
        return {"success": False, "error": str(e)}
```

Show result:

```
IndexNow: Submitted [N] URLs → [SUCCESS (HTTP 200/202) / FAILED: reason]
```

HTTP 200 or 202 = success. HTTP 422 = invalid key. HTTP 429 = rate limited.

### Step 5: Summary

```
INDEXING COMPLETE
=================
URLs Scanned:     [total]
Already Indexed:  [count]

IndexNow:
  Submitted:      [count]
  Status:         [SUCCESS (HTTP 200/202) / FAILED: reason]
  Engines:        Bing, Yandex, Seznam, Naver

SUBMITTED URLs:
  [url1] → IndexNow: Success
  [url2] → IndexNow: Success

FAILED URLs (need manual review):
  [url] — [error reason]

Next: run /seo-index again to check newly indexed pages.
```

## Important Notes

- **Never skip rate limiting** on the URL Inspection API (Step 2) — 1-second delay between requests
- City pages can number in the hundreds — always sample by default (50), warn about quota
- IndexNow supports batch submission of up to 10,000 URLs in a single request — no per-URL looping needed
- IndexNow key file must be accessible at `https://www.islamful.com/58177d47b0dc5d40d790d5b276f81b2b.txt`
- If `$ARGUMENTS` is `check`, stop after Step 3 — do not submit to IndexNow
- All Python code should be run with `python3 -c "..."` to stay within the allowed Bash permissions
- Combine the check + submit into a single Python script for efficiency when possible
