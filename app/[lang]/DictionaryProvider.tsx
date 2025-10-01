'use client'

import { createContext, useContext } from 'react'

type Dictionary = {
  nav: Record<string, string>
  footer: Record<string, string>
  home: Record<string, string>
}

const DictionaryContext = createContext<Dictionary | null>(null)

export function DictionaryProvider({
  children,
  dictionary,
}: {
  children: React.ReactNode
  dictionary: Dictionary
}) {
  return <DictionaryContext.Provider value={dictionary}>{children}</DictionaryContext.Provider>
}

export function useDictionary() {
  const dict = useContext(DictionaryContext)
  return dict
}
