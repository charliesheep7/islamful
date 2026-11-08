// next/image loader for Cloudflare Image Transformations, used by the Cloudflare
// build (CF_IMAGES=1). The zone serving the site must have Transformations enabled.
export default function cloudflareImageLoader({ src, width, quality }) {
  if (!src.startsWith('/') || src.endsWith('.svg')) return src
  return `/cdn-cgi/image/width=${width},quality=${quality || 75},format=auto${src}`
}
