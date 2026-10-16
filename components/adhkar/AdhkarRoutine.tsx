'use client'
import { localizedDhikr } from '@/data/locales/adhkar'
import { adhkarUi, adhkarDynamic } from '@/data/locales/adhkar-ui'
import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'
import { routineEntries, type RoutineId, type TasbihVariant } from '@/data/adhkar'
import { chapters, quranPath, type Verse } from '@/data/quran'
import QuranAudio from '@/components/quran/QuranAudio'
import { summary } from '@/utils/adhkar-progress'
import { useAdhkarProgress } from './useAdhkarProgress'
export type ShortSurahs = Record<number, { bismillah: string | null; verses: Verse[] }>
export default function AdhkarRoutine({
  routine,
  lang,
  surahs,
}: {
  routine: RoutineId
  lang: 'en' | 'ar' | 'fr' | 'de'
  surahs: ShortSurahs
}) {
  const ar = lang === 'ar',
    t = (en: string, arabic: string) =>
      ar ? arabic : lang === 'en' ? en : adhkarUi[lang][en] || en
  const [prayer, setPrayer] = useState('unassigned'),
    [variant, setVariant] = useState<TasbihVariant>('33-tahlil')
  const session = `${routine}.${routine === 'after-prayer' ? `${prayer}.${variant}` : 'daily'}`
  return (
    <div className="space-y-6">
      {routine === 'after-prayer' && (
        <div className="grid gap-4 rounded-2xl border p-5 sm:grid-cols-2">
          <label>
            {t('Prayer session', 'جلسة الصلاة')}
            <select
              aria-label={t('Prayer session', 'جلسة الصلاة')}
              value={prayer}
              onChange={(e) => setPrayer(e.target.value)}
              className="mt-2 w-full max-w-full min-w-0 rounded-xl border bg-white p-3 dark:bg-gray-900"
            >
              {[
                ['unassigned', 'Unassigned session', 'جلسة غير محددة'],
                ['fajr', 'Fajr', 'الفجر'],
                ['dhuhr', 'Dhuhr', 'الظهر'],
                ['asr', 'Asr', 'العصر'],
                ['maghrib', 'Maghrib', 'المغرب'],
                ['isha', 'Isha', 'العشاء'],
              ].map(([v, en, a]) => (
                <option key={v} value={v}>
                  {t(en, a)}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t('Tasbih sequence', 'صيغة التسبيح')}
            <select
              aria-label={t('Tasbih sequence', 'صيغة التسبيح')}
              value={variant}
              onChange={(e) => setVariant(e.target.value as TasbihVariant)}
              className="mt-2 w-full max-w-full min-w-0 rounded-xl border bg-white p-3 dark:bg-gray-900"
            >
              <option value="33-tahlil">
                {t('33 / 33 / 33 + tahlil', '٣٣ / ٣٣ / ٣٣ + التهليل')}
              </option>
              <option value="34">{t('33 / 33 / 34', '٣٣ / ٣٣ / ٣٤')}</option>
            </select>
          </label>
          <p className="text-sm text-gray-500 sm:col-span-2">
            {t(
              'These are two narrated alternatives, not two required rounds. Each prayer and sequence has separate saved counts. Selecting a prayer does not record that you prayed it.',
              'هاتان صيغتان مأثورتان وليستا جولتين مطلوبتين معًا. لكل صلاة وصيغة عدادات مستقلة. اختيار الصلاة لا يسجل أنك أديتها.'
            )}
          </p>
        </div>
      )}
      <RoutineSession key={session} {...{ session, routine, variant, lang, surahs }} />
    </div>
  )
}
function RoutineSession({
  session,
  routine,
  variant,
  lang,
  surahs,
}: {
  session: string
  routine: RoutineId
  variant: TasbihVariant
  lang: 'en' | 'ar' | 'fr' | 'de'
  surahs: ShortSurahs
}) {
  const entries = routineEntries(routine, variant).map((e) =>
      lang === 'fr' || lang === 'de' ? localizedDhikr(e, routine, lang) : e
    ),
    dynamic = lang === 'fr' || lang === 'de' ? adhkarDynamic[lang] : null,
    ar = lang === 'ar',
    t = (en: string, arabic: string) =>
      ar ? arabic : lang === 'en' ? en : adhkarUi[lang][en] || en
  const n = (v: number) =>
    new Intl.NumberFormat(ar ? 'ar' : 'en', {
      numberingSystem: ar ? 'arab' : 'latn',
      useGrouping: false,
    }).format(v)
  const { state, ready, available, update, reset } = useAdhkarProgress(session, entries)
  const status = summary(state, entries)
  const [meaning, setMeaning] = useState(!ar),
    [fontSize, setFontSize] = useState(30),
    [resetting, setResetting] = useState(false)
  const [audio, setAudio] = useState<{ surah: number; id: number; entry: string } | null>(null)
  const audioRequest = useMemo(
    () =>
      audio
        ? {
            id: audio.id,
            verse: 1,
            end: surahs[audio.surah].verses.length,
            repeats: 1,
            sequence: true,
            reciter: 'ar.alafasy' as const,
          }
        : null,
    [audio, surahs]
  )
  const request = useRef(0)
  function jump(id: string) {
    const target = document.getElementById(`dhikr-${id}`)
    target?.scrollIntoView({ block: 'start' })
    target?.focus({ preventScroll: true })
  }
  return (
    <div data-testid="adhkar-routine" className="space-y-6 pb-32">
      <section
        className="space-y-4 rounded-2xl bg-emerald-50 p-5 dark:bg-emerald-950"
        aria-label={t('Routine progress', 'تقدم الأذكار')}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" data-testid="routine-progress">
            {t('Marked complete:', 'تم تحديد اكتمال:')}{' '}
            <bdi dir="ltr">
              {n(status.done)} / {n(status.total)}
            </bdi>
          </p>
          <button
            disabled={!ready || status.complete}
            onClick={() =>
              jump(entries.find((e) => state.counts[e.id] < e.target)?.id || entries[0].id)
            }
            className="rounded-lg border px-3 py-2 disabled:opacity-50"
          >
            {t('Continue where I left off', 'متابعة من حيث توقفت')}
          </button>
        </div>
        <p className="text-sm">
          {ready
            ? `${state.day} · ${Intl.DateTimeFormat().resolvedOptions().timeZone}`
            : t('Today on this device', 'اليوم حسب هذا الجهاز')}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {t(
            'Counts stay in this browser and start fresh at your device’s local midnight. They are your manual record. No account is needed.',
            'تُحفظ العدادات في هذا المتصفح وتبدأ من جديد عند منتصف الليل المحلي للجهاز. هي سجل يدوي لضغطاتك. لا تحتاج إلى حساب.'
          )}
        </p>
        {status.complete && (
          <p className="font-medium" data-testid="routine-complete">
            {t(
              'You have marked this selected routine complete. You can return to any card or start again.',
              'حددت اكتمال هذه المجموعة المختارة. يمكنك العودة إلى أي ذكر أو البدء من جديد.'
            )}
          </p>
        )}
        {ready && !available && (
          <p role="alert">
            {t(
              'This browser cannot save your counts. They remain available for this open session only.',
              'لا يستطيع المتصفح حفظ العدادات. تظل متاحة في هذه الجلسة المفتوحة فقط.'
            )}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={meaning}
              onChange={(e) => setMeaning(e.target.checked)}
            />
            {t('English meanings', 'المعاني الإنجليزية')}
          </label>
          <label>
            {t('Arabic size', 'حجم النص العربي')}
            <select
              aria-label={t('Arabic size', 'حجم النص العربي')}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="ms-2 rounded-lg border bg-transparent p-2"
            >
              <option value="30">{t('Large', 'كبير')}</option>
              <option value="38">{t('Extra large', 'كبير جدًا')}</option>
            </select>
          </label>
          <button
            disabled={!ready}
            onClick={() => setResetting(true)}
            className="text-sm underline"
          >
            {t('Reset this session', 'تصفير هذه الجلسة')}
          </button>
        </div>
        {resetting && (
          <div className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
            <p>
              {t(
                'Clear every count in this session? Other sessions are kept.',
                'هل تريد مسح جميع عدادات هذه الجلسة؟ تبقى الجلسات الأخرى محفوظة.'
              )}
            </p>
            <button
              onClick={() => {
                reset()
                setAudio(null)
                setResetting(false)
              }}
              className="rounded-lg border px-3 py-2"
            >
              {t('Confirm reset', 'تأكيد التصفير')}
            </button>
            <button onClick={() => setResetting(false)} className="underline">
              {t('Cancel', 'إلغاء')}
            </button>
          </div>
        )}
      </section>
      <nav
        aria-label={t('Remembrance list', 'قائمة الأذكار')}
        className="flex flex-wrap gap-2 text-sm"
      >
        {entries.map((e, i) => (
          <a href={`#dhikr-${e.id}`} className="rounded-full border px-3 py-2" key={e.id}>
            {n(i + 1)}. {ar ? e.titleAr : e.title}
          </a>
        ))}
      </nav>
      {entries.map((e, i) => {
        const count = state.counts[e.id] || 0,
          done = count === e.target,
          q = e.surah ? surahs[e.surah] : null
        return (
          <article
            tabIndex={-1}
            id={`dhikr-${e.id}`}
            data-testid="adhkar-card"
            key={e.id}
            className="scroll-mt-24 space-y-5 rounded-2xl border border-gray-200 bg-white p-5 focus-visible:ring-2 focus-visible:ring-emerald-700 sm:p-7 dark:border-gray-700 dark:bg-gray-900"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h2 className="text-xl font-semibold">
                {n(i + 1)}. {ar ? e.titleAr : e.title}
              </h2>
              <span
                data-testid="count"
                dir="ltr"
                role="status"
                className="rounded-full bg-emerald-50 px-3 py-1 text-sm dark:bg-emerald-950"
              >
                {n(count)} / {n(e.target)} {done ? '✓' : ''}
              </span>
            </div>
            {q ? (
              <div className="space-y-4">
                {q.bismillah && (
                  <p lang="ar" dir="rtl" className="quran-text text-center text-2xl">
                    {q.bismillah}
                  </p>
                )}
                {q.verses.map((v) => (
                  <div key={v.number}>
                    <p
                      data-testid="quran-adhkar-verse"
                      lang="ar"
                      dir="rtl"
                      className="quran-text text-right break-words"
                      style={{ fontSize, lineHeight: 2.2 }}
                    >
                      {v.arabic}
                    </p>
                    {meaning && (
                      <p
                        lang={lang === 'ar' ? 'en' : lang}
                        dir="ltr"
                        className="mt-2 text-left leading-relaxed text-gray-600 dark:text-gray-300"
                      >
                        <span data-testid="quran-adhkar-meaning">{v.translation}</span>
                        {v.footnotes && (
                          <span
                            data-testid="translation-footnotes"
                            className="mt-2 block text-sm whitespace-pre-line"
                          >
                            {v.footnotes}
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <>
                <p
                  data-testid="hadith-dhikr"
                  lang="ar"
                  dir="rtl"
                  className="quran-text text-right break-words"
                  style={{ fontSize, lineHeight: 2.2 }}
                >
                  {e.arabic}
                </p>
                {meaning && (
                  <p
                    lang={lang === 'ar' ? 'en' : lang}
                    dir="ltr"
                    className="leading-relaxed text-gray-600 dark:text-gray-300"
                  >
                    <span data-testid="adhkar-meaning">{e.meaning}</span>
                  </p>
                )}
              </>
            )}
            <div className="space-y-2 text-sm text-gray-500">
              <p>
                {e.countedInSource
                  ? dynamic
                    ? dynamic.sourceCount(e.target)
                    : t(
                        `${e.target} recitations in the cited narration.`,
                        `${n(e.target)} مرات في الرواية المشار إليها.`
                      )
                  : t(
                      'Read once in this checklist. The source does not prescribe a repeated count here.',
                      'اقرأ مرة في هذه القائمة. لا يحدد المصدر هنا عددًا للتكرار.'
                    )}
                {e.surah
                  ? ' ' +
                    t(
                      'Count one complete surah, not each verse.',
                      'عدّ قراءة السورة كاملة، وليس كل آية.'
                    )
                  : ''}
              </p>
              <p>
                <a className="underline" href={e.href}>
                  {ar ? e.sourceAr : e.source}
                </a>
                {e.grade && (
                  <>
                    {' '}
                    ·{' '}
                    {ar
                      ? e.gradeAr
                      : lang === 'fr'
                        ? e.grade.replace(
                            'Sahih — Darussalam; at-Tirmidhi calls it hasan',
                            'Sahih — Darussalam ; qualifié de hasan par at-Tirmidhi'
                          )
                        : lang === 'de'
                          ? e.grade.replace(
                              'Sahih — Darussalam; at-Tirmidhi calls it hasan',
                              'Sahih — Darussalam; at-Tirmidhi bewertet ihn als hasan'
                            )
                          : e.grade}
                  </>
                )}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                disabled={!ready || done}
                onClick={() => update(e.id, 'increment')}
                aria-label={
                  dynamic ? dynamic.count(e.title) : t(`Count ${e.title}`, `عدّ ${e.titleAr}`)
                }
                className="min-h-12 rounded-xl bg-emerald-800 px-5 py-3 font-medium text-white disabled:opacity-50"
              >
                {done
                  ? t('Count reached', 'اكتمل العدد')
                  : t(
                      e.surah ? 'I recited the surah' : 'I recited once',
                      e.surah ? 'قرأت السورة' : 'قرأت مرة'
                    )}
              </button>
              <button
                disabled={!ready || count === 0}
                onClick={() => update(e.id, 'undo')}
                aria-label={
                  dynamic ? dynamic.undo(e.title) : t(`Undo ${e.title}`, `تراجع عن ${e.titleAr}`)
                }
                className="rounded-xl border px-4 py-3 disabled:opacity-40"
              >
                {t('Undo one', 'تراجع مرة')}
              </button>
              {e.target > 1 && (
                <button
                  disabled={!ready || done}
                  onClick={() => update(e.id, 'complete')}
                  aria-label={
                    dynamic
                      ? dynamic.mark(e.target, e.title)
                      : t(
                          `Mark all ${e.target} for ${e.title}`,
                          `تحديد اكتمال ${n(e.target)} لـ ${e.titleAr}`
                        )
                  }
                  className="rounded-xl border px-4 py-3 text-sm disabled:opacity-40"
                >
                  {dynamic
                    ? dynamic.recited(e.target)
                    : t(`I already recited all ${e.target}`, `قرأت العدد كاملًا: ${n(e.target)}`)}
                </button>
              )}
              {e.surah && (
                <>
                  <button
                    onClick={() =>
                      setAudio({ surah: e.surah!, entry: e.id, id: ++request.current })
                    }
                    className="rounded-xl border px-4 py-3"
                  >
                    {t('Listen once', 'استمع مرة')}
                  </button>
                  <Link
                    className="self-center text-sm underline"
                    href={quranPath(chapters[e.surah - 1], lang)}
                  >
                    {t('Open in Quran reader', 'افتح في قارئ القرآن')}
                  </Link>
                </>
              )}
            </div>
          </article>
        )
      })}
      {audio && (
        <QuranAudio
          key={audio.entry}
          lang={lang}
          verses={surahs[audio.surah].verses}
          request={audioRequest}
          onActive={() => {}}
          onReadVerse={() => jump(audio.entry)}
        />
      )}
    </div>
  )
}
