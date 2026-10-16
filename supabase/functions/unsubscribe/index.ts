import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'
Deno.serve(async (req: Request) => {
  const reply = (status: number) =>
    Response.json({ ok: status === 200 }, { status, headers: { 'Cache-Control': 'no-store' } })
  if (req.method !== 'POST') return reply(405)
  if (
    !['https://www.islamful.com', 'https://islamful.com'].includes(req.headers.get('origin') || '')
  )
    return reply(403)
  if (!req.headers.get('content-type')?.startsWith('application/json')) return reply(415)
  try {
    const raw = await req.text()
    if (raw.length > 256) return reply(413)
    const { token } = JSON.parse(raw)
    if (
      typeof token !== 'string' ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token)
    )
      return reply(400)
    const db = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )
    const { error } = await db.from('update_subscribers').delete().eq('unsubscribe_token', token)
    return reply(error ? 503 : 200)
  } catch {
    return reply(400)
  }
})
