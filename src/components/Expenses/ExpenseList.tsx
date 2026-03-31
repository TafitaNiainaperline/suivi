import { useExpenses } from '../../hooks/useExpenses'
import ExpenseCard from './ExpenseCard'
import './ExpenseList.css'

interface ExpenseListProps {
  limit?: number
}

export default function ExpenseList({ limit }: ExpenseListProps) {
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

  const displayed = limit ? sorted.slice(0, limit) : sorted

  return (
    <div className="expense-list">
      <div className="cards-container">
        {displayed.map((expense) => (
          <ExpenseCard key={expense.id} expense={expense} />
        ))}
      </div>
    </div>
  )
}
