'use client'
import { quranUi } from '@/data/locales/quran-ui'
import { useRef, useState } from 'react'
import Link from 'next/link'
import {
  chapters,
  quranPath,
  RECITERS,
  searchKey,
  verseNumber,
  type Chapter,
  type Reciter,
  type Verse,
} from '@/data/quran'
import QuranAudio, { type AudioRequest } from './QuranAudio'
import { useReaderData } from './useReaderData'

export default function QuranReader({
  chapter,
  verses,
  bismillah,
  lang,
}: {
  chapter: Chapter
  verses: Verse[]
  bismillah: string | null
  lang: 'en' | 'ar' | 'fr' | 'de'
}) {
  const ar = lang === 'ar',
    t = (en: string, arabic: string) => (ar ? arabic : lang === 'en' ? en : quranUi[lang][en] || en)
  const { data, save, clear, ready, available } = useReaderData(lang)
  const [query, setQuery] = useState(''),
    [jump, setJump] = useState(''),
    [message, setMessage] = useState('')
  const [reciter, setReciter] = useState<Reciter>('ar.alafasy'),
    [repeats, setRepeats] = useState(1)
  const [from, setFrom] = useState('1'),
    [to, setTo] = useState(String(chapter.count))
  const [request, setRequest] = useState<AudioRequest | null>(null),
    [active, setActive] = useState<number | null>(null)
  const [hideForPractice, setHideForPractice] = useState(false),
    [revealed, setRevealed] = useState<number[]>([])
  const nextRequest = useRef(0)
  const n = (value: number) =>
    new Intl.NumberFormat(ar ? 'ar' : 'en', {
      numberingSystem: ar ? 'arab' : 'latn',
      useGrouping: false,
    }).format(value)
  const key = searchKey(query),
    filtered = key
      ? verses.filter((v) => searchKey(`${v.arabic} ${v.translation} ${v.number}`).includes(key))
      : verses
  const inputClass =
    'mt-2 w-full min-w-0 max-w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-base dark:border-gray-700 dark:bg-gray-900'
  const stop = () => {
    setRequest(null)
    setActive(null)
  }
  const play = (verse: number, sequence = false) => {
    const end = sequence ? verseNumber(to, chapter.count) : verse
    if (!end || end < verse) {
      setMessage(
        t(
          'Choose a valid range within this surah; the end must be at or after the start.',
          'اختر نطاقًا صحيحًا داخل السورة؛ يجب أن تكون النهاية بعد البداية أو مساوية لها.'
        )
      )
      return
    }
    setMessage('')
    setRequest({ id: ++nextRequest.current, verse, end, repeats, sequence, reciter })
  }
  const go = (number: number) => {
    setQuery('')
    setMessage('')
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const target = document.getElementById(`ayah-${number}`)
        if (target) {
          target.scrollIntoView({ behavior: 'auto', block: 'start' })
          target.focus({ preventScroll: true })
          history.replaceState(null, '', `#ayah-${number}`)
        }
      })
    )
  }
  const bookmark = (ayah: number) => {
    const exists = data.bookmarks.some((b) => b.surah === chapter.number && b.ayah === ayah)
    if (!exists && data.bookmarks.length >= 100) {
      setMessage(
        t(
          'You have 100 bookmarks. Remove one before adding another.',
          'لديك ١٠٠ علامة مرجعية. احذف إحداها قبل إضافة أخرى.'
        )
      )
      return
    }
    save({
      ...data,
      bookmarks: exists
        ? data.bookmarks.filter((b) => b.surah !== chapter.number || b.ayah !== ayah)
        : [...data.bookmarks, { surah: chapter.number, ayah }],
    })
    setMessage(
      exists
        ? t('Bookmark removed.', 'حُذفت العلامة المرجعية.')
        : t('Verse bookmarked.', 'أُضيفت الآية إلى العلامات المرجعية.')
    )
  }
  const savePlace = (ayah: number) => {
    save({ ...data, place: { surah: chapter.number, ayah } })
    setMessage(
      lang === 'fr'
        ? `Position enregistrée au verset ${ayah}.`
        : lang === 'de'
          ? `Deine Stelle bei Vers ${ayah} wurde gespeichert.`
          : t(`Saved your place at verse ${ayah}.`, `حُفظ موضعك عند الآية ${n(ayah)}.`)
    )
  }
  return (
    <div data-testid="quran-reader" className="space-y-8 pb-36">
      <section
        aria-label={t('Reading and listening controls', 'إعدادات القراءة والاستماع')}
        className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={data.showTranslation}
              onChange={(e) => save({ ...data, showTranslation: e.target.checked })}
            />
            {t('English translation', 'الترجمة الإنجليزية')}
          </label>
          <label>
            {t('Arabic text size', 'حجم النص العربي')}
            <select
              aria-label={t('Arabic text size', 'حجم النص العربي')}
              value={data.fontSize}
              onChange={(e) => save({ ...data, fontSize: Number(e.target.value) as 28 | 36 | 44 })}
              className="ms-2 rounded-lg border bg-transparent p-2"
            >
              <option value="28">{t('Medium', 'متوسط')}</option>
              <option value="36">{t('Large', 'كبير')}</option>
              <option value="44">{t('Extra large', 'كبير جدًا')}</option>
            </select>
          </label>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const target = verseNumber(jump, chapter.count)
            if (target) go(target)
            else
              setMessage(
                lang === 'fr'
                  ? `Saisissez un verset de 1 à ${chapter.count}.`
                  : lang === 'de'
                    ? `Gib einen Vers von 1 bis ${chapter.count} ein.`
                    : t(
                        `Enter a verse from 1 to ${chapter.count}.`,
                        `أدخل رقم آية من ١ إلى ${n(chapter.count)}.`
                      )
              )
          }}
          className="flex flex-wrap items-end gap-3"
        >
          <label className="min-w-0 flex-1">
            {t('Go to verse', 'انتقل إلى الآية')}
            <input
              aria-label={t('Go to verse', 'انتقل إلى الآية')}
              type="text"
              inputMode="numeric"
              value={jump}
              maxLength={3}
              onChange={(e) => setJump(e.target.value)}
              className={inputClass}
            />
          </label>
          <button className="rounded-xl border px-5 py-2.5" type="submit">
            {t('Go', 'انتقل')}
          </button>
        </form>
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            {t('Reciter', 'القارئ')}
            <select
              aria-label={t('Reciter', 'القارئ')}
              className={inputClass}
              value={reciter}
              onChange={(e) => {
                stop()
                setReciter(e.target.value as Reciter)
              }}
            >
              {RECITERS.map((r) => (
                <option key={r.id} value={r.id}>
                  {ar ? r.nameAr : r.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t('Repeat each verse', 'تكرار كل آية')}
            <select
              aria-label={t('Repeat each verse', 'تكرار كل آية')}
              className={inputClass}
              value={repeats}
              onChange={(e) => {
                stop()
                setRepeats(Number(e.target.value))
              }}
            >
              {[1, 2, 3, 5, 10].map((k) => (
                <option key={k} value={k}>
                  {n(k)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const start = verseNumber(from, chapter.count)
            if (start) play(start, true)
            else setMessage(t('Enter a valid starting verse.', 'أدخل رقم بداية صحيحًا.'))
          }}
          className="grid grid-cols-2 items-end gap-3 sm:grid-cols-3"
        >
          <label>
            {t('From verse', 'من الآية')}
            <input
              type="text"
              inputMode="numeric"
              maxLength={3}
              aria-label={t('From verse', 'من الآية')}
              className={inputClass}
              value={from}
              onChange={(e) => {
                stop()
                setFrom(e.target.value)
              }}
            />
          </label>
          <label>
            {t('To verse', 'إلى الآية')}
            <input
              type="text"
              inputMode="numeric"
              maxLength={3}
              aria-label={t('To verse', 'إلى الآية')}
              className={inputClass}
              value={to}
              onChange={(e) => {
                stop()
                setTo(e.target.value)
              }}
            />
          </label>
          <button
            type="submit"
            className="col-span-2 rounded-xl bg-emerald-800 px-4 py-3 font-medium text-white sm:col-span-1"
          >
            {t('Play selected range', 'تشغيل النطاق المختار')}
          </button>
        </form>
        <details>
          <summary className="cursor-pointer font-medium">
            {t('Memorization practice', 'مراجعة الحفظ')}
          </summary>
          <label className="mt-3 flex items-center gap-2">
            <input
              type="checkbox"
              checked={hideForPractice}
              onChange={(e) => {
                setHideForPractice(e.target.checked)
                setRevealed([])
              }}
            />
            {t('Hide verse text until I reveal it', 'إخفاء نص الآية حتى أكشفه')}
          </label>
          <p className="mt-2 text-sm text-gray-500">
            {t(
              'Use a short range and repeat count for practice. This tool does not listen to you or assess recitation accuracy.',
              'استخدم نطاقًا قصيرًا وعدد تكرارات للمراجعة. لا تستمع الأداة إليك ولا تقيّم صحة تلاوتك.'
            )}
          </p>
        </details>
        <p className="text-sm text-gray-500">
          {t(
            'Text is available after this page loads. Audio needs an internet connection and is streamed from Al Quran Cloud when you press play.',
            'يتاح النص بعد تحميل الصفحة. يحتاج الصوت إلى الإنترنت ويُبث من Al Quran Cloud عند الضغط على التشغيل.'
          )}
        </p>
      </section>
      {ready && !available && (
        <p role="alert" className="rounded-xl border border-amber-300 p-4 text-sm">
          {t(
            'This browser cannot save changes. Your current reading settings work for this open page, but saved data may be unavailable or unchanged.',
            'لا يستطيع المتصفح حفظ التغييرات. تعمل الإعدادات في الصفحة المفتوحة، لكن البيانات المحفوظة قد تكون غير متاحة أو لم تتغير.'
          )}
        </p>
      )}
      {message && (
        <p role="status" className="rounded-xl border p-3 text-sm">
          {message}
        </p>
      )}
      {data.place && (
        <p className="flex flex-wrap gap-2 text-sm">
          {t('Saved place:', 'الموضع المحفوظ:')}
          <Link
            data-testid="reader-resume"
            onClick={(e) => {
              if (data.place?.surah === chapter.number) {
                e.preventDefault()
                go(data.place.ayah)
              }
            }}
            href={quranPath(chapters[data.place.surah - 1], lang, data.place.ayah)}
            className="underline"
          >
            {ar ? chapters[data.place.surah - 1].nameAr : chapters[data.place.surah - 1].name}{' '}
            {n(data.place.ayah)}
          </Link>
        </p>
      )}
      {data.bookmarks.some((b) => b.surah === chapter.number) && (
        <div className="flex flex-wrap gap-3 text-sm">
          <span>{t('Bookmarks in this surah:', 'علامات هذه السورة:')}</span>
          {data.bookmarks
            .filter((b) => b.surah === chapter.number)
            .map((b) => (
              <button key={b.ayah} className="underline" type="button" onClick={() => go(b.ayah)}>
                {n(b.ayah)}
              </button>
            ))}
        </div>
      )}
      <div>
        <label htmlFor="surah-verse-search" className="block text-sm font-medium">
          {t('Find words in this surah', 'ابحث عن كلمات في هذه السورة')}
        </label>
        <input
          id="surah-verse-search"
          type="search"
          className={inputClass}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <p className="mt-2 text-sm" role="status">
            {n(filtered.length)}{' '}
            {t(
              'matching verses. Clear the search to read the full surah.',
              'آية مطابقة. امسح البحث لقراءة السورة كاملة.'
            )}
          </p>
        )}
      </div>
      {bismillah && !query && (
        <p
          lang="ar"
          dir="rtl"
          data-testid="surah-bismillah"
          className="quran-text py-4 text-center text-3xl leading-loose"
        >
          {bismillah}
        </p>
      )}
      <div className="space-y-5" data-testid="quran-verses">
        {filtered.map((v) => {
          const saved = data.bookmarks.some(
            (b) => b.surah === chapter.number && b.ayah === v.number
          )
          const hidden = hideForPractice && !revealed.includes(v.number)
          return (
            <article
              key={v.number}
              id={`ayah-${v.number}`}
              tabIndex={-1}
              data-verse={v.number}
              className={`scroll-mt-24 space-y-4 rounded-2xl border p-5 sm:p-7 ${active === v.number ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950' : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900'}`}
              aria-label={`${t('Verse', 'الآية')} ${v.number}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <a
                  className="underline underline-offset-4"
                  href={`#ayah-${v.number}`}
                  aria-label={`${t('Link to verse', 'رابط الآية')} ${v.number}`}
                >
                  {n(chapter.number)}:{n(v.number)}
                </a>
                <span className="text-gray-500">
                  {t('Juz', 'الجزء')} {n(v.juz)} · {t('Madinah page', 'صفحة مصحف المدينة')}{' '}
                  {n(v.page)}
                </span>
              </div>
              {hidden ? (
                <button
                  className="w-full rounded-xl border border-dashed py-6"
                  type="button"
                  onClick={() => setRevealed((prev) => [...prev, v.number])}
                >
                  {t('Reveal verse', 'إظهار الآية')} {n(v.number)}
                </button>
              ) : (
                <>
                  <p
                    data-testid="arabic-verse"
                    lang="ar"
                    dir="rtl"
                    className="quran-text text-right break-words"
                    style={{ fontSize: data.fontSize, lineHeight: 2.3 }}
                  >
                    {v.arabic}
                  </p>
                  {data.showTranslation && (
                    <p
                      data-testid="translation-verse"
                      lang={lang === 'ar' ? 'en' : lang}
                      dir="ltr"
                      className="text-left text-base leading-relaxed text-gray-700 dark:text-gray-300"
                    >
                      {v.translation}
                    </p>
                  )}
                  {data.showTranslation && v.footnotes && (
                    <p
                      data-testid="translation-footnotes"
                      lang={lang}
                      dir="ltr"
                      className="text-sm whitespace-pre-line text-gray-600 dark:text-gray-300"
                    >
                      {v.footnotes}
                    </p>
                  )}
                </>
              )}
              <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-3 text-sm dark:border-gray-800">
                <button
                  type="button"
                  className="rounded-lg border px-3 py-2"
                  onClick={() => play(v.number)}
                  aria-label={`${t('Listen to verse', 'استمع للآية')} ${v.number}`}
                >
                  {t('Listen', 'استماع')}
                </button>
                <button
                  disabled={!ready}
                  type="button"
                  className="rounded-lg border px-3 py-2 disabled:opacity-50"
                  onClick={() => savePlace(v.number)}
                  aria-label={`${t('Save place at verse', 'احفظ الموضع عند الآية')} ${v.number}`}
                >
                  {data.place?.surah === chapter.number && data.place.ayah === v.number
                    ? t('Place saved', 'الموضع محفوظ')
                    : t('Save my place', 'احفظ موضعي')}
                </button>
                <button
                  disabled={!ready}
                  type="button"
                  aria-pressed={saved}
                  aria-label={`${t('Bookmark verse', 'علامة للآية')} ${v.number}`}
                  className="rounded-lg border px-3 py-2 disabled:opacity-50"
                  onClick={() => bookmark(v.number)}
                >
                  {saved ? t('Bookmarked', 'محفوظة') : t('Bookmark', 'علامة مرجعية')}
                </button>
              </div>
            </article>
          )
        })}
      </div>
      {filtered.length === 0 && (
        <p>
          {t(
            'No matching verses. Clear your search to return to the surah.',
            'لا توجد آيات مطابقة. امسح البحث للعودة إلى السورة.'
          )}
        </p>
      )}
      <div className="space-y-3 text-sm text-gray-500">
        <p>
          {t(
            'Saved places, bookmarks and preferences stay in this browser. Saving a place is your choice; playing audio does not mark a verse as read.',
            'تبقى المواضع والعلامات والتفضيلات في هذا المتصفح. تحفظ الموضع باختيارك؛ تشغيل الصوت لا يسجّل أنك قرأت الآية.'
          )}
        </p>
        <button
          type="button"
          className="underline"
          onClick={() => {
            clear()
            setMessage(
              t('Reading data cleared for this page.', 'مُسحت بيانات القراءة لهذه الصفحة.')
            )
          }}
        >
          {t(
            'Clear saved place, bookmarks and preferences',
            'مسح الموضع والعلامات والتفضيلات المحفوظة'
          )}
        </button>
      </div>
      <QuranAudio
        request={request}
        verses={verses}
        lang={lang}
        onActive={setActive}
        onReadVerse={(n) => {
          setRevealed((previous) => [...previous, n])
          go(n)
        }}
      />
    </div>
  )
}
