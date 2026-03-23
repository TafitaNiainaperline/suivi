import { useAuth } from '../hooks/useAuth'
import { useExpenses } from '../hooks/useExpenses'
import { useEffect } from 'react'
import ExpenseForm from '../components/Expenses/ExpenseForm'
import ExpenseList from '../components/Expenses/ExpenseList'
import PieChart from '../components/Charts/PieChart'
import BarChart from '../components/Charts/BarChart'
import LineChart from '../components/Charts/LineChart'
import './HomePage.css'

export default function HomePage() {
  const { user, logout } = useAuth()
  const { loadExpenses } = useExpenses()

  useEffect(() => {
    if (user) {
      loadExpenses(user.uid)
    }
  }, [user, loadExpenses])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Erreur logout:', error)
    }
  }

  return (
    <div className="home-page">
      <aside className="sidebar-nav">
        <div className="logo">
          <h3>Suivi</h3>
        </div>

        <nav className="nav-menu">
          <a href="/" className="nav-item active">
            <img src="/images/dashboard-svgrepo-com.svg" alt="Dashboard" className="nav-icon-img" />
            <span>Dashboard</span>
          </a>
          <a href="/expenses" className="nav-item">
            <img src="/images/budget-svgrepo-com.svg" alt="Dépenses" className="nav-icon-img" />
            <span>Dépenses</span>
          </a>
          <a href="/categories" className="nav-item">
            <img src="/images/category-svgrepo-com.svg" alt="Catégories" className="nav-icon-img" />
            <span>Catégories</span>
          </a>
          <a href="/reports" className="nav-item">
            <img src="/images/budget-svgrepo-com.svg" alt="Rapports" className="nav-icon-img" />
            <span>Rapports</span>
          </a>
        </nav>

        <div className="nav-footer">
          <button onClick={handleLogout} className="btn-user-logout">
            <img src="/images/user-svgrepo-com.svg" alt="User" className="user-avatar-footer" />
            <div className="user-logout-info">
              <span className="user-name-footer">{user?.email?.split('@')[0]}</span>
              <span className="logout-text">Déconnexion</span>
            </div>
          </button>
        </div>
      </aside>

      <div className="page-wrapper">
        <div className="main-wrapper">
          <div className="content-header">
            <h2>Bonjour {user?.email?.split('@')[0]}</h2>
            <p>Voici votre résumé des dépenses</p>
          </div>

          <div className="form-section">
            <ExpenseForm />
          </div>

          <section className="charts-section">
            <div className="charts-grid">
              <PieChart />
              <BarChart />
            </div>
            <div className="chart-full">
              <LineChart />
            </div>
          </section>

          <section className="list-section">
            <ExpenseList />
          </section>
        </div>
      </div>
    </div>
  )
}
