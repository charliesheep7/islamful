'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserRound } from 'lucide-react'
import { browserSupabase } from '@/utils/supabase/client'
import { navigation } from '@/data/locales/navigation'
import { useLocale } from '@/components/hooks/useLocale'

export default function AuthButton() {
  const { currentLang, getLocalePath } = useLocale()
  const pathname = usePathname()
  const [signedIn, setSignedIn] = useState(false)
  useEffect(() => {
    const client = browserSupabase()
    if (!client) return
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => setSignedIn(!!session?.user))
    return () => subscription.unsubscribe()
  }, [])
  const label = signedIn ? navigation[currentLang].account : navigation[currentLang].signin
  return (
    <Link
      href={`${getLocalePath('/login')}?next=${encodeURIComponent(pathname || '/')}`}
      aria-label={label}
      className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full bg-[#327952] px-3 text-sm font-semibold text-white hover:bg-[#286342] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
    >
      <UserRound size={18} aria-hidden="true" />
      <span className="hidden md:inline">{label}</span>
    </Link>
  )
}
