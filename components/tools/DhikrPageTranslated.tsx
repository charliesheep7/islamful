import DhikrCounter from './DhikrCounter'
import { localizedPath } from '@/utils/locale'
import Link from 'next/link'
const copy = {
  fr: {
    title: 'Compteur de dhikr',
    intro: 'Comptez vos évocations quotidiennes après chaque prière.',
    heading: 'Deux séquences rapportées après la prière',
    first: 'La séquence de 33 tasbih, 33 tahmid et 34 takbir est rapportée dans',
    second:
      'La séquence de 33 répétitions de chaque formule, complétée par le tahlil pour atteindre cent, est rapportée dans',
    choice:
      'Choisissez l’une des deux séquences. Chacune possède ses propres compteurs ; le compteur ne suppose pas qu’une prière a été accomplie.',
    nojs: 'Activez JavaScript pour utiliser le compteur. Les textes et les sources restent accessibles.',
    adhkar: 'Adhkar quotidiens',
    home: 'Accueil',
  },
  de: {
    title: 'Dhikr-Zähler',
    intro: 'Zähle deine täglichen Gedenkformeln nach jedem Gebet.',
    heading: 'Zwei überlieferte Reihenfolgen nach dem Gebet',
    first: 'Die Reihenfolge aus 33 Tasbih, 33 Tahmid und 34 Takbir wird überliefert in',
    second:
      'Die Reihenfolge mit jeweils 33 Wiederholungen und abschließendem Tahlil bis zur Hundert wird überliefert in',
    choice:
      'Wähle eine der beiden Reihenfolgen. Jede hat eigene Zähler; der Zähler setzt nicht voraus, dass ein Gebet verrichtet wurde.',
    nojs: 'Aktiviere JavaScript, um den Zähler zu verwenden. Texte und Quellen bleiben lesbar.',
    adhkar: 'Tägliche Adhkar',
    home: 'Startseite',
  },
}
export default function DhikrPageTranslated({ lang }: { lang: 'fr' | 'de' }) {
  const t = copy[lang]
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8" lang={lang}>
      <nav className="mb-6 text-sm">
        <Link href={localizedPath('/', lang)}>{t.home}</Link>
        <span aria-hidden="true"> / </span>
        {t.title}
      </nav>
      <header className="mb-10 text-center">
        <h1 className="mb-4 text-3xl font-bold sm:text-4xl">{t.title}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">{t.intro}</p>
      </header>
      <DhikrCounter lang={lang} />
      <section className="mt-12 space-y-4 leading-relaxed">
        <h2 className="text-xl font-semibold">{t.heading}</h2>
        <p>
          {t.first}{' '}
          <a className="underline" href="https://sunnah.com/muslim:596a">
            Sahih Muslim 596a
          </a>
          . {t.second}{' '}
          <a className="underline" href="https://sunnah.com/muslim:597a">
            Sahih Muslim 597a
          </a>
          . {t.choice}
        </p>
        <noscript>
          <p>{t.nojs}</p>
        </noscript>
      </section>
    </div>
  )
}
