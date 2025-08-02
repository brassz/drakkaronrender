import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a dummy client if environment variables are not available
const createSafeClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables not found. Using placeholder values.")
    // Return a dummy client that won't crash the app
    return createClient("https://placeholder.supabase.co", "placeholder-key")
  }
  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createSafeClient()

// Cliente para server-side
export const createServerClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!url || !key) {
    console.warn("Server-side Supabase environment variables not found.")
    return createClient("https://placeholder.supabase.co", "placeholder-key")
  }
  
  return createClient(url, key)
}
