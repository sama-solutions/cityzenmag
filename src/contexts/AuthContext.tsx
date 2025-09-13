import React, { createContext, useContext, useState } from 'react'
import type { AdminUser } from '../types/admin'

interface AuthContextType {
  user: any | null
  adminUser: AdminUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  logout: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(false)

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      // Simulation d'authentification pour le développement
      const validEmails = ['admin@cityzenmag.com', 'admin@cityzenmag.sn']
      const validPasswords = ['admin123', 'admin']
      
      if (validEmails.includes(email) && validPasswords.includes(password)) {
        const mockUser = { id: '1', email }
        const mockAdminUser: AdminUser = {
          id: '1',
          user_id: '1',
          email,
          full_name: 'Administrateur CityzenMag',
          role: 'super_admin',
          permissions: ['read', 'write', 'delete', 'admin'],
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        
        setUser(mockUser)
        setAdminUser(mockAdminUser)
        
        // Sauvegarder dans localStorage pour persistance
        localStorage.setItem('cityzenmag-user', JSON.stringify(mockUser))
        localStorage.setItem('cityzenmag-admin', JSON.stringify(mockAdminUser))
        
        return { user: mockUser }
      } else {
        throw new Error('Identifiants incorrects')
      }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setUser(null)
    setAdminUser(null)
    localStorage.removeItem('cityzenmag-user')
    localStorage.removeItem('cityzenmag-admin')
  }

  // Charger l'utilisateur depuis localStorage au démarrage
  React.useEffect(() => {
    try {
      const savedUser = localStorage.getItem('cityzenmag-user')
      const savedAdmin = localStorage.getItem('cityzenmag-admin')
      
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
      
      if (savedAdmin) {
        setAdminUser(JSON.parse(savedAdmin))
      }
    } catch (error) {
      console.error('Erreur chargement utilisateur depuis localStorage:', error)
    }
  }, [])

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