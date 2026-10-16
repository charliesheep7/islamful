import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
import { createHmac } from 'node:crypto'
import {
  engagementLocales,
  publicContentId,
  publicPath,
  shareChannels,
  shareEvents,
} from '../../../utils/engagement.ts'

function reply(status: number, ok = false) {
  return Response.json({ ok }, { status, headers: { 'Cache-Control': 'no-store' } })
}
Deno.serve(async (request: Request) => {
  if (
    !['https://www.islamful.com', 'https://islamful.com'].includes(
      request.headers.get('origin') || ''
    )
  )
    return reply(403)
  if (request.method !== 'POST') return reply(405)
  if (!request.headers.get('content-type')?.startsWith('application/json')) return reply(415)
  const raw = await request.text()
  if (raw.length > 2048) return reply(413)
  let input
  try {
    input = JSON.parse(raw)
  } catch {
    return reply(400)
  }
  if (!input || typeof input !== 'object') return reply(400)
  const path = publicPath(input.path)
  if (!path || !engagementLocales.includes(input.locale)) return reply(400)
  const subscriber = input.kind === 'subscribe'
  if (subscriber) {
    if (input.website) return reply(200, true) // Honeypot: do not store automated submissions.
    if (
      input.consent !== true ||
      typeof input.email !== 'string' ||
      input.email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())
    )
      return reply(400)
  } else if (
    input.kind !== 'share' ||
    (input.contentId != null && !publicContentId(path, input.contentId)) ||
    !shareEvents.includes(input.event) ||
    !shareChannels.includes(input.channel) ||
    typeof input.id !== 'string' ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.id)
  )
    return reply(400)
  const url = Deno.env.get('SUPABASE_URL')
  const secret = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!url || !secret) return reply(503)
  const db = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } })
  // Use only the hosting proxy's canonical header; never persist the raw address.
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const bucket = createHmac('sha256', secret)
    .update(`${subscriber ? 'email' : 'share'}:${new Date().toISOString().slice(0, 10)}:${ip}`)
    .digest('hex')
  const limit = await db.rpc('allow_engagement', {
    p_bucket: bucket,
    p_limit: subscriber ? 5 : 120,
  })
  if (limit.error) return reply(503)
  if (!limit.data) return reply(429)
  const result = subscriber
    ? await db
        .from('update_subscribers')
        .upsert(
          { email: input.email.trim().toLowerCase(), locale: input.locale, source_path: path },
          { onConflict: 'email', ignoreDuplicates: true }
        )
    : await db.from('share_events').upsert(
        {
          id: input.id,
          event: input.event,
          channel: input.channel,
          locale: input.locale,
          path,
          content_id: publicContentId(path, input.contentId),
        },
        { onConflict: 'id', ignoreDuplicates: true }
      )
  return result.error ? reply(503) : reply(200, true)
})
