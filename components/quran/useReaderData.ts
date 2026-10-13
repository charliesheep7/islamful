'use client'
import { useEffect, useState } from 'react'
import { READER_KEY, readerData, type ReaderData } from '@/data/quran'
export function useReaderData(lang: string) {
  const [data, setData] = useState(() => readerData(null, lang))
  const [available, setAvailable] = useState(true)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const read = () => {
      try {
        setData(readerData(localStorage.getItem(READER_KEY), lang))
        setAvailable(true)
      } catch {
        setAvailable(false)
      }
      setReady(true)
    }
    read()
    const sync = (e: StorageEvent) => {
      if (e.key === READER_KEY || e.key === null) read()
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [lang])
  const save = (next: ReaderData) => {
    setData(next)
    try {
      localStorage.setItem(READER_KEY, JSON.stringify(next))
      setAvailable(true)
    } catch {
      setAvailable(false)
    }
  }
  const clear = () => {
    setData(readerData(null, lang))
    try {
      localStorage.removeItem(READER_KEY)
      setAvailable(true)
    } catch {
      setAvailable(false)
    }
  }
  return { data, save, clear, ready, available }
}
