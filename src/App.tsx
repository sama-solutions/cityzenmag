import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { SiteSettingsProvider } from './contexts/SiteSettingsContext'
import { Header } from './components/Header'
import { Home } from './pages/Home'
import { Search } from './pages/Search'
import { ThreadDetail } from './pages/ThreadDetail'
import { Interviews } from './pages/Interviews'
import { PhotoReports } from './pages/PhotoReports'
import { VideoAnalyses } from './pages/VideoAnalyses'
import { Testimonials } from './pages/Testimonials'
import { DebatePage } from './pages/DebatePage'
import { ShareStoryPage } from './pages/ShareStoryPage'
import { AdminLogin } from './pages/admin/AdminLogin'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminArticles } from './pages/admin/AdminArticles'
import { AdminSections } from './pages/admin/AdminSections'
import { AdminCategories } from './pages/admin/AdminCategories'
import { AdminContent } from './pages/admin/AdminContent'
import { AdminScheduler } from './pages/admin/AdminScheduler'
import { AdminMenus } from './pages/admin/AdminMenus'
import { AdminAnalytics } from './pages/admin/AdminAnalytics'
import { SocialMediaAdmin } from './pages/admin/SocialMediaAdmin'
import { AdminSupabase } from './pages/admin/AdminSupabase'
import { AdminSettings } from './pages/admin/AdminSettings'
import { AdminLayout } from './components/admin/AdminLayout'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ReturnToTop } from './components/ReturnToTop'
import './App.css'

// Layout pour les pages publiques
function PublicLayout() {
  return (
    <div className="min-h-screen theme-bg">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <ReturnToTop />
    </div>
  )
}

// Layout pour les pages spéciales (sans container)
function SpecialLayout() {
  return (
    <div className="min-h-screen theme-bg">
      <Header />
      <main>
        <Outlet />
      </main>
      <ReturnToTop />
    </div>
  )
}

// Configuration du router avec future flags
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <PublicLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "search", element: <Search /> },
        { path: "thread/:id", element: <ThreadDetail /> },
        { path: "interviews", element: <Interviews /> },
        { path: "reportages", element: <PhotoReports /> },
        { path: "videos", element: <VideoAnalyses /> },
        { path: "temoignages", element: <Testimonials /> },
      ],
    },
    {
      path: "/",
      element: <SpecialLayout />,
      children: [
        { path: "debat", element: <DebatePage /> },
        { path: "partager-histoire", element: <ShareStoryPage /> },
      ],
    },
    {
      path: "/admin/login",
      element: <AdminLogin />,
    },
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        { index: true, element: <AdminDashboard /> },
        { path: "articles", element: <AdminArticles /> },
        { path: "sections", element: <AdminSections /> },
        { path: "categories", element: <AdminCategories /> },
        { path: "content", element: <AdminContent /> },
        { path: "scheduler", element: <AdminScheduler /> },
        { path: "menus", element: <AdminMenus /> },
        { path: "social", element: <SocialMediaAdmin /> },
        { path: "analytics", element: <AdminAnalytics /> },
        { path: "supabase", element: <AdminSupabase /> },
        { path: "settings", element: <AdminSettings /> },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
)

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <SiteSettingsProvider>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </SiteSettingsProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
