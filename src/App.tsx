import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ExpensesProvider } from './contexts/ExpensesContext'
import { useAuth } from './hooks/useAuth'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import ExpensesPage from './pages/ExpensesPage'
import CategoriesPage from './pages/CategoriesPage'
import ReportsPage from './pages/ReportsPage'
import './App.css'

interface ProtectedRouteProps {
  children: React.ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading-page">Chargement...</div>
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return children
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/" /> : <RegisterPage />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ExpensesProvider>
              <HomePage />
            </ExpensesProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/expenses"
        element={
          <ProtectedRoute>
            <ExpensesProvider>
              <ExpensesPage />
            </ExpensesProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <ExpensesProvider>
              <CategoriesPage />
            </ExpensesProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ExpensesProvider>
              <ReportsPage />
            </ExpensesProvider>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}

export default App
