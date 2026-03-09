'use client'

import { useState, useRef, useCallback } from 'react'
import { toPng } from 'html-to-image'
import { Send, Download, Link2, RotateCcw, BookOpen, Check } from 'lucide-react'
import quranVerses from '@/data/quranVerses'
import type { QuranVerse } from '@/data/quranVerses'

// Blog hero images used as card backgrounds
const cardBackgrounds = [
  '/static/images/blog/en/complete-guide-eid-celebrations/hero.webp',
  '/static/images/blog/dua-for-anxiety.webp',
  '/static/images/blog/dua-for-qunoot.webp',
  '/static/images/blog/dua-for-breaking-fast.webp',
  '/static/images/blog/dua-for-examination.webp',
  '/static/images/blog/dua-for-exams.webp',
  '/static/images/blog/halal-vs-haram.webp',
]

function hashQuestion(question: string): number {
  const normalized = question
    .toLowerCase()
    .trim()
    .replace(/[?.!,;:'"]/g, '')
  let hash = 0
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  return Math.abs(hash)
}

interface QuranAnswersProps {
  lang?: 'en' | 'ar'
  standalone?: boolean
}

type Phase = 'idle' | 'opening' | 'revealed'

export default function QuranAnswers({ lang = 'en', standalone = false }: QuranAnswersProps) {
  const [question, setQuestion] = useState('')
  const [phase, setPhase] = useState<Phase>('idle')
  const [verse, setVerse] = useState<QuranVerse | null>(null)
  const [bgImage, setBgImage] = useState('')
  const [copied, setCopied] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const isRTL = lang === 'ar'

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (!question.trim()) return

      setPhase('opening')

      const hash = hashQuestion(question)
      const selectedVerse = quranVerses[hash % quranVerses.length]
      const selectedBg = cardBackgrounds[hash % cardBackgrounds.length]

      setVerse(selectedVerse)
      setBgImage(selectedBg)

      setTimeout(() => {
        setPhase('revealed')
      }, 2800)
    },
    [question]
  )

  const handleReset = () => {
    setPhase('idle')
    setQuestion('')
    setVerse(null)
    setCopied(false)
  }

  const handleDownload = async () => {
    if (!cardRef.current) return
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        cacheBust: true,
      })
      const link = document.createElement('a')
      link.download = 'quran-answer.png'
      link.href = dataUrl
      link.click()
    } catch {
      // Retry without background image
      try {
        const dataUrl = await toPng(cardRef.current, {
          quality: 0.95,
          pixelRatio: 2,
          cacheBust: true,
          filter: (node) =>
            !(node instanceof HTMLImageElement && node.classList.contains('card-bg')),
        })
        const link = document.createElement('a')
        link.download = 'quran-answer.png'
        link.href = dataUrl
        link.click()
      } catch {
        // silent fail
      }
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText('islamful.com/answers')
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = 'islamful.com/answers'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const placeholders = isRTL
    ? [
        'هل سأتزوج هذه السنة؟',
        'هل أقبل هذه الوظيفة؟',
        'هل يحبني؟',
        'هل أنا على الطريق الصحيح؟',
        'هل سأنجح في الامتحان؟',
        'هل يجب أن أسافر؟',
        'هل سيتحسن وضعي المالي؟',
        'هل سأجد السلام؟',
      ]
    : [
        'Will I get married this year?',
        'Should I accept this job offer?',
        'Does he love me?',
        'Will I pass my exam?',
        'Should I move to a new city?',
        'Will my financial situation improve?',
        'Is this person right for me?',
        'Will I find what I am looking for?',
      ]
  const randomPlaceholder = placeholders[Math.floor(Date.now() / 10000) % placeholders.length]

  return (
    <div className={`mx-auto w-full ${standalone ? 'max-w-2xl' : ''}`}>
      {/* Input Phase */}
      {phase === 'idle' && (
        <form onSubmit={handleSubmit} className="animate-fade-in space-y-4">
          <div className="relative">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={randomPlaceholder}
              className={`w-full rounded-2xl border border-[var(--color-cream-300)] bg-white/70 px-5 py-4 text-lg text-gray-900 placeholder-gray-400 backdrop-blur-sm transition-all focus:border-[var(--color-primary-400)] focus:ring-2 focus:ring-[var(--color-primary-200)] focus:outline-none dark:border-gray-700 dark:bg-gray-800/70 dark:text-white dark:placeholder-gray-500 dark:focus:border-[var(--color-primary-500)] dark:focus:ring-[var(--color-primary-900)] ${isRTL ? 'font-arabic pr-5 pl-14 text-right' : 'pr-14 pl-5'}`}
              dir={isRTL ? 'rtl' : 'ltr'}
              maxLength={200}
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
            />
            <button
              type="submit"
              disabled={!question.trim()}
              className={`absolute top-1/2 z-10 -translate-y-1/2 rounded-xl bg-[var(--color-primary-500)] p-2.5 text-white transition-all hover:bg-[var(--color-primary-600)] disabled:cursor-not-allowed disabled:opacity-40 ${isRTL ? 'left-2' : 'right-2'}`}
            >
              <Send className={`h-5 w-5 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </div>
          <p
            className={`text-center text-xs text-gray-400 dark:text-gray-500 ${isRTL ? 'font-arabic' : ''}`}
          >
            {isRTL ? 'اسأل ما في قلبك' : 'Ask what is in your heart'}
          </p>
        </form>
      )}

      {/* Opening Animation */}
      {phase === 'opening' && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="quran-opening relative mb-8 flex items-center justify-center">
            {/* Outer ring */}
            <div className="quran-ring absolute h-32 w-32 rounded-full border border-[var(--color-primary-300)]/40 sm:h-36 sm:w-36" />
            {/* Middle ring */}
            <div className="quran-ring-reverse absolute h-24 w-24 rounded-full border border-[var(--color-primary-400)]/30 sm:h-28 sm:w-28" />
            {/* Inner glow */}
            <div className="quran-glow absolute h-20 w-20 rounded-full bg-[var(--color-primary-300)]/20 blur-xl" />
            {/* Floating particles */}
            <div className="quran-particle-1 absolute h-1.5 w-1.5 rounded-full bg-[var(--color-primary-400)]/60" />
            <div className="quran-particle-2 absolute h-1 w-1 rounded-full bg-[var(--color-primary-500)]/50" />
            <div className="quran-particle-3 absolute h-1.5 w-1.5 rounded-full bg-[var(--color-primary-300)]/70" />
            {/* Book icon */}
            <div className="quran-book-animation relative z-10">
              <BookOpen
                className="h-16 w-16 text-[var(--color-primary-500)] sm:h-20 sm:w-20"
                strokeWidth={1}
              />
            </div>
          </div>
          <p
            className={`quran-text-reveal text-lg font-medium text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)] ${isRTL ? 'font-arabic' : ''}`}
          >
            {isRTL ? 'يُفتح القرآن الكريم...' : 'Opening the Quran...'}
          </p>
        </div>
      )}

      {/* Result Phase */}
      {phase === 'revealed' && verse && (
        <div className="animate-fade-in space-y-5">
          {/* Share Card */}
          <div
            ref={cardRef}
            className="relative mx-auto overflow-hidden rounded-2xl"
            style={{ aspectRatio: '1 / 1', maxWidth: '420px' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bgImage}
              alt=""
              className="card-bg absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/85" />

            {/* Content */}
            <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
              {/* Header with question */}
              <div>
                <div className="mb-3 flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-white/70" strokeWidth={1.5} />
                  <span className="text-xs font-semibold tracking-widest text-white/70 uppercase">
                    islamful
                  </span>
                </div>
                <p className="mb-1.5 text-xs font-bold tracking-wider text-white/70 uppercase">
                  {isRTL ? 'سؤالي' : 'My Question'}
                </p>
                <p className="text-sm font-medium text-white/90 italic">&ldquo;{question}&rdquo;</p>
              </div>

              {/* Answer */}
              <div className="space-y-3">
                <p className="text-center text-xs font-bold tracking-wider text-white/70 uppercase">
                  {isRTL ? 'الإجابة' : 'The Answer'}
                </p>
                <p
                  className="font-arabic text-center text-xl leading-loose text-white sm:text-2xl"
                  dir="rtl"
                >
                  {verse.arabic}
                </p>
                <div className="mx-auto h-px w-12 bg-white/30" />
                <p className="text-center text-sm leading-relaxed font-medium text-white/90">
                  &ldquo;{verse.english}&rdquo;
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-end justify-between">
                <p className="text-[10px] font-medium text-white/50">{verse.reference}</p>
                <p className="text-[10px] font-bold tracking-widest text-white/40 uppercase">
                  islamful.com/answers
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-xl border border-[var(--color-cream-300)] bg-white/70 px-4 py-2.5 text-sm font-medium text-gray-700 backdrop-blur-sm transition-all hover:bg-white hover:shadow-sm dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <Download className="h-4 w-4" />
              {isRTL ? 'حفظ' : 'Save'}
            </button>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 rounded-xl bg-[var(--color-primary-500)] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[var(--color-primary-600)] hover:shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  {isRTL ? 'تم النسخ!' : 'Copied!'}
                </>
              ) : (
                <>
                  <Link2 className="h-4 w-4" />
                  {isRTL ? 'نسخ الرابط' : 'Copy Link'}
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 rounded-xl border border-[var(--color-cream-300)] bg-white/70 px-4 py-2.5 text-sm font-medium text-gray-700 backdrop-blur-sm transition-all hover:bg-white hover:shadow-sm dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <RotateCcw className="h-4 w-4" />
              {isRTL ? 'اسأل مجدداً' : 'Ask Again'}
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        /* Book icon float + scale */
        .quran-book-animation {
          animation: bookReveal 2.8s ease-in-out forwards;
        }
        @keyframes bookReveal {
          0% {
            transform: scale(0.8) translateY(10px);
            opacity: 0;
          }
          20% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
          40%,
          60% {
            transform: scale(1) translateY(-6px);
          }
          50% {
            transform: scale(1.08) translateY(-10px);
          }
          80% {
            transform: scale(1.15) translateY(-4px);
          }
          100% {
            transform: scale(1.2) translateY(0);
            opacity: 0.6;
          }
        }

        /* Outer ring rotation */
        .quran-ring {
          animation: ringSpinExpand 2.8s ease-in-out forwards;
        }
        @keyframes ringSpinExpand {
          0% {
            transform: rotate(0deg) scale(0.5);
            opacity: 0;
          }
          20% {
            opacity: 0.6;
          }
          100% {
            transform: rotate(180deg) scale(1.3);
            opacity: 0;
          }
        }

        /* Middle ring counter-rotation */
        .quran-ring-reverse {
          animation: ringSpinReverse 2.8s ease-in-out forwards;
        }
        @keyframes ringSpinReverse {
          0% {
            transform: rotate(0deg) scale(0.6);
            opacity: 0;
          }
          20% {
            opacity: 0.5;
          }
          100% {
            transform: rotate(-120deg) scale(1.2);
            opacity: 0;
          }
        }

        /* Glow pulse */
        .quran-glow {
          animation: glowPulse 2.8s ease-in-out forwards;
        }
        @keyframes glowPulse {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          30% {
            opacity: 0.5;
          }
          60% {
            transform: scale(1.5);
            opacity: 0.8;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        /* Floating particles */
        .quran-particle-1 {
          animation: particleFloat1 2.8s ease-out forwards;
        }
        @keyframes particleFloat1 {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          20% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% {
            transform: translate(40px, -50px) scale(0);
            opacity: 0;
          }
        }
        .quran-particle-2 {
          animation: particleFloat2 2.8s ease-out forwards;
        }
        @keyframes particleFloat2 {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          30% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% {
            transform: translate(-35px, -45px) scale(0);
            opacity: 0;
          }
        }
        .quran-particle-3 {
          animation: particleFloat3 2.8s ease-out forwards;
        }
        @keyframes particleFloat3 {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          25% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% {
            transform: translate(30px, 40px) scale(0);
            opacity: 0;
          }
        }

        /* Text fade-in */
        .quran-text-reveal {
          animation: textReveal 2.8s ease-in-out forwards;
        }
        @keyframes textReveal {
          0%,
          15% {
            opacity: 0;
            transform: translateY(8px);
          }
          30% {
            opacity: 1;
            transform: translateY(0);
          }
          85% {
            opacity: 1;
          }
          100% {
            opacity: 0.5;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
