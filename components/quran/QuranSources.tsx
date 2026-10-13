import corpus from '@/data/quran/corpus.json'
export default function QuranSources({ lang }: { lang: 'en' | 'ar' }) {
  const ar = lang === 'ar'
  return (
    <section
      className="mt-10 space-y-3 border-t border-gray-200 pt-6 text-sm leading-relaxed text-gray-600 dark:border-gray-800 dark:text-gray-300"
      aria-label={ar ? 'مصادر القرآن' : 'Quran sources'}
    >
      <h2 className="font-semibold text-gray-900 dark:text-white">
        {ar ? 'النص والترجمة والتلاوة' : 'Text, translation and recitation'}
      </h2>
      <p>
        {ar
          ? 'النص العربي: مشروع تنزيل، الرسم العثماني، الإصدار 1.1. حُفظت ألفاظ المصدر وعلاماته دون تغيير.'
          : 'Arabic: Tanzil Project, Uthmani text v1.1. Source text and marks are preserved unchanged.'}{' '}
        <a className="underline" href="https://tanzil.net">
          Tanzil
        </a>{' '}
        ·{' '}
        <a className="underline" href="https://tanzil.net/updates/">
          {ar ? 'تحديثات النص' : 'Text updates'}
        </a>
      </p>
      <p lang="en" dir="ltr">
        Translation by Talal Itani,{' '}
        <a className="underline" href="https://clearquran.com">
          ClearQuran.com
        </a>
        . God-wording edition supplied through Al Quran Cloud (en.itani).{' '}
        <a className="underline" href="https://blog.clearquran.com/download">
          CC BY-ND 4.0 and additional formatting permissions
        </a>
        .
      </p>
      <p>
        {ar
          ? 'الترجمة شرح للمعاني باللغة الإنجليزية وليست بديلًا عن النص العربي. بيانات السور والأجزاء من تنزيل، والصوت من Al Quran Cloud للقارئ المختار.'
          : 'The English translation conveys an interpretation of the meaning; it does not replace the Arabic Quran. Chapter and juz metadata come from Tanzil. Audio is served by Al Quran Cloud for the selected reciter.'}{' '}
        <a className="underline" href="https://alquran.cloud/cdn">
          {ar ? 'مصدر الصوت' : 'Audio source'}
        </a>{' '}
        ·{' '}
        <a className="underline" href="https://alquran.cloud/terms-and-conditions">
          {ar ? 'شروط المصدر' : 'Source terms'}
        </a>
      </p>
      <p>
        {ar
          ? 'راجعنا المصادر في 13 أكتوبر 2026. لا تتضمن هذه النسخة دليل نطق بالحروف اللاتينية؛ استمع إلى التلاوة واستعن بمعلّم لتعلّم النطق والتجويد.'
          : 'Sources checked 13 October 2026. This edition does not include phonetic transliteration; use the recitation and a teacher when learning pronunciation and tajweed.'}
      </p>
      <details>
        <summary className="cursor-pointer underline">
          {ar ? 'إشعار ترخيص نص تنزيل' : 'Tanzil text license notice'}
        </summary>
        <pre lang="en" dir="ltr" className="mt-3 text-xs whitespace-pre-wrap">
          {corpus.arabicNotice}
        </pre>
      </details>
    </section>
  )
}
