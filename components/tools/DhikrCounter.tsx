'use client'
import { useState } from 'react'
import { tasbihEntries, type TasbihVariant } from '@/data/adhkar'
import { useAdhkarProgress } from '@/components/adhkar/useAdhkarProgress'
import { summary } from '@/utils/adhkar-progress'
export default function DhikrCounter({ lang = 'en' }: { lang?: string }) {
  const ar = lang === 'ar',
    t = (en: string, a: string) => (ar ? a : en)
  const [variant, setVariant] = useState<TasbihVariant>('34')
  return (
    <div className="space-y-6" dir={ar ? 'rtl' : 'ltr'}>
      <label className="block text-center">
        {t('Tasbih sequence', 'صيغة التسبيح')}
        <select
          className="ms-3 rounded-xl border bg-white p-3 dark:bg-gray-900"
          aria-label={t('Tasbih sequence', 'صيغة التسبيح')}
          value={variant}
          onChange={(e) => setVariant(e.target.value as TasbihVariant)}
        >
          <option value="34">{t('33 / 33 / 34', '٣٣ / ٣٣ / ٣٤')}</option>
          <option value="33-tahlil">{t('33 / 33 / 33 + tahlil', '٣٣ / ٣٣ / ٣٣ + التهليل')}</option>
        </select>
      </label>
      <CounterSession key={variant} lang={lang} variant={variant} />
    </div>
  )
}
function CounterSession({ lang, variant }: { lang: string; variant: TasbihVariant }) {
  const ar = lang === 'ar',
    t = (en: string, a: string) => (ar ? a : en),
    n = (v: number) =>
      new Intl.NumberFormat(ar ? 'ar' : 'en', { numberingSystem: ar ? 'arab' : 'latn' }).format(v)
  const targets = tasbihEntries(variant),
    [index, setIndex] = useState(0),
    [resetting, setResetting] = useState(false)
  const { state, ready, available, update, reset } = useAdhkarProgress(
    `counter.${variant}`,
    targets
  )
  const entry = targets[index],
    count = state.counts[entry.id] || 0,
    status = summary(state, targets)
  return (
    <div data-testid="tasbeeh-counter" className="space-y-6 text-center">
      <div className="flex flex-wrap justify-center gap-2">
        {targets.map((e, i) => (
          <button
            key={e.id}
            aria-pressed={i === index}
            onClick={() => setIndex(i)}
            className={`rounded-full border px-4 py-2 ${i === index ? 'bg-emerald-800 text-white' : ''}`}
          >
            {ar ? e.titleAr : e.title} {state.counts[e.id] === e.target ? '✓' : ''}
          </button>
        ))}
      </div>
      <p lang="ar" dir="rtl" className="mx-auto max-w-2xl text-3xl leading-loose">
        {entry.arabic}
      </p>
      {!ar && <p className="text-gray-600 dark:text-gray-300">{entry.meaning}</p>}
      <button
        disabled={!ready || count === entry.target}
        onClick={() => update(entry.id, 'increment')}
        aria-label={t('Tap to count', 'اضغط للعد')}
        className="mx-auto flex h-60 w-60 flex-col items-center justify-center rounded-full border-4 border-emerald-700 bg-emerald-50 text-emerald-950 focus-visible:ring-4 focus-visible:ring-emerald-400 disabled:border-gray-400 dark:bg-emerald-950 dark:text-emerald-50"
      >
        <span data-testid="tasbeeh-count" className="text-6xl font-light tabular-nums">
          {n(count)}
        </span>
        <span className="mt-3 text-lg">/ {n(entry.target)}</span>
        <span className="mt-3">
          {count === entry.target
            ? t('Count reached', 'اكتمل العدد')
            : t('Tap to count', 'اضغط للعد')}
        </span>
      </button>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          aria-label={t('Undo one', 'تراجع مرة')}
          disabled={!ready || count === 0}
          onClick={() => update(entry.id, 'undo')}
          className="rounded-xl border px-4 py-3 disabled:opacity-40"
        >
          {t('Undo one', 'تراجع مرة')}
        </button>
        {index < targets.length - 1 && (
          <button onClick={() => setIndex(index + 1)} className="rounded-xl border px-4 py-3">
            {t('Next phrase', 'الذكر التالي')}
          </button>
        )}
        <button
          disabled={!ready}
          onClick={() => setResetting(true)}
          className="rounded-xl border px-4 py-3"
        >
          {t('Start again', 'ابدأ من جديد')}
        </button>
      </div>
      {resetting && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          <p>{t('Clear this sequence’s counts?', 'هل تريد تصفير عدادات هذه الصيغة؟')}</p>
          <button
            onClick={() => {
              reset()
              setIndex(0)
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
      <p role="status" dir={status.complete ? undefined : 'ltr'}>
        {status.complete
          ? t('You have marked all 100 recitations.', 'حددت اكتمال الأذكار المائة.')
          : `${n(Object.values(state.counts).reduce((s, n) => s + n, 0))} / ${n(100)}`}
      </p>
      <p className="text-sm">
        <a href={entry.href} className="underline">
          {ar ? entry.sourceAr : entry.source}
        </a>
      </p>
      <p className="text-sm text-gray-500">
        {ready ? state.day + ' · ' : ''}
        {t(
          'Counts are saved in this browser for your device’s local day. Choose either sequence; each has its own counts.',
          'تُحفظ العدادات في هذا المتصفح لليوم المحلي لجهازك. اختر إحدى الصيغتين؛ لكل منهما عدادات مستقلة.'
        )}
      </p>
      {ready && !available && (
        <p role="alert">
          {t(
            'Saving is unavailable. Counts work for this open session only.',
            'الحفظ غير متاح. تعمل العدادات في هذه الجلسة المفتوحة فقط.'
          )}
        </p>
      )}
    </div>
  )
}
