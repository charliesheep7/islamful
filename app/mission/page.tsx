import { genPageMetadata, buildLanguageAlternates } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'Our Mission',
  description:
    'Why we build Islamic AI tools rooted in the Quran and authentic scholarship, serving the ummah with technology that honors our values.',
  alternates: buildLanguageAlternates('/mission'),
})

export default function MissionPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <article className="prose prose-lg dark:prose-invert mx-auto">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
          Our Mission
        </h1>
        <p className="mb-12 text-xl leading-relaxed text-gray-600 dark:text-gray-300">
          Building AI that begins with the Quran, not the other way around.
        </p>

        <div className="space-y-8 text-gray-700 dark:text-gray-300 [&>p]:leading-relaxed">
          <p>
            AI is changing everything. How we learn. How we make decisions. How we understand the
            world around us. And yet, there is a question that so few people are asking:{' '}
            <strong className="text-gray-900 dark:text-white">whose values are shaping AI?</strong>
          </p>

          <p>
            Right now, nearly every AI tool is built by tech companies with their own priorities.
            And while these tools are powerful, the perspectives, the ethics, and the spiritual
            traditions of 2 billion Muslims are largely missing from the conversation. That weighs
            on us.
          </p>

          <p>
            Because we believe the ummah deserves more than being an afterthought. We believe it
            deserves tools built from its own foundation. Tools that start with the Quran, that
            honor authentic scholarship, and that serve believers everywhere. That is why we started
            Islamful.
          </p>

          <h2 className="mt-12 text-2xl font-bold text-gray-900 dark:text-white">
            The Quran shapes our AI, not the other way around
          </h2>

          <p>
            We want to be clear about something. We do not use AI to reinterpret the Quran. We do
            not use it to replace scholars or generate rulings. Instead, the Quran and authentic
            scholarship are our starting point. Every answer is grounded in trusted sources. Every
            ruling is cited, not generated. The technology serves the knowledge, always.
          </p>

          <h2 className="mt-12 text-2xl font-bold text-gray-900 dark:text-white">
            Why this matters now
          </h2>

          <p>
            The Muslim world carries a rich and beautiful legacy of science, scholarship, and
            discovery. But in this moment, as AI reshapes entire industries and societies, our
            communities risk becoming consumers of technology built on someone else&apos;s terms,
            rather than contributors who shape it with our own values and our own voice.
          </p>

          <p>
            We want to help change that. Not with big words, but with real tools. Tools that a
            mother in Jakarta can use to check if her children&apos;s snacks are halal. Tools that a
            student in Cairo can use to find the right dua before an exam. Tools that work in Arabic
            and English, that respect the diversity of scholarly opinion, and that are free for
            every Muslim on earth.
          </p>

          <h2 className="mt-12 text-2xl font-bold text-gray-900 dark:text-white">
            Built with care, rooted in trust
          </h2>

          <p>
            We hold ourselves to a simple standard: if it is not grounded in authentic scholarship,
            we do not ship it. AI is a tool, and like any tool, its value comes from the hands that
            guide it and the principles behind it. We take that responsibility seriously, because
            the trust of this ummah is sacred to us.
          </p>

          <p>
            Islamful is our small and sincere contribution. It is our way of making sure that the
            next chapter of technology includes the voice, the values, and the wisdom of the people
            we love most.
          </p>

          <div className="mt-16 rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-800 dark:bg-gray-900">
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              We are just getting started, and we would love for you to be part of this journey.
            </p>
            <a
              href="mailto:hello@infinique.org"
              className="mt-4 inline-block font-medium text-[var(--color-accent-600)] hover:text-[var(--color-accent-700)] dark:text-[var(--color-accent-400)]"
            >
              Get in touch &rarr;
            </a>
          </div>
        </div>
      </article>
    </main>
  )
}
