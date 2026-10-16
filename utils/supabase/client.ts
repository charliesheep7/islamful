'use client'
import { createBrowserClient } from '@supabase/ssr'
import { authConfig } from './config'
export function browserSupabase() {
  const config = authConfig()
  return config ? createBrowserClient(config.url, config.key) : null
}
