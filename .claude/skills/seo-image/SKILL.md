---
name: seo-image
description: Generate a hero image for an Islamful blog post using Gemini 2.5 Flash image generation
---

# SEO Hero Image Generator

Generate a hero image for an Islamful blog post using the Gemini 2.5 Flash image generation API.

**Input**: `$ARGUMENTS` should be: `SLUG: [slug] | TITLE: [article title]`

## Image Prompt Rules

Read the `IMAGE_PROMPT_RULES` constant from `data/seo-prompts.ts`. It defines the exact style and rules for generating image prompts. Key points:

- **Style**: John Singer Sargent-inspired oil painting with expressive, visible brush strokes — EVERY image must use this style
- **Palette**: Warm and muted — cream, green, gold tones (Islamful brand)
- **Subject**: ONE clear, central visual concept representing the article topic
- **Format**: Short descriptive phrases, not sentences. Always end with "John Singer Sargent-inspired oil painting, expressive visible brush strokes"
- **Forbidden**: No text/logos, no prophets/God/angels, no detailed faces (silhouettes or from behind only)

Follow the examples in `IMAGE_PROMPT_RULES` to craft your image generation prompt.

## Steps

1. **Read `data/seo-prompts.ts`** and find the `IMAGE_PROMPT_RULES` constant. Follow its rules exactly to craft an image prompt for the given article title.

2. **Load the API key**:

   ```bash
   export GEMINI_API_KEY=$(grep GEMINI_API_KEY .env.local | cut -d= -f2)
   ```

3. **Generate the image** using the Gemini 2.5 Flash Image API:

   ```bash
   curl -s "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=$GEMINI_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "contents": [{
         "parts": [{
           "text": "Generate an image: [YOUR CRAFTED PROMPT FROM IMAGE_PROMPT_RULES]"
         }]
       }],
       "generationConfig": {
         "responseModalities": ["TEXT", "IMAGE"]
       }
     }'
   ```

4. **Parse the response** — the image data is in `candidates[0].content.parts[]` as `inlineData.mimeType` and `inlineData.data` (base64).

5. **Save the image** — decode base64 and save to `public/static/images/blog/[SLUG].webp`:

   ```bash
   # If returned as PNG/JPEG, convert to WebP
   echo "[base64_data]" | base64 -d > /tmp/hero.png
   sips -s format webp /tmp/hero.png --out public/static/images/blog/[SLUG].webp

   # If already WebP
   echo "[base64_data]" | base64 -d > public/static/images/blog/[SLUG].webp
   ```

6. **Verify** the file exists and has a reasonable size (> 10KB).

7. **Confirm** the image path matches the blog frontmatter: `images: ['/static/images/blog/[SLUG].webp']`

## Important

- Always read `IMAGE_PROMPT_RULES` from `data/seo-prompts.ts` — do NOT hardcode image prompts
- Target dimensions: 1200x630 (2:1 aspect ratio for OG images)
- Always save as WebP for performance
- If image generation fails (API error, rate limit), note it in the output and continue
