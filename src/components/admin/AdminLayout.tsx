import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { AdminSidebar } from './AdminSidebar'
import { LoadingSpinner } from '../LoadingSpinner'

export function AdminLayout() {
  const { user, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="flex min-h-screen theme-bg-surface">
      <AdminSidebar />
      <main className="flex-1 theme-transition">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}