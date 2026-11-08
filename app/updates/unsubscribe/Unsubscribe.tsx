'use client'

import { useEffect, useState } from 'react'
import { engagementLocales, type EngagementLocale } from '@/utils/engagement'

export const copy = {
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
const validToken = (token: string | null): token is string =>
  !!token && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(token)

/**
 * The page is prebuilt, so the link's ?lang, ?token, ?done and ?error are read in
 * the browser. The form posts to this same URL, where the Worker (worker/index.ts)
 * unsubscribes the token and redirects back with ?done=1 or ?error=1.
 */
export default function Unsubscribe() {
  const [params, setParams] = useState<URLSearchParams | null>(null)
  useEffect(() => setParams(new URLSearchParams(window.location.search)), [])
  const requested = params?.get('lang')
  const lang = engagementLocales.includes(requested as EngagementLocale)
    ? (requested as EngagementLocale)
    : 'en'
  const t = copy[lang]
  useEffect(() => {
    document.title = `${t[0]} · Islamful`
  }, [t])
  if (!params) return null
  const token = params.get('token')
  return (
    <section className="mx-auto max-w-lg px-4 py-16" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <h1 className="mb-5 text-2xl font-semibold">{t[0]}</h1>
      {params.get('done') === '1' ? (
        <p role="status">{t[3]}</p>
      ) : validToken(token) ? (
        <form method="post" action="/updates/unsubscribe" className="space-y-5">
          <p>{t[1]}</p>
          <input type="hidden" name="token" value={token} />
          <input type="hidden" name="locale" value={lang} />
          {params.get('error') === '1' && <p role="alert">{t[5]}</p>}
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
