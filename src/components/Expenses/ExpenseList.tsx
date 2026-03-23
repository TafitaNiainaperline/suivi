import { useExpenses } from '../../hooks/useExpenses'
import ExpenseCard from './ExpenseCard'
import './ExpenseList.css'

export default function ExpenseList() {
  const { expenses, loading } = useExpenses()

  if (loading) {
    return <div className="loading">Chargement...</div>
  }

  if (expenses.length === 0) {
    return <div className="empty-state">Aucune dépense pour le moment</div>
  }

  const sorted = [...expenses].sort(
    (a, b) => new Date((b.date as any)?.seconds * 1000 || b.date as any).getTime() - new Date((a.date as any)?.seconds * 1000 || a.date as any).getTime()
  )

  return (
    <div className="expense-list">
      <h2>Mes dépenses</h2>
      <div className="cards-container">
        {sorted.map((expense) => (
          <ExpenseCard key={expense.id} expense={expense} />
        ))}
      </div>
    </div>
  )
}
