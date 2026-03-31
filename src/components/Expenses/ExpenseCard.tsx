import { useExpenses, Expense } from '../../hooks/useExpenses'
import './ExpenseCard.css'

interface ExpenseCardProps {
  expense: Expense
}

export default function ExpenseCard({ expense }: ExpenseCardProps) {
  const { deleteExpense } = useExpenses()

  const handleDelete = async () => {
    if (confirm('Supprimer cette dépense ?')) {
      try {
        await deleteExpense(expense.id)
      } catch (error) {
        console.error('Erreur:', error)
      }
    }
  }

  const formattedDate = new Date(
    (expense.date as any)?.seconds * 1000 || expense.date
  ).toLocaleDateString('fr-FR')

  return (
    <div className="expense-card">
      <div className="card-header">
        <div className="card-info">
          <h3>{expense.category || 'Sans catégorie'}</h3>
        </div>
        <div className="amount">Ar {Number(expense.amount).toLocaleString('fr-FR')}</div>
      </div>
      <div className="card-footer">
        <span className="date">{formattedDate}</span>
        <button onClick={handleDelete} className="btn-delete">
          Supprimer
        </button>
      </div>
    </div>
  )
}
