import { useState, FormEvent } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useExpenses } from '../../hooks/useExpenses'
import './ExpenseForm.css'

export default function ExpenseForm() {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { addExpense } = useExpenses()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!amount) {
      setError('Le montant est requis')
      return
    }

    setLoading(true)

    try {
      await addExpense(user!.uid, {
        amount: parseFloat(amount),
        category,
        date: new Date(date),
      })
      setAmount('')
      setCategory('')
      setDate(new Date().toISOString().split('T')[0])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="expense-form-new">
      <div className="form-header">
        <h3>Ajouter une dépense</h3>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Montant (Ar)</label>
          <div className="input-with-icon">
            <span className="currency-symbol">Ar</span>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Catégorie</label>
          <input
            type="text"
            placeholder="Ex: Nourriture, Transport..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <button type="submit" disabled={loading} className="btn-submit">
        {loading ? 'Ajout...' : 'Ajouter dépense'}
      </button>
    </form>
  )
}
