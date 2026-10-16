import { authConfig } from '@/utils/supabase/config'
import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { engagementLocales, type EngagementLocale } from '@/utils/engagement'
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const lang = engagementLocales.includes(params.lang as EngagementLocale)
    ? (params.lang as EngagementLocale)
    : 'en'
  return {
    title: `${copy[lang][0]} · Islamful`,
    referrer: 'no-referrer' as const,
    robots: { index: false, follow: false },
  }
}
export const dynamic = 'force-dynamic'
const copy = {
  en: [
    'Email preferences',
    'Stop receiving Islamful feature updates?',
    'Unsubscribe',
    'You have been unsubscribed.',
    'This link is incomplete. Use the unsubscribe link in your update email.',
    'We couldn’t update your preference. Please try again.',
  ],
  ar: [
    'تفضيلات البريد',
    'هل تريد إيقاف تحديثات ميزات إسلامفُل؟',
    'إلغاء الاشتراك',
    'تم إلغاء اشتراكك.',
    'الرابط غير مكتمل. استخدم رابط إلغاء الاشتراك في رسالة التحديث.',
    'تعذر تحديث تفضيلاتك. حاول مجددًا.',
  ],
  fr: [
    'Préférences e-mail',
    'Ne plus recevoir les nouveautés d’Islamful ?',
    'Me désabonner',
    'Votre désabonnement a été enregistré.',
    'Ce lien est incomplet. Utilisez le lien de désabonnement dans votre e-mail.',
    'Impossible de modifier votre préférence. Veuillez réessayer.',
  ],
  de: [
    'E-Mail-Einstellungen',
    'Keine Neuigkeiten von Islamful mehr erhalten?',
    'Abmelden',
    'Du wurdest abgemeldet.',
    'Dieser Link ist unvollständig. Nutze den Abmeldelink in deiner E-Mail.',
    'Deine Einstellung konnte nicht geändert werden. Bitte versuche es erneut.',
  ],
}
function validToken(token: unknown): token is string {
  return (
    typeof token === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token)
  )
}
async function unsubscribe(form: FormData) {
  'use server'
  const token = form.get('token'),
    locale = form.get('locale')
  const lang = engagementLocales.includes(locale as EngagementLocale) ? String(locale) : 'en'
  if (!validToken(token)) redirect(`/updates/unsubscribe?lang=${lang}`)
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
    secret = process.env.SUPABASE_SECRET_KEY
  if (!url || !secret) {
    const config = authConfig()
    let ok = false
    if (config) {
      try {
        const response = await fetch(`${config.url}/functions/v1/unsubscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: config.key,
            Origin: 'https://www.islamful.com',
          },
          body: JSON.stringify({ token }),
          signal: AbortSignal.timeout(15000),
          cache: 'no-store',
        })
        ok = response.ok
      } catch {
        /* Keep the confirmation page available for retry. */
      }
    }
    redirect(
      ok
        ? `/updates/unsubscribe?lang=${lang}&done=1`
        : `/updates/unsubscribe?lang=${lang}&error=1&token=${token}`
    )
  }
  const db = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } })
  const { error } = await db.from('update_subscribers').delete().eq('unsubscribe_token', token)
  if (error) redirect(`/updates/unsubscribe?lang=${lang}&error=1&token=${token}`)
  redirect(`/updates/unsubscribe?lang=${lang}&done=1`)
}
export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const lang = engagementLocales.includes(params.lang as EngagementLocale)
    ? (params.lang as EngagementLocale)
    : 'en'
  const t = copy[lang]
  return (
    <section className="mx-auto max-w-lg px-4 py-16" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <h1 className="mb-5 text-2xl font-semibold">{t[0]}</h1>
      {params.done === '1' ? (
        <p role="status">{t[3]}</p>
      ) : validToken(params.token) ? (
        <form action={unsubscribe} className="space-y-5">
          <p>{t[1]}</p>
          <input type="hidden" name="token" value={params.token} />
          <input type="hidden" name="locale" value={lang} />
          {params.error === '1' && <p role="alert">{t[5]}</p>}
          <button className="rounded-xl bg-[#327952] px-5 py-3 font-semibold text-white">
            {t[2]}
          </button>
        </form>
      ) : (
        <p>{t[4]}</p>
      )}
    </section>
  )
}
