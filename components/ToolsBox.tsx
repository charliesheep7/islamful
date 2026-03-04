import Link from './Link'
import tools from '@/data/tools'

export default function ToolsBox() {
  const displayed = tools.slice(0, 6)

  return (
    <div className="not-prose my-8 rounded-2xl border border-[#327952]/20 bg-[#F6F5EE] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Free Islamic Tools</h3>
        <Link href="/" className="text-sm font-medium text-[#327952] hover:underline">
          See all →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {displayed.map((tool) => {
          const Icon = tool.icon
          return (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm transition hover:shadow-md"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tool.iconBg}`}
              >
                <Icon className={`h-5 w-5 ${tool.iconColor}`} />
              </span>
              <span className="text-sm leading-tight font-medium text-gray-800">{tool.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
