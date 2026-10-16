import { publicSupabase } from '@/data/public-services'
export function authConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  // Never combine one deployment variable with credentials from another project.
  // The old project was retired when the dedicated website project was created.
  return url && key && !url.includes('fkifiwgbroehluxksfte') ? { url, key } : publicSupabase
}
