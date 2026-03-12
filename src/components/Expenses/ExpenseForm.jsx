import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useExpenses } from '../../hooks/useExpenses'
import { EXPENSE_CATEGORIES } from '../../utils/constants'
import './ExpenseForm.css'

export default function ExpenseForm() {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('food')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { addExpense } = useExpenses()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!amount || !description) {
      setError('Tous les champs sont requis')
      return
    }

    setLoading(true)

    try {
      await addExpense(user.uid, {
        amount: parseFloat(amount),
        description,
        category,
        date: new Date(date),
      })
      setAmount('')
      setDescription('')
      setCategory('food')
      setDate(new Date().toISOString().split('T')[0])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <h2>Ajouter une dépense</h2>

      <div className="form-group">
        <label>Montant (€)</label>
        <input
          type="number"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <input
          type="text"
          placeholder="Ex: Café, Essence..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Catégorie</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {EXPENSE_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {error && <div className="error">{error}</div>}

      <button type="submit" disabled={loading} className="btn-submit">
        {loading ? 'Ajout...' : 'Ajouter dépense'}
      </button>
    </form>
  )
}
