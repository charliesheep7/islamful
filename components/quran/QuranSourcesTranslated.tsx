import corpus from '@/data/quran/corpus.json'
import french from '@/data/quran/translations/fr.json'
import german from '@/data/quran/translations/de.json'
const copy = {
  fr: {
    heading: 'Textes, traduction et récitation',
    arabic:
      'Texte arabe : projet Tanzil, écriture uthmani, version 1.1. Le texte et ses signes sont conservés sans modification.',
    translation: 'Traduction du sens :',
    version: 'Version',
    update: 'Mise à jour de la source',
    notice: 'Informations originales de la traduction',
    interpretation:
      'La traduction exprime une interprétation du sens et ne remplace pas le Coran arabe. Les notes de la source accompagnent les versets concernés.',
    audio:
      'Les données des sourates et des juz proviennent de Tanzil. La récitation du lecteur choisi est fournie par Al Quran Cloud.',
    audioSource: 'Source audio',
    terms: 'Conditions de la source',
    tanzil: 'Licence du texte Tanzil',
    changes: 'Mises à jour du texte',
    pronunciation:
      'Cette édition ne contient pas de transcription phonétique. Pour apprendre la prononciation et le tajwid, écoutez la récitation et faites-vous accompagner par un enseignant.',
  },
  de: {
    heading: 'Text, Übersetzung und Rezitation',
    arabic:
      'Arabischer Text: Tanzil-Projekt, uthmanischer Text, Version 1.1. Quelltext und Zeichen bleiben unverändert.',
    translation: 'Übersetzung der Bedeutung:',
    version: 'Version',
    update: 'Aktualisierung der Quelle',
    notice: 'Originalinformationen zur Übersetzung',
    interpretation:
      'Die Übersetzung gibt eine Deutung der Bedeutung wieder und ersetzt nicht den arabischen Koran. Die Anmerkungen der Quelle stehen bei den betreffenden Versen.',
    audio:
      'Suren- und Dschuz-Daten stammen von Tanzil. Die Rezitation des gewählten Rezitators wird von Al Quran Cloud bereitgestellt.',
    audioSource: 'Audioquelle',
    terms: 'Quellenbedingungen',
    tanzil: 'Lizenzhinweis zum Tanzil-Text',
    changes: 'Textaktualisierungen',
    pronunciation:
      'Diese Ausgabe enthält keine Lautumschrift. Nutze die Rezitation und die Hilfe einer Lehrperson, um Aussprache und Tadschwid zu lernen.',
  },
}
export default function QuranSourcesTranslated({ lang }: { lang: 'fr' | 'de' }) {
  const c = copy[lang],
    data = lang === 'fr' ? french : german
  return (
    <section
      className="mt-10 space-y-3 border-t border-gray-200 pt-6 text-sm leading-relaxed text-gray-600 dark:border-gray-800 dark:text-gray-300"
      aria-label={c.heading}
    >
      <h2 className="font-semibold text-gray-900 dark:text-white">{c.heading}</h2>
      <p>
        {c.arabic}{' '}
        <a className="underline" href="https://tanzil.net">
          Tanzil
        </a>{' '}
        ·{' '}
        <a className="underline" href="https://tanzil.net/updates/">
          {c.changes}
        </a>
      </p>
      <p>
        {c.translation}{' '}
        <a className="underline" href={data.url}>
          {data.publisher}
        </a>{' '}
        —{' '}
        <a className="underline" href={data.source}>
          QuranEnc.com
        </a>
        . {c.version} {data.version}. {c.update}: {data.updated}.{' '}
        <a className="underline" href={data.terms}>
          {c.terms}
        </a>
      </p>
      <p>{c.interpretation}</p>
      <p>
        {c.audio}{' '}
        <a className="underline" href="https://alquran.cloud/cdn">
          {c.audioSource}
        </a>{' '}
        ·{' '}
        <a className="underline" href="https://alquran.cloud/terms-and-conditions">
          {c.terms}
        </a>
      </p>
      <p>{c.pronunciation}</p>
      <details>
        <summary className="cursor-pointer underline">{c.notice}</summary>
        <pre lang="en" dir="ltr" className="mt-3 text-xs whitespace-pre-wrap">
          {data.notice}
        </pre>
      </details>
      <details>
        <summary className="cursor-pointer underline">{c.tanzil}</summary>
        <pre lang="en" dir="ltr" className="mt-3 text-xs whitespace-pre-wrap">
          {corpus.arabicNotice}
        </pre>
      </details>
    </section>
  )
}
