/** Read aggregated sharing counts; no subscriber emails or credentials are printed. */
import { createClient } from '@supabase/supabase-js'
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const secret = process.env.SUPABASE_SECRET_KEY
if (!url || !secret) throw new Error('Load the server environment before running this report.')
const days = Number(process.argv[2] || 30)
if (!Number.isInteger(days) || days < 1 || days > 365) throw new Error('Choose 1–365 days.')
const db = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } })
const since = new Date(Date.now() - days * 86400000).toISOString()
const totals = new Map()
let offset = 0
for (;;) {
  const { data, error } = await db
    .from('share_events')
    .select('event,channel,locale,path,content_id')
    .gte('created_at', since)
    .order('created_at')
    .order('id')
    .range(offset, offset + 999)
  if (error) throw new Error('Could not load sharing report.')
  for (const row of data) {
    const key = JSON.stringify(row)
    totals.set(key, (totals.get(key) || 0) + 1)
  }
  if (data.length < 1000) break
  offset += 1000
}
const { count, error } = await db
  .from('update_subscribers')
  .select('*', { count: 'exact', head: true })
  .gte('created_at', since)
if (error) throw new Error('Could not load subscriber count.')
console.log(
  JSON.stringify(
    {
      since,
      subscribers: count,
      sharing: [...totals].map(([row, count]) => ({ ...JSON.parse(row), count })),
      note: 'Share clicks and native completions do not prove delivery. Arrivals count page visits, not unique people.',
    },
    null,
    2
  )
)
