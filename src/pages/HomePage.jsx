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
      <header className="header">
        <h1>Suivi Dépenses</h1>
        <div className="user-info">
          <span>{user?.email}</span>
          <button onClick={handleLogout} className="btn-logout">
            Déconnexion
          </button>
        </div>
      </header>

      <div className="container">
        <div className="sidebar">
          <ExpenseForm />
        </div>

        <div className="main-content">
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
