'use client'

// Placeholder media logos - replace with actual logos post-MVP
const mediaLogos = [
  { name: 'TechCrunch', color: '#0A0' },
  { name: 'Forbes', color: '#000' },
  { name: 'Bloomberg', color: '#000' },
  { name: 'WSJ', color: '#000' },
  { name: 'Reuters', color: '#F37021' },
  { name: 'CNN', color: '#C00' },
  { name: 'NBC', color: '#000' },
  { name: 'ABC', color: '#000' },
]

export default function MediaTicker() {
  // Duplicate for seamless loop
  const allLogos = [...mediaLogos, ...mediaLogos]

  return (
    <section className="overflow-hidden border-y border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
          As Featured In
        </p>
      </div>

      {/* Infinite scroll ticker */}
      <div className="relative">
        <div className="animate-scroll-infinite flex">
          {allLogos.map((logo, index) => (
            <div key={index} className="mx-8 flex flex-shrink-0 items-center justify-center">
              {/* Placeholder boxes - replace with actual logo images */}
              <div className="rounded-lg border border-gray-200 bg-[--color-surface] px-8 py-4 shadow-sm transition-all duration-300 hover:scale-105 hover:border-[--color-accent-300] hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-[--color-accent-700]">
                <span className="text-lg font-bold text-gray-600 dark:text-gray-300">
                  {logo.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Gradient fade edges */}
        <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-white to-transparent dark:from-gray-950" />
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent dark:from-gray-950" />
      </div>

      <style jsx>{`
        @keyframes scroll-infinite {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll-infinite {
          animation: scroll-infinite 30s linear infinite;
        }

        .animate-scroll-infinite:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}
