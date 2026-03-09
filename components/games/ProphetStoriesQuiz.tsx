'use client'

import { useState } from 'react'

interface Question {
  question: string
  answer: string
  options: string[]
  explanation: string
}

const QUESTIONS: Question[] = [
  {
    question: 'Which prophet was swallowed by a whale?',
    answer: 'Yunus (Jonah)',
    options: ['Yunus (Jonah)', 'Musa (Moses)', 'Nuh (Noah)', 'Dawud (David)'],
    explanation:
      'Prophet Yunus (AS) was swallowed by a whale after leaving his people. He prayed to Allah from the belly of the whale and was forgiven. (Quran 21:87-88)',
  },
  {
    question: 'Which prophet built the Ark to survive a great flood?',
    answer: 'Nuh (Noah)',
    options: ['Ibrahim (Abraham)', 'Nuh (Noah)', 'Idris (Enoch)', 'Adam'],
    explanation:
      "Prophet Nuh (AS) built the Ark on Allah's command to save the believers and pairs of animals from the great flood. (Quran 11:36-48)",
  },
  {
    question: 'Who is considered the father of the prophets in Islam?',
    answer: 'Ibrahim (Abraham)',
    options: ['Adam', 'Ibrahim (Abraham)', 'Nuh (Noah)', 'Muhammad'],
    explanation:
      'Prophet Ibrahim (AS) is known as the "Father of the Prophets" as many prophets descended from his two sons, Ismail and Ishaq. (Quran 29:27)',
  },
  {
    question: 'Which prophet could speak to animals and control the wind?',
    answer: 'Sulaiman (Solomon)',
    options: ['Dawud (David)', 'Sulaiman (Solomon)', 'Musa (Moses)', 'Isa (Jesus)'],
    explanation:
      'Prophet Sulaiman (AS) was given the ability to speak to animals, control jinn, and command the wind. (Quran 27:16-17)',
  },
  {
    question: 'Which prophet was thrown into a fire but remained unharmed?',
    answer: 'Ibrahim (Abraham)',
    options: ['Musa (Moses)', 'Yusuf (Joseph)', 'Ibrahim (Abraham)', 'Ismail (Ishmael)'],
    explanation:
      'Prophet Ibrahim (AS) was thrown into a fire by his people, but Allah commanded the fire to be cool and safe for him. (Quran 21:68-69)',
  },
  {
    question: 'Which prophet had a miraculous birth, born without a father?',
    answer: 'Isa (Jesus)',
    options: ['Yahya (John)', 'Isa (Jesus)', 'Adam', 'Zakariyya (Zechariah)'],
    explanation:
      'Prophet Isa (AS) was born to Maryam (Mary) without a father, by the command of Allah. (Quran 3:45-47)',
  },
  {
    question: 'Which prophet was given the Zabur (Psalms)?',
    answer: 'Dawud (David)',
    options: ['Musa (Moses)', 'Isa (Jesus)', 'Dawud (David)', 'Sulaiman (Solomon)'],
    explanation:
      'Prophet Dawud (AS) was given the Zabur (Psalms) as a holy scripture. He was also known for his beautiful voice. (Quran 4:163)',
  },
  {
    question: 'Which prophet was sold into slavery by his brothers?',
    answer: 'Yusuf (Joseph)',
    options: ['Ismail (Ishmael)', 'Yusuf (Joseph)', 'Musa (Moses)', 'Harun (Aaron)'],
    explanation:
      'Prophet Yusuf (AS) was thrown into a well and sold into slavery by his jealous brothers. He later became a minister in Egypt. (Quran 12:15-21)',
  },
  {
    question: 'Which prophet received the Torah?',
    answer: 'Musa (Moses)',
    options: ['Musa (Moses)', 'Ibrahim (Abraham)', 'Dawud (David)', 'Isa (Jesus)'],
    explanation:
      'Prophet Musa (AS) received the Torah (Tawrat) on Mount Sinai. He is one of the most frequently mentioned prophets in the Quran. (Quran 5:44)',
  },
  {
    question: 'Who was the first prophet in Islam?',
    answer: 'Adam',
    options: ['Nuh (Noah)', 'Ibrahim (Abraham)', 'Adam', 'Idris (Enoch)'],
    explanation:
      'Adam (AS) was the first human and the first prophet. Allah taught him the names of all things. (Quran 2:31)',
  },
  {
    question: 'Which prophet parted the Red Sea?',
    answer: 'Musa (Moses)',
    options: ['Nuh (Noah)', 'Sulaiman (Solomon)', 'Musa (Moses)', 'Isa (Jesus)'],
    explanation:
      "Prophet Musa (AS) struck the sea with his staff by Allah's command, parting it to allow the Israelites to escape from Pharaoh. (Quran 26:63-66)",
  },
  {
    question: 'Which prophet was known for his incredible patience during severe trials?',
    answer: 'Ayyub (Job)',
    options: ['Yaqub (Jacob)', 'Ayyub (Job)', 'Shuaib', 'Lut (Lot)'],
    explanation:
      'Prophet Ayyub (AS) is known for his extraordinary patience despite losing his health, wealth, and family. Allah restored everything to him. (Quran 21:83-84)',
  },
  {
    question: "Which prophet's wife turned into a pillar of salt?",
    answer: 'Lut (Lot)',
    options: ['Nuh (Noah)', 'Lut (Lot)', 'Shuaib', 'Salih'],
    explanation:
      "Prophet Lut (AS)'s wife did not believe and was destroyed along with the sinful people of Sodom when she looked back during the punishment. (Quran 11:81)",
  },
  {
    question: 'Which prophet was the last and final messenger of Allah?',
    answer: 'Muhammad',
    options: ['Isa (Jesus)', 'Muhammad', 'Idris (Enoch)', 'Ibrahim (Abraham)'],
    explanation:
      'Prophet Muhammad (PBUH) is the Seal of the Prophets (Khatam an-Nabiyyin), the final messenger sent by Allah to all of humanity. (Quran 33:40)',
  },
  {
    question: 'Which prophet was given the miracle of bringing the dead back to life?',
    answer: 'Isa (Jesus)',
    options: ['Musa (Moses)', 'Isa (Jesus)', 'Ibrahim (Abraham)', 'Sulaiman (Solomon)'],
    explanation:
      'Prophet Isa (AS) was given miracles by Allah including curing the blind and lepers, and bringing the dead back to life. (Quran 3:49)',
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

export default function ProphetStoriesQuiz() {
  const [questions, setQuestions] = useState(() => shuffleArray(QUESTIONS).slice(0, 10))
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [finished, setFinished] = useState(false)

  const question = questions[current]

  const handleSelect = (option: string) => {
    if (selected) return
    setSelected(option)
    setShowResult(true)
    if (option === question.answer) setScore((s) => s + 1)
  }

  const nextQuestion = () => {
    if (current + 1 >= questions.length) {
      setFinished(true)
    } else {
      setCurrent((c) => c + 1)
      setSelected(null)
      setShowResult(false)
    }
  }

  const restart = () => {
    setQuestions(shuffleArray(QUESTIONS).slice(0, 10))
    setCurrent(0)
    setScore(0)
    setSelected(null)
    setShowResult(false)
    setFinished(false)
  }

  if (finished) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <div className="rounded-2xl border border-white/30 bg-white/50 p-8 backdrop-blur-lg dark:border-white/10 dark:bg-white/[0.06]">
          <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Quiz Complete!</h3>
          <p className="text-primary-500 mb-1 text-4xl font-bold">
            {score}/{questions.length}
          </p>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            {score === questions.length
              ? 'Mashallah! Perfect knowledge of the prophets!'
              : score >= 7
                ? 'Great knowledge of prophet stories!'
                : score >= 4
                  ? 'Good effort! Read more about the prophets in the Quran.'
                  : 'Keep learning about the prophets, they are our role models!'}
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

  return (
    <div className="mx-auto max-w-lg">
      {/* Progress */}
      <div className="mb-6 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>
          Question {current + 1} of {questions.length}
        </span>
        <span>
          Score: {score}/{current + (showResult ? 1 : 0)}
        </span>
      </div>

      <div className="mb-6 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="bg-primary-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${((current + (showResult ? 1 : 0)) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="mb-6 rounded-2xl border border-white/30 bg-white/50 p-6 backdrop-blur-lg dark:border-white/10 dark:bg-white/[0.06]">
        <p className="text-lg font-medium text-gray-900 dark:text-white">{question.question}</p>
      </div>

      {/* Options */}
      <div className="grid gap-3">
        {question.options.map((option) => {
          let style =
            'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-500'
          if (showResult) {
            if (option === question.answer) {
              style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30'
            } else if (option === selected) {
              style = 'border-red-500 bg-red-50 dark:bg-red-900/30'
            } else {
              style = 'border-gray-200 bg-gray-50 opacity-50 dark:border-gray-700 dark:bg-gray-800'
            }
          }
          return (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              disabled={!!selected}
              className={`rounded-xl border-2 px-5 py-3.5 text-left font-medium transition-all ${style} ${!selected ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <span className="text-gray-900 dark:text-white">{option}</span>
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {showResult && (
        <div className="mt-4 rounded-xl bg-amber-50 p-4 dark:bg-amber-900/20">
          <p className="text-sm text-amber-800 dark:text-amber-200">{question.explanation}</p>
        </div>
      )}

      {showResult && (
        <button
          onClick={nextQuestion}
          className="bg-primary-500 hover:bg-primary-600 mt-6 w-full rounded-xl py-3 font-semibold text-white transition"
        >
          {current + 1 >= questions.length ? 'See Results' : 'Next Question'}
        </button>
      )}
    </div>
  )
}
