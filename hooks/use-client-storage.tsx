"use client"

import { useState, useEffect } from "react"

export function useClientStorage(key: string, defaultValue: string) {
  const [value, setValue] = useState(defaultValue)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(key)
      if (stored) {
        setValue(stored)
      }
    }
  }, [key])

  const setStoredValue = (newValue: string) => {
    setValue(newValue)
    if (typeof window !== "undefined") {
      localStorage.setItem(key, newValue)
    }
  }

  const removeStoredValue = () => {
    setValue(defaultValue)
    if (typeof window !== "undefined") {
      localStorage.removeItem(key)
    }
  }

  return { value: isClient ? value : defaultValue, setValue: setStoredValue, removeValue: removeStoredValue, isClient }
}