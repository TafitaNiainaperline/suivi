import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ExpensesProvider } from './contexts/ExpensesContext'
import { ToastProvider } from './contexts/ToastContext'
import { BudgetProvider } from './contexts/BudgetContext'
import BudgetPage from './pages/BudgetPage'
import { useAuth } from './hooks/useAuth'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import ExpensesPage from './pages/ExpensesPage'
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
      <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/expenses" element={<ProtectedRoute><ExpensesPage /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
      <Route path="/budget" element={<ProtectedRoute><BudgetPage /></ProtectedRoute>} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ExpensesProvider>
          <ToastProvider>
            <BudgetProvider>
              <AppRoutes />
            </BudgetProvider>
          </ToastProvider>
        </ExpensesProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
