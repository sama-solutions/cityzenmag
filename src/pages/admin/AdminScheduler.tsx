import { useState, useEffect } from 'react'
import { Calendar, Save, X, Clock, Plus, Trash2, Edit3 } from 'lucide-react'
import { useAdminContent } from '../../hooks/useAdmin'
import { useTheme } from '../../contexts/ThemeContext'
import type { AdminThread } from '../../types/admin'

interface DateSchedule {
  thread_id: string
  title: string
  current_date: string | null
  new_date: string
  action: 'publish' | 'schedule' | 'update'
}

export function AdminScheduler() {
  const { threads, loading, updateThread } = useAdminContent()
  const { theme } = useTheme()
  const [schedules, setSchedules] = useState<DateSchedule[]>([])
  const [selectedThread, setSelectedThread] = useState<AdminThread | null>(null)
  const [newDate, setNewDate] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (threads) {
      // Initialiser les planifications existantes
      const existingSchedules: DateSchedule[] = threads
        .filter(thread => thread.published_date)
        .map(thread => ({
          thread_id: thread.thread_id,
          title: thread.title,
          current_date: thread.published_date,
          new_date: thread.published_date!.split('T')[0],
          action: 'update'
        }))
      setSchedules(existingSchedules)
    }
  }, [threads])

  const addSchedule = () => {
    if (selectedThread && newDate) {
      const existingIndex = schedules.findIndex(s => s.thread_id === selectedThread.thread_id)
      const newSchedule: DateSchedule = {
        thread_id: selectedThread.thread_id,
        title: selectedThread.title,
        current_date: selectedThread.published_date,
        new_date: newDate,
        action: selectedThread.published_date ? 'update' : 'schedule'
      }

      if (existingIndex >= 0) {
        const newSchedules = [...schedules]
        newSchedules[existingIndex] = newSchedule
        setSchedules(newSchedules)
      } else {
        setSchedules([...schedules, newSchedule])
      }

      setSelectedThread(null)
      setNewDate('')
    }
  }

  const removeSchedule = (threadId: string) => {
    setSchedules(schedules.filter(s => s.thread_id !== threadId))
  }

  const saveSchedules = async () => {
    setSaving(true)
    try {
      for (const schedule of schedules) {
        await updateThread(schedule.thread_id, {
          published_date: new Date(schedule.new_date).toISOString()
        })
      }
      alert('Planifications sauvegardées avec succès !')
    } catch (error: any) {
      alert('Erreur lors de la sauvegarde: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const availableThreads = threads?.filter(thread => 
    !schedules.some(s => s.thread_id === thread.thread_id)
  ) || []

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 theme-text-muted">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold theme-text mb-2">Planificateur de Publication</h1>
          <p className="theme-text-muted text-lg">Gérez les dates de publication de vos articles</p>
        </div>
        <div className={`p-4 rounded-2xl ${
          theme === 'senegalais' 
            ? 'bg-gradient-to-br from-orange-600 to-yellow-600' 
            : 'bg-gray-900'
        }`}>
          <Calendar className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Ajouter une planification */}
      <div className="admin-card p-6">
        <h2 className="text-2xl font-bold theme-text mb-6">Nouvelle Planification</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium theme-text mb-2">
              Article
            </label>
            <select
              value={selectedThread?.thread_id || ''}
              onChange={(e) => {
                const thread = threads?.find(t => t.thread_id === e.target.value)
                setSelectedThread(thread || null)
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-transparent outline-none"
            >
              <option value="">Sélectionner un article...</option>
              {availableThreads.map(thread => (
                <option key={thread.thread_id} value={thread.thread_id}>
                  {thread.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium theme-text mb-2">
              Date de publication
            </label>
            <input
              type="datetime-local"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-transparent outline-none"
            />
          </div>

          <button
            onClick={addSchedule}
            disabled={!selectedThread || !newDate}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-white transition-all disabled:opacity-50 ${
              theme === 'senegalais'
                ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                : 'bg-green-600 hover:bg-green-700'
            } shadow-lg hover:shadow-xl`}
          >
            <Plus className="w-5 h-5" />
            <span>Ajouter</span>
          </button>
        </div>
      </div>

      {/* Liste des planifications */}
      <div className="admin-card">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold theme-text">Planifications Actives</h2>
          {schedules.length > 0 && (
            <button
              onClick={saveSchedules}
              disabled={saving}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-white transition-all disabled:opacity-50 ${
                theme === 'senegalais'
                  ? 'bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              } shadow-lg hover:shadow-xl`}
            >
              <Save className="w-5 h-5" />
              <span>{saving ? 'Sauvegarde...' : 'Sauvegarder Tout'}</span>
            </button>
          )}
        </div>
        
        {schedules.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {schedules.map((schedule) => {
              const currentDate = schedule.current_date ? new Date(schedule.current_date) : null
              const newDateObj = new Date(schedule.new_date)
              const isUpdated = currentDate && currentDate.getTime() !== newDateObj.getTime()
              
              return (
                <div key={schedule.thread_id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold theme-text mb-2">{schedule.title}</h3>
                      <div className="flex items-center space-x-6 text-sm theme-text-muted">
                        {schedule.current_date && (
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>Actuelle: {new Date(schedule.current_date).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span className={isUpdated ? 'text-orange-600 font-medium' : ''}>
                            Nouvelle: {newDateObj.toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          schedule.action === 'publish' 
                            ? 'bg-green-100 text-green-800'
                            : schedule.action === 'schedule'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {schedule.action === 'publish' ? 'Publier' : 
                           schedule.action === 'schedule' ? 'Programmer' : 'Mettre à jour'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedThread(threads?.find(t => t.thread_id === schedule.thread_id) || null)
                          setNewDate(schedule.new_date)
                          removeSchedule(schedule.thread_id)
                        }}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => removeSchedule(schedule.thread_id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 theme-text-muted opacity-50" />
            <p className="text-lg theme-text-muted">Aucune planification active</p>
            <p className="theme-text-muted">Ajoutez des dates de publication pour vos articles</p>
          </div>
        )}
      </div>
    </div>
  )
}
