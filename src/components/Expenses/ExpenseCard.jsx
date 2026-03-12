import { useExpenses } from '../../hooks/useExpenses'
import { EXPENSE_CATEGORIES } from '../../utils/constants'
import './ExpenseCard.css'

export default function ExpenseCard({ expense }) {
  const { deleteExpense } = useExpenses()
  const category = EXPENSE_CATEGORIES.find((c) => c.id === expense.category)

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
    expense.date?.seconds * 1000 || expense.date
  ).toLocaleDateString('fr-FR')

  return (
    <div className="expense-card">
      <div className="card-header">
        <div className="category-badge" style={{ backgroundColor: category?.color }}>
          {category?.icon}
        </div>
        <div className="card-info">
          <h3>{expense.description}</h3>
          <p className="category-name">{category?.name}</p>
        </div>
        <div className="amount">€ {expense.amount.toFixed(2)}</div>
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
