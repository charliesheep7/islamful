'use client'

import { useEffect, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { BookOpen, Download, RotateCcw, Send } from 'lucide-react'
import Share from '@/components/Share'
import { pngWithNotice } from '@/utils/png-notice'
import { answersCopy, type AnswerVerse } from '@/data/locales/answers'
import { localizedPath, type Locale } from '@/utils/locale'

function questionIndex(question: string, count: number) {
  const normalized = question
    .toLowerCase()
    .trim()
    .replace(/[?.!,;:'"]/g, '')
  let hash = 0
  for (let i = 0; i < normalized.length; i++)
    hash = ((hash << 5) - hash + normalized.charCodeAt(i)) | 0
  return Math.abs(hash) % count
}

export default function QuranAnswers({
  lang,
  bank,
  credit,
  notices,
}: {
  lang: Locale
  bank: AnswerVerse[]
  credit: string
  notices: string
}) {
  const c = answersCopy[lang]
  const [question, setQuestion] = useState('')
  const [phase, setPhase] = useState<'idle' | 'opening' | 'revealed'>('idle')
  const [verse, setVerse] = useState<AnswerVerse | null>(null)
  const [includeQuestion, setIncludeQuestion] = useState(false)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState('')
  const cardRef = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mounted = useRef(true)
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim() || phase !== 'idle') return
    setVerse(bank[questionIndex(question, bank.length)])
    setPhase('opening')
    timer.current = setTimeout(() => setPhase('revealed'), 900)
  }
  const reset = () => {
    if (timer.current) clearTimeout(timer.current)
    setPhase('idle')
    setQuestion('')
    setVerse(null)
    setIncludeQuestion(false)
    setStatus('')
  }
  const download = async () => {
    if (!cardRef.current || saving) return
    setSaving(true)
    setStatus('')
    try {
      await document.fonts.ready
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, backgroundColor: '#102c27' })
      if (!mounted.current) return
      const link = document.createElement('a')
      link.download = `islamful-quran-${verse?.reference.replace(/[:–]/g, '-')}-${lang}.png`
      const url = URL.createObjectURL(pngWithNotice(dataUrl, notices))
      link.href = url
      link.click()
      setTimeout(() => URL.revokeObjectURL(url), 60000)
      setStatus(c.saved)
    } catch {
      if (mounted.current) setStatus(c.error)
    } finally {
      if (mounted.current) setSaving(false)
    }
  }
  const buttonClass =
    'inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium disabled:opacity-50 dark:border-gray-700'
  return (
    <div className="mx-auto max-w-2xl space-y-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{c.explanation}</p>
      {phase === 'idle' && (
        <form onSubmit={submit} className="space-y-3">
          <label className="block font-medium" htmlFor="quran-reflection">
            {c.prompt}
          </label>
          <textarea
            id="quran-reflection"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={c.placeholder}
            maxLength={200}
            rows={3}
            className="w-full rounded-2xl border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
          />
          <button className={buttonClass} disabled={!question.trim()} type="submit">
            <Send size={18} />
            {c.submit}
          </button>
        </form>
      )}
      {phase === 'opening' && (
        <div role="status" className="flex flex-col items-center gap-4 py-16">
          <BookOpen className="h-16 w-16 motion-safe:animate-pulse" />
          <p>{c.opening}</p>
        </div>
      )}
      {phase === 'revealed' && verse && (
        <div className="space-y-5">
          <div
            ref={cardRef}
            data-testid="verse-card"
            className="overflow-hidden rounded-2xl bg-[#102c27] p-6 text-white sm:p-8"
          >
            <div className="mb-6 flex items-center gap-2 text-sm tracking-widest">
              <BookOpen size={18} />
              ISLAMFUL
            </div>
            {includeQuestion && (
              <div className="mb-6 border-b border-white/20 pb-4">
                <p className="text-xs text-white/70">{c.question}</p>
                <p className="mt-2 break-words" dir="auto">
                  {question}
                </p>
              </div>
            )}
            <h2 className="mb-6 text-center text-sm text-white/70">{c.reflection}</h2>
            <div className="space-y-6">
              {verse.verses.map((v, i) => (
                <div key={i} className="space-y-4">
                  <p
                    data-verse-arabic
                    lang="ar"
                    dir="rtl"
                    className="font-arabic text-center text-2xl leading-loose"
                  >
                    {v.arabic}
                  </p>
                  {v.translation && (
                    <p data-verse-translation className="text-center leading-relaxed">
                      {v.translation}
                    </p>
                  )}
                  {v.footnotes && (
                    <div className="border-t border-white/20 pt-3 text-xs leading-relaxed">
                      <p className="mb-2 font-semibold">{c.notes}</p>
                      <p data-verse-footnotes className="whitespace-pre-wrap">
                        {v.footnotes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-2 border-t border-white/20 pt-4 text-xs text-white/75">
              <p dir="ltr">
                Quran {verse.reference} · islamful.com{localizedPath('/answers', lang)}
              </p>
              <p dir="ltr">Tanzil.net · Uthmani v1.1</p>
              {credit && <p dir="ltr">{credit}</p>}
            </div>
          </div>
          <details className="text-xs text-gray-500">
            <summary className="cursor-pointer">{c.source}</summary>
            <p className="mt-3 whitespace-pre-wrap" dir="auto">
              {notices}
            </p>
          </details>
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={includeQuestion}
              disabled={saving}
              onChange={(e) => setIncludeQuestion(e.target.checked)}
              className="mt-1"
            />
            {c.include}
          </label>
          <div className="flex flex-wrap gap-3">
            <button onClick={download} disabled={saving} className={buttonClass}>
              <Download size={18} />
              {saving ? c.saving : c.save}
            </button>
            <button onClick={reset} disabled={saving} className={buttonClass}>
              <RotateCcw size={18} />
              {c.again}
            </button>
          </div>
          <p role="status" className="text-sm">
            {status}
          </p>
          <a href={verse.href} className="inline-block underline">
            {c.read}
          </a>
          <div className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
            <p className="mb-3 font-medium">{c.share}</p>
            <Share
              title={c.title}
              summary={c.description}
              sharePath={localizedPath('/answers', lang)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
