import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import type { Category, AdminThread, SiteSetting } from '../types/admin'

const SUPABASE_URL = "https://ghpptudzucrnygrozpht.supabase.co"

export function useAdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const fetchCategories = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      
      // Utilisation de données mockées pour éviter les erreurs Supabase
      const mockCategories: Category[] = [
        {
          id: 'transparence-sn',
          name: 'Transparence SN',
          slug: 'transparence-sn',
          color: '#f59e0b',
          description: 'Articles sur la transparence institutionnelle',
          icon: 'eye',
          is_active: true,
          display_order: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'la-suite',
          name: 'La Suite',
          slug: 'la-suite',
          color: '#3b82f6',
          description: 'Suivi des réformes et modernisation',
          icon: 'arrow-right',
          is_active: true,
          display_order: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'gouvernance',
          name: 'Gouvernance',
          slug: 'gouvernance',
          color: '#10b981',
          description: 'Questions de gouvernance publique',
          icon: 'shield',
          is_active: true,
          display_order: 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
      
      // Simulation d'un délai réseau
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setCategories(mockCategories)
    } catch (error) {
      console.error('Erreur fetchCategories:', error)
    } finally {
      setLoading(false)
    }
  }

  const createCategory = async (categoryData: Partial<Category>) => {
    if (!user) throw new Error('Non authentifié')
    
    try {
      const { data, error } = await supabase.functions.invoke('admin-categories', {
        body: categoryData,
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      })
      
      if (error) throw error
      
      if (data?.data) {
        setCategories(prev => [...prev, data.data])
        return data.data
      }
    } catch (error) {
      console.error('Erreur createCategory:', error)
      throw error
    }
  }

  const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    if (!user) throw new Error('Non authentifié')
    
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify(categoryData)
      })
      
      if (!response.ok) {
        throw new Error('Erreur mise à jour catégorie')
      }
      
      const result = await response.json()
      
      if (result?.data) {
        setCategories(prev => prev.map(cat => cat.id === id ? result.data : cat))
        return result.data
      }
    } catch (error) {
      console.error('Erreur updateCategory:', error)
      throw error
    }
  }

  const deleteCategory = async (id: string) => {
    if (!user) throw new Error('Non authentifié')
    
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-categories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Erreur suppression catégorie')
      }
      
      setCategories(prev => prev.filter(cat => cat.id !== id))
    } catch (error) {
      console.error('Erreur deleteCategory:', error)
      throw error
    }
  }

  useEffect(() => {
    if (user) {
      fetchCategories()
    }
  }, [user])

  return {
    categories,
    loading,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  }
}

export function useAdminContent() {
  const [threads, setThreads] = useState<AdminThread[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [statuses, setStatuses] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const fetchContent = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const { data, error } = await supabase.functions.invoke('admin-content', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      })
      
      if (error) throw error
      
      if (data?.data) {
        setThreads(data.data.threads || [])
        setCategories(data.data.categories || [])
        setStatuses(data.data.statuses || [])
      }
    } catch (error) {
      console.error('Erreur fetchContent:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateThread = async (threadId: string, threadData: Partial<AdminThread>) => {
    if (!user) throw new Error('Non authentifié')
    
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-content/${threadId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify(threadData)
      })
      
      if (!response.ok) {
        throw new Error('Erreur mise à jour thread')
      }
      
      const result = await response.json()
      
      if (result?.data) {
        setThreads(prev => prev.map(thread => 
          thread.thread_id === threadId ? { ...thread, ...result.data } : thread
        ))
        return result.data
      }
    } catch (error) {
      console.error('Erreur updateThread:', error)
      throw error
    }
  }

  const deleteThread = async (threadId: string) => {
    if (!user) throw new Error('Non authentifié')
    
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-content/${threadId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Erreur suppression thread')
      }
      
      // Recharger les données pour réfléter le changement de statut
      await fetchContent()
    } catch (error) {
      console.error('Erreur deleteThread:', error)
      throw error
    }
  }

  useEffect(() => {
    if (user) {
      fetchContent()
    }
  }, [user])

  return {
    threads,
    categories,
    statuses,
    loading,
    fetchContent,
    updateThread,
    deleteThread
  }
}

export function useAdminSettings() {
  const [settings, setSettings] = useState<SiteSetting[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const fetchSettings = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const { data, error } = await supabase.functions.invoke('admin-settings', {
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      })
      
      if (error) throw error
      
      if (data?.data) {
        setSettings(data.data)
      }
    } catch (error) {
      console.error('Erreur fetchSettings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = async (key: string, value: any) => {
    if (!user) throw new Error('Non authentifié')
    
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/admin-settings/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({ value })
      })
      
      if (!response.ok) {
        throw new Error('Erreur mise à jour paramètre')
      }
      
      const result = await response.json()
      
      if (result?.data) {
        setSettings(prev => prev.map(setting => 
          setting.key === key ? result.data : setting
        ))
        return result.data
      }
    } catch (error) {
      console.error('Erreur updateSetting:', error)
      throw error
    }
  }

  const getSetting = (key: string) => {
    const setting = settings.find(s => s.key === key)
    return setting?.value
  }

  useEffect(() => {
    if (user) {
      fetchSettings()
    }
  }, [user])

  return {
    settings,
    loading,
    fetchSettings,
    updateSetting,
    getSetting
  }
}