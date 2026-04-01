import { useExpenses } from '../hooks/useExpenses'
import { useBudget } from '../hooks/useBudget'
import Sidebar from '../components/Sidebar'
import PieChart from '../components/Charts/PieChart'
import BarChart from '../components/Charts/BarChart'
import LineChart from '../components/Charts/LineChart'
import './HomePage.css'

export default function HomePage() {
  const { expenses } = useExpenses()
  const { budgets } = useBudget()

  const total = expenses.reduce((sum, e) => sum + (e.amount || 0), 0)
  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()
  const currentMonthKey = `${thisYear}-${String(thisMonth + 1).padStart(2, '0')}`

  const monthlyTotal = expenses
    .filter((e) => {
      const d = new Date((e.date as any)?.seconds * 1000 || (e.date as any))
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear
    })
    .reduce((sum, e) => sum + (e.amount || 0), 0)

  const monthlyBudgetTotal = budgets
    .filter((b) => b.month === currentMonthKey)
    .reduce((sum, b) => sum + b.amount, 0)

  const budgetRemaining = monthlyBudgetTotal - monthlyTotal

  return (
    <div className="home-page">
      <Sidebar activePath="/" />

      <div className="page-wrapper">
        <div className="main-wrapper">
          <div className="content-header">
            <h2>Dashboard</h2>
            <p>Voici votre résumé des dépenses</p>
          </div>

          <div className="summary-cards">
            <div className="summary-card">
              <span className="summary-label">Total ce mois</span>
              <span className="summary-amount">{monthlyTotal.toLocaleString('fr-FR')} Ar</span>
            </div>
            <div className="summary-card">
              <span className="summary-label">Total général</span>
              <span className="summary-amount">{total.toLocaleString('fr-FR')} Ar</span>
            </div>
            <div className="summary-card">
              <span className="summary-label">Nombre de dépenses</span>
              <span className="summary-amount">{expenses.length}</span>
            </div>
            {monthlyBudgetTotal > 0 && (
              <div className={`summary-card ${budgetRemaining < 0 ? 'summary-card-danger' : budgetRemaining / monthlyBudgetTotal < 0.2 ? 'summary-card-warning' : ''}`}>
                <span className="summary-label">Budget restant ce mois</span>
                <span className="summary-amount">{budgetRemaining.toLocaleString('fr-FR')} Ar</span>
                <span className="summary-sub">{monthlyBudgetTotal.toLocaleString('fr-FR')} Ar budgétés</span>
              </div>
            )}
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
        </div>
      </div>
    </div>
  )
}
