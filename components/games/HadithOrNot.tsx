'use client'

import { useState } from 'react'

interface HadithQuestion {
  text: string
  isReal: boolean
  explanation: string
  source?: string
}

const QUESTIONS: HadithQuestion[] = [
  {
    text: 'The best of you are those who are best to their families, and I am the best of you to my family.',
    isReal: true,
    explanation:
      'This is an authentic hadith narrated by At-Tirmidhi (3895). It emphasizes the importance of treating family well.',
    source: 'Tirmidhi 3895',
  },
  {
    text: 'Seek knowledge even if you have to go as far as China.',
    isReal: false,
    explanation:
      'This is a commonly cited saying but is classified as fabricated (mawdu) by hadith scholars including Ibn al-Jawzi and Al-Albani. However, the importance of seeking knowledge is confirmed by many authentic hadiths.',
  },
  {
    text: 'None of you truly believes until he loves for his brother what he loves for himself.',
    isReal: true,
    explanation:
      'This is an authentic hadith narrated by Al-Bukhari (13) and Muslim (45). It teaches the principle of brotherhood and empathy.',
    source: 'Bukhari 13, Muslim 45',
  },
  {
    text: 'Heaven lies under the feet of mothers.',
    isReal: false,
    explanation:
      'While widely quoted in this form, this exact wording is considered weak. The authentic version is: "Paradise is at the feet of the mother" from Sunan an-Nasa\'i and Ahmad, though scholars differ on its grading.',
  },
  {
    text: 'The strong person is not the one who can wrestle someone else down. The strong person is the one who can control himself when he is angry.',
    isReal: true,
    explanation:
      'This is an authentic hadith narrated by Al-Bukhari (6114) and Muslim (2609). It redefines true strength as emotional self-control.',
    source: 'Bukhari 6114',
  },
  {
    text: 'Cleanliness is half of faith.',
    isReal: true,
    explanation:
      'This is part of an authentic hadith narrated by Muslim (223). The full hadith states: "Purification is half of faith, and saying Alhamdulillah fills the scale."',
    source: 'Muslim 223',
  },
  {
    text: 'Work for your worldly life as if you will live forever, and work for your afterlife as if you will die tomorrow.',
    isReal: false,
    explanation:
      'This is commonly attributed to the Prophet (PBUH) but has no authentic chain of narration. It is sometimes attributed to Ali ibn Abi Talib or other scholars, but even those attributions are not verified.',
  },
  {
    text: 'The ink of the scholar is holier than the blood of the martyr.',
    isReal: false,
    explanation:
      'This is a fabricated hadith with no authentic chain of narration. Al-Khatib al-Baghdadi and others have classified it as having no basis. However, Islam highly values both knowledge and sacrifice.',
  },
  {
    text: 'Whoever follows a path in pursuit of knowledge, Allah will make easy for him a path to Paradise.',
    isReal: true,
    explanation:
      'This is an authentic hadith narrated by Muslim (2699). It encourages the pursuit of knowledge as a path to Paradise.',
    source: 'Muslim 2699',
  },
  {
    text: 'The one who eats and is grateful is like the one who fasts and is patient.',
    isReal: true,
    explanation:
      'This is an authentic hadith narrated by At-Tirmidhi (2486) and Ibn Majah. It highlights the virtue of gratitude.',
    source: 'Tirmidhi 2486',
  },
  {
    text: 'Whoever is not grateful to people is not grateful to Allah.',
    isReal: true,
    explanation:
      'This is an authentic hadith narrated by Abu Dawud (4811) and At-Tirmidhi (1954). It connects gratitude to people with gratitude to Allah.',
    source: 'Abu Dawud 4811',
  },
  {
    text: 'Trust in Allah, but tie your camel.',
    isReal: true,
    explanation:
      'This is an authentic hadith narrated by At-Tirmidhi (2517). A man asked the Prophet if he should tie his camel or trust in Allah, and the Prophet replied to do both.',
    source: 'Tirmidhi 2517',
  },
  {
    text: 'The difference between us and them is the prayer. Whoever abandons it has disbelieved.',
    isReal: true,
    explanation:
      "This is an authentic hadith narrated by At-Tirmidhi (2621), An-Nasa'i, and others. It emphasizes the critical importance of salah.",
    source: 'Tirmidhi 2621',
  },
  {
    text: 'A nation that is led by a woman will never succeed.',
    isReal: true,
    explanation:
      'This hadith is narrated by Al-Bukhari (7099). Scholars have different interpretations regarding its scope and context, with some limiting it to specific historical situations.',
    source: 'Bukhari 7099',
  },
  {
    text: "Love of one's homeland is part of faith.",
    isReal: false,
    explanation:
      'This is a fabricated hadith with no authentic chain. Scholars including As-Saghani and Ibn Taymiyyah have classified it as baseless. Patriotism is discussed in other authentic contexts in Islam.',
  },
]

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function HadithOrNot() {
  const [questions, setQuestions] = useState(() => shuffleArray(QUESTIONS).slice(0, 10))
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null)
  const [finished, setFinished] = useState(false)

  const question = questions[current]

  const handleAnswer = (isReal: boolean) => {
    if (answered) return
    setUserAnswer(isReal)
    setAnswered(true)
    if (isReal === question.isReal) setScore((s) => s + 1)
  }

  const nextQuestion = () => {
    if (current + 1 >= questions.length) {
      setFinished(true)
    } else {
      setCurrent((c) => c + 1)
      setAnswered(false)
      setUserAnswer(null)
    }
  }

  const restart = () => {
    setQuestions(shuffleArray(QUESTIONS).slice(0, 10))
    setCurrent(0)
    setScore(0)
    setAnswered(false)
    setUserAnswer(null)
    setFinished(false)
  }

  if (finished) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <div className="rounded-2xl border border-white/30 bg-white/50 p-8 backdrop-blur-lg dark:border-white/10 dark:bg-white/[0.06]">
          <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Game Complete!</h3>
          <p className="text-primary-500 mb-1 text-4xl font-bold">
            {score}/{questions.length}
          </p>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            {score === questions.length
              ? 'Mashallah! You really know your hadith!'
              : score >= 7
                ? 'Excellent hadith knowledge!'
                : score >= 4
                  ? 'Good effort! Study hadith sciences to improve.'
                  : 'Keep learning! Verifying hadiths is an important skill.'}
          </p>
          <button
            onClick={restart}
            className="bg-primary-500 hover:bg-primary-600 rounded-xl px-6 py-3 font-semibold text-white transition"
          >
            Play Again
          </button>
        </div>
      </div>
    )
  }

  const isCorrect = userAnswer === question.isReal

  return (
    <div className="mx-auto max-w-lg">
      {/* Progress */}
      <div className="mb-6 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>
          Question {current + 1} of {questions.length}
        </span>
        <span>
          Score: {score}/{current + (answered ? 1 : 0)}
        </span>
      </div>

      <div className="mb-6 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="bg-primary-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${((current + (answered ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      {/* Quote */}
      <div className="mb-6 rounded-2xl border border-white/30 bg-white/50 p-6 backdrop-blur-lg dark:border-white/10 dark:bg-white/[0.06]">
        <p className="mb-2 text-xs font-medium tracking-wide text-gray-400 uppercase dark:text-gray-500">
          Is this an authentic hadith?
        </p>
        <blockquote className="text-lg leading-relaxed text-gray-900 italic dark:text-white">
          &ldquo;{question.text}&rdquo;
        </blockquote>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleAnswer(true)}
          disabled={answered}
          className={`rounded-xl border-2 px-5 py-4 text-center font-semibold transition-all ${
            answered
              ? question.isReal
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                : userAnswer === true
                  ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                  : 'border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-800'
              : 'border-emerald-200 bg-white text-emerald-700 hover:border-emerald-400 hover:bg-emerald-50 dark:border-emerald-800 dark:bg-gray-800 dark:text-emerald-400 dark:hover:border-emerald-600'
          }`}
        >
          Authentic Hadith
        </button>
        <button
          onClick={() => handleAnswer(false)}
          disabled={answered}
          className={`rounded-xl border-2 px-5 py-4 text-center font-semibold transition-all ${
            answered
              ? !question.isReal
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                : userAnswer === false
                  ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                  : 'border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-800'
              : 'border-rose-200 bg-white text-rose-700 hover:border-rose-400 hover:bg-rose-50 dark:border-rose-800 dark:bg-gray-800 dark:text-rose-400 dark:hover:border-rose-600'
          }`}
        >
          Weak / Fabricated
        </button>
      </div>

      {/* Explanation */}
      {answered && (
        <>
          <div
            className={`mt-4 rounded-xl p-4 ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}
          >
            <p
              className={`mb-2 font-semibold ${isCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}
            >
              {isCorrect ? 'Correct!' : 'Incorrect!'}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{question.explanation}</p>
            {question.source && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Source: {question.source}
              </p>
            )}
          </div>

          <button
            onClick={nextQuestion}
            className="bg-primary-500 hover:bg-primary-600 mt-6 w-full rounded-xl py-3 font-semibold text-white transition"
          >
            {current + 1 >= questions.length ? 'See Results' : 'Next Question'}
          </button>
        </>
      )}
    </div>
  )
}
