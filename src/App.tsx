import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { Header } from './components/Header'
import { Home } from './pages/Home'
import { Search } from './pages/Search'
import { ThreadDetail } from './pages/ThreadDetail'
import { AdminLogin } from './pages/admin/AdminLogin'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminCategories } from './pages/admin/AdminCategories'
import { AdminContent } from './pages/admin/AdminContent'
import { AdminScheduler } from './pages/admin/AdminScheduler'
import { AdminMenus } from './pages/admin/AdminMenus'
import { AdminLayout } from './components/admin/AdminLayout'
import { ErrorBoundary } from './components/ErrorBoundary'
import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen theme-bg">
              <Routes>
                {/* Routes publiques */}
                <Route path="/" element={
                  <>
                    <Header />
                    <main className="container mx-auto px-4 py-8">
                      <Home />
                    </main>
                  </>
                } />
                <Route path="/search" element={
                  <>
                    <Header />
                    <main className="container mx-auto px-4 py-8">
                      <Search />
                    </main>
                  </>
                } />
                <Route path="/thread/:id" element={
                  <>
                    <Header />
                    <main className="container mx-auto px-4 py-8">
                      <ThreadDetail />
                    </main>
                  </>
                } />
                
                {/* Routes d'administration */}
                <Route path="/admin/login" element={<AdminLogin />} />
                
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="content" element={<AdminContent />} />
                  <Route path="scheduler" element={<AdminScheduler />} />
                  <Route path="menus" element={<AdminMenus />} />
                </Route>
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
