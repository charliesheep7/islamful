'use client'
import { useEffect, useRef, useState } from 'react'
import { audioSource, nextAudioStep, RECITERS, type Reciter, type Verse } from '@/data/quran'
export type AudioRequest = {
  id: number
  verse: number
  end: number
  repeats: number
  sequence: boolean
  reciter: Reciter
}
type Track = AudioRequest & { pass: number; token: number }

export default function QuranAudio({
  request,
  verses,
  lang,
  onActive,
  onReadVerse,
}: {
  request: AudioRequest | null
  verses: Verse[]
  lang: 'en' | 'ar'
  onActive: (n: number | null) => void
  onReadVerse: (n: number) => void
}) {
  const ar = lang === 'ar',
    t = (en: string, arabic: string) => (ar ? arabic : en)
  const [track, setTrack] = useState<Track | null>(null)
  const [status, setStatus] = useState<'loading' | 'playing' | 'paused' | 'ended' | 'error'>(
    'paused'
  )
  const [message, setMessage] = useState('')
  const audioRef = useRef<HTMLAudioElement>(null),
    nextToken = useRef(0),
    activeToken = useRef(0)
  const onActiveRef = useRef(onActive)
  onActiveRef.current = onActive
  useEffect(() => {
    const token = ++nextToken.current
    activeToken.current = token
    setTrack(request ? { ...request, pass: 1, token } : null)
    setMessage('')
  }, [request])
  useEffect(() => {
    if (!track) {
      onActiveRef.current(null)
      return
    }
    const audio = audioRef.current,
      token = track.token
    if (!audio) return
    activeToken.current = token
    setStatus('loading')
    setMessage('')
    onActiveRef.current(track.verse)
    audio.load()
    audio.play().catch(() => {
      if (activeToken.current !== token) return
      setStatus('error')
      setMessage(
        t(
          'Audio could not start. Press play to retry, or check your connection.',
          'تعذّر بدء الصوت. اضغط التشغيل للمحاولة أو تحقّق من اتصالك.'
        )
      )
    })
    return () => {
      if (activeToken.current === token) activeToken.current = 0
      audio.pause()
    }
    // Keep one media element across the sequence so mobile playback stays unlocked;
    // tokens cancel old play promises and source checks reject stale media events.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track?.token])
  if (!track) return null
  const token = track.token
  const live = () => activeToken.current === token
  const currentSource = () =>
    audioRef.current?.currentSrc === audioSource(verses[track.verse - 1].global, track.reciter)
  const stop = () => {
    activeToken.current = ++nextToken.current
    audioRef.current?.pause()
    setTrack(null)
    onActiveRef.current(null)
  }
  const reciter = RECITERS.find((r) => r.id === track.reciter)!
  const n = (value: number) =>
    new Intl.NumberFormat(ar ? 'ar' : 'en', {
      numberingSystem: ar ? 'arab' : 'latn',
      useGrouping: false,
    }).format(value)
  return (
    <section
      aria-label={t('Quran audio player', 'مشغّل التلاوة')}
      data-testid="quran-audio"
      className="fixed inset-x-3 bottom-3 z-30 mx-auto max-w-2xl space-y-2 rounded-2xl border border-gray-300 bg-white p-3 shadow-xl dark:border-gray-700 dark:bg-gray-900"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="text-sm">
          <p className="font-semibold">
            {ar ? reciter.nameAr : reciter.name} · {t('Verse', 'الآية')} {n(track.verse)}
          </p>
          <p className="text-xs text-gray-500" role="status">
            {status === 'ended'
              ? t('Finished', 'انتهى')
              : status === 'loading'
                ? t('Loading audio…', 'جارٍ تحميل الصوت…')
                : status === 'error'
                  ? t('Audio unavailable', 'الصوت غير متاح')
                  : status === 'playing'
                    ? t('Playing', 'قيد التشغيل')
                    : t('Paused', 'متوقف مؤقتًا')}{' '}
            · {t('Repeat', 'التكرار')} {n(track.pass)}/{n(track.repeats)}
          </p>
        </div>
        <button type="button" onClick={stop} className="rounded-lg border px-3 py-2 text-sm">
          {t('Stop', 'إيقاف')}
        </button>
      </div>
      <button type="button" className="text-sm underline" onClick={() => onReadVerse(track.verse)}>
        {t('Read this verse', 'اقرأ هذه الآية')}
      </button>
      {/* Audio-only: the matching Arabic transcript is printed in the verse list. */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={audioRef}
        controls
        preload="none"
        className="h-10 w-full"
        src={audioSource(verses[track.verse - 1].global, track.reciter)}
        onPlay={() => {
          if (live() && currentSource() && !audioRef.current?.paused) {
            setStatus('playing')
            setMessage('')
          }
        }}
        onPause={() => {
          if (live() && currentSource() && audioRef.current?.paused && !audioRef.current?.ended)
            setStatus('paused')
        }}
        onWaiting={() => {
          if (live() && currentSource() && (audioRef.current?.readyState ?? 4) < 3)
            setStatus('loading')
        }}
        onError={() => {
          if (live() && currentSource() && audioRef.current?.error) {
            setStatus('error')
            setMessage(
              t(
                'This recitation could not be loaded. Retry or select another reciter. The text remains available.',
                'تعذّر تحميل التلاوة. حاول مجددًا أو اختر قارئًا آخر. يبقى النص متاحًا.'
              )
            )
          }
        }}
        onEnded={() => {
          if (!live() || !currentSource() || !audioRef.current?.ended) return
          const next = nextAudioStep(
            track.verse,
            track.pass,
            track.end,
            track.repeats,
            track.sequence
          )
          if (!next) {
            setStatus('ended')
            return
          }
          const newToken = ++nextToken.current
          activeToken.current = newToken
          setTrack({ ...track, ...next, token: newToken })
        }}
      />
      {message && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <p role="alert">{message}</p>
          <button
            type="button"
            className="underline"
            onClick={() => {
              const newToken = ++nextToken.current
              activeToken.current = newToken
              setTrack({ ...track, token: newToken })
            }}
          >
            {t('Retry audio', 'إعادة المحاولة')}
          </button>
        </div>
      )}
    </section>
  )
}
