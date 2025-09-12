import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { AdminUser } from '../types/admin'

interface AuthContextType {
  user: User | null
  adminUser: AdminUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  logout: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        
        if (user) {
          await loadAdminUser(user.id)
        }
      } catch (error) {
        console.error('Erreur chargement utilisateur:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadUser()

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null)
        
        if (session?.user) {
          await loadAdminUser(session.user.id)
        } else {
          setAdminUser(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadAdminUser = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .maybeSingle()
      
      if (error) {
        console.error('Erreur chargement admin user:', error)
        return
      }
      
      setAdminUser(data)
    } catch (error) {
      console.error('Erreur loadAdminUser:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    setUser(null)
    setAdminUser(null)
  }

  const isAdmin = !!(user && adminUser)

  return (
    <AuthContext.Provider value={{
      user,
      adminUser,
      loading,
      signIn,
      signOut,
      logout: signOut,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}