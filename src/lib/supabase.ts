import { createClient } from '@supabase/supabase-js'

// Utilisation des variables d'environnement avec fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://ghpptudzucrnygrozpht.supabase.co"
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdocHB0dWR6dWNybnlncm96cGh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2MzYzODUsImV4cCI6MjA3MzIxMjM4NX0.nJgb0WAdzxeCmPuxb6ttatYdraLWyrA2-z89JAnXwc4"

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variables d\'environnement Supabase manquantes')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)