'use client'
import { useEffect, useRef, useState } from 'react'
import {
  changeCount,
  emptyProgress,
  localDay,
  parseProgress,
  type CountTarget,
} from '@/utils/adhkar-progress'
export function useAdhkarProgress(session: string, targets: CountTarget[]) {
  const key = `islamful.adhkar.v1.${session}`
  const [state, setState] = useState(() => emptyProgress(targets, ''))
  const stateRef = useRef(state)
  const [ready, setReady] = useState(false)
  const [available, setAvailable] = useState(true)
  // Target identities are part of the session key; callers remount when that key changes.
  const targetRef = useRef(targets)
  useEffect(() => {
    const publish = (next: typeof state) => {
      stateRef.current = next
      setState(next)
    }
    const read = () => {
      try {
        publish(parseProgress(localStorage.getItem(key), targetRef.current, localDay()))
        setAvailable(true)
      } catch {
        if (stateRef.current.day !== localDay())
          publish(emptyProgress(targetRef.current, localDay()))
        setAvailable(false)
      }
      setReady(true)
    }
    read()
    const checkDay = () => {
      if (stateRef.current.day !== localDay()) read()
    }
    const sync = (e: StorageEvent) => {
      if (e.key === key || e.key === null) read()
    }
    const timer = setInterval(checkDay, 1000)
    window.addEventListener('storage', sync)
    window.addEventListener('focus', checkDay)
    document.addEventListener('visibilitychange', checkDay)
    return () => {
      clearInterval(timer)
      window.removeEventListener('storage', sync)
      window.removeEventListener('focus', checkDay)
      document.removeEventListener('visibilitychange', checkDay)
    }
  }, [key])
  const update = (id: string, action: 'increment' | 'undo' | 'complete') => {
    if (!ready) return
    let current = stateRef.current
    // Re-read before a write to avoid overwriting an already persisted change from another tab.
    if (available)
      try {
        current = parseProgress(localStorage.getItem(key), targets, localDay())
      } catch {
        setAvailable(false)
      }
    const next = changeCount(current, targets, id, action, localDay())
    stateRef.current = next
    setState(next)
    try {
      localStorage.setItem(key, JSON.stringify(next))
      setAvailable(true)
    } catch {
      setAvailable(false)
    }
  }
  const reset = () => {
    const next = emptyProgress(targets, localDay())
    stateRef.current = next
    setState(next)
    try {
      localStorage.removeItem(key)
      setAvailable(true)
    } catch {
      setAvailable(false)
    }
  }
  return { state, ready, available, update, reset }
}
