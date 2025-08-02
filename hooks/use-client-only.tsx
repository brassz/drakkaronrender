import { useState, useEffect } from 'react'

/**
 * Hook to ensure code only runs on the client side to prevent SSR hydration errors
 * Returns true only after the component has mounted on the client
 */
export function useClientOnly() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}

/**
 * Hook to safely access localStorage only on the client side
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const isClient = useClientOnly()
  const [value, setValue] = useState<T>(defaultValue)

  useEffect(() => {
    if (isClient && typeof window !== 'undefined') {
      try {
        const item = localStorage.getItem(key)
        if (item) {
          setValue(JSON.parse(item))
        }
      } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error)
        setValue(defaultValue)
      }
    }
  }, [isClient, key, defaultValue])

  const setStoredValue = (newValue: T) => {
    setValue(newValue)
    if (isClient && typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(newValue))
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    }
  }

  return [value, setStoredValue] as const
}

/**
 * Hook to safely access window object only on the client side
 */
export function useWindow() {
  const isClient = useClientOnly()
  return isClient ? window : undefined
}