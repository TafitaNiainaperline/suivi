import { useExpenses } from '../hooks/useExpenses'
import Sidebar from '../components/Sidebar'
import './HomePage.css'

export default function HomePage() {
  const { expenses } = useExpenses()

  const total = expenses.reduce((sum, e) => sum + (e.amount || 0), 0)
  const thisMonth = new Date().getMonth()
  const thisYear = new Date().getFullYear()
  const monthlyTotal = expenses
    .filter((e) => {
      const d = e.date?.seconds ? new Date(e.date.seconds * 1000) : new Date(e.date)
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear
    })
    .reduce((sum, e) => sum + (e.amount || 0), 0)

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
          </div>
        </div>
      </div>
    </div>
  )
}
