import { Metadata } from 'next'
import Link from '@/components/Link'
import Breadcrumbs from '@/components/seo/Breadcrumbs'
import JsonLd from '@/components/seo/JsonLd'
import { buildLanguageAlternates } from 'app/seo'
import games from '@/data/games'
import CrossToolLinks from '@/components/seo/CrossToolLinks'

export function generateStaticParams() {
  return [{ lang: 'ar' }]
}

export const metadata: Metadata = {
  title: 'ألعاب إسلامية — اختبارات وألعاب تعليمية ممتعة',
  description:
    'العب ألعابًا إسلامية ممتعة واختبارات تفاعلية. اختبر معرفتك بالقرآن والأنبياء والحديث والصلاة والمزيد. تعليمية وترفيهية لجميع الأعمار.',
  alternates: buildLanguageAlternates('/games', { currentLanguage: 'ar' }),
  openGraph: {
    title: 'ألعاب إسلامية — اختبارات وألعاب تعليمية ممتعة | إسلامفُل',
    description:
      'العب ألعابًا إسلامية ممتعة واختبارات تفاعلية. اختبر معرفتك بالقرآن والأنبياء والحديث والصلاة والمزيد.',
    url: 'https://www.islamful.com/ar/games',
  },
}

export default function GamesPageAr() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8" dir="rtl">
      <Breadcrumbs items={[{ name: 'ألعاب إسلامية', href: '/ar/games' }]} />

      <JsonLd
        data={{
          '@type': 'CollectionPage',
          name: 'ألعاب واختبارات إسلامية',
          description:
            'مجموعة من الألعاب والاختبارات الإسلامية الممتعة والتعليمية لاختبار وتحسين معرفتك بالإسلام.',
          url: 'https://www.islamful.com/ar/games',
        }}
      />

      <div className="mb-12 text-center">
        <h1 className="font-arabic mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
          ألعاب إسلامية
        </h1>
        <p className="font-arabic mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          تعلّم واستمتع بالاختبارات الإسلامية وألعاب الكلمات والتحديات التفاعلية. مناسبة لجميع
          الأعمار.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {games.map((game) => {
          const Icon = game.icon
          const shortDesc = game.descriptionAr.split('.')[0] + '.'

          return (
            <Link key={game.slug} href={`/ar/games/${game.slug}`} className="group no-underline">
              <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/30 bg-white/50 px-4 py-6 backdrop-blur-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:px-5 sm:py-8 dark:border-white/10 dark:bg-white/[0.06]">
                <Icon
                  className="mb-3 h-6 w-6 text-gray-400 transition-colors group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300"
                  strokeWidth={1.5}
                />
                <h3 className="font-arabic text-sm font-medium text-gray-900 dark:text-white">
                  {game.nameAr}
                </h3>
                <p className="font-arabic mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                  {shortDesc}
                </p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* SEO Content */}
      <section className="mt-16 space-y-8">
        <h2 className="font-arabic text-2xl font-bold text-gray-900 dark:text-white">
          تعلّم الإسلام من خلال اللعب
        </h2>
        <div className="prose prose-gray dark:prose-invert font-arabic max-w-none">
          <p>
            هذه الألعاب الإسلامية التفاعلية مصممة لجعل تعلّم الإسلام ممتعًا وجذابًا. سواء كنت مسلمًا
            جديدًا أو طالبًا أو ترغب ببساطة في اختبار معرفتك، تغطي هذه الألعاب موضوعات أساسية تشمل
            آيات القرآن وقصص الأنبياء والتحقق من الأحاديث وخطوات الصلاة والمزيد.
          </p>
          <h3>ألعاب لجميع الأعمار</h3>
          <p>
            من <strong>وردل إسلامي</strong> بكلمة جديدة كل يوم، إلى ألعاب التعلّم العملي مثل{' '}
            <strong>خطوات الوضوء</strong> و<strong>ترتيب الصلاة</strong>، هناك شيء للجميع. يمكن
            للأطفال تعلّم أساسيات الصلاة والوضوء، بينما يمكن للكبار تحدي أنفسهم بالتحقق من الأحاديث
            وتحديد آيات القرآن.
          </p>
          <h3>تعليمية وممتعة</h3>
          <p>
            كل لعبة مبنية لتكون تعليمية أولاً. الإجابات الصحيحة مصحوبة بشرح ومراجع قرآنية ومصادر
            حديثية لتتعلم شيئًا جديدًا في كل مرة تلعب فيها.
          </p>
        </div>
      </section>

      <CrossToolLinks currentTool="games" lang="ar" />
    </div>
  )
}
