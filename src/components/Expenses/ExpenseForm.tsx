import { useState, FormEvent } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useExpenses } from '../../hooks/useExpenses'
import { useBudget } from '../../hooks/useBudget'
import { useToast } from '../../hooks/useToast'
import './ExpenseForm.css'
import './ExpenseCard.css'

export default function ExpenseForm() {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [note, setNote] = useState('')
  const [recurrent, setRecurrent] = useState(false)
  const [frequency, setFrequency] = useState<'monthly' | 'weekly'>('monthly')
  const [loading, setLoading] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const { user } = useAuth()
  const { addExpense, expenses } = useExpenses()
  const { budgets } = useBudget()
  const { showToast } = useToast()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!amount) return
    setConfirming(true)
  }

  const handleConfirm = async () => {
    setConfirming(false)
    setLoading(true)
    try {
      const expenseDate = new Date(date + 'T00:00:00')
      await addExpense(user!.uid, {
        amount: parseFloat(amount),
        category,
        date: expenseDate,
        note: note.trim() || null,
        recurrent,
        frequency: recurrent ? frequency : null,
      })
      setAmount('')
      setCategory('')
      setDate(new Date().toISOString().split('T')[0])
      setNote('')
      setRecurrent(false)
      showToast('Dépense ajoutée avec succès')

      // Vérifier dépassement budget
      if (category) {
        const monthKey = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, '0')}`
        const budget = budgets.find((b) => b.category === category && b.month === monthKey)
        if (budget) {
          const spent = expenses
            .filter((e) => {
              const d = new Date((e.date as any)?.seconds * 1000 || e.date)
              const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
              return m === monthKey && e.category === category
            })
            .reduce((s, e) => s + (e.amount || 0), 0) + parseFloat(amount)
          if (spent > budget.amount) {
            showToast(`Budget "${category}" dépassé ! (${spent.toLocaleString('fr-FR')} Ar / ${budget.amount.toLocaleString('fr-FR')} Ar)`, 'error')
          } else if (spent / budget.amount >= 0.8) {
            showToast(`Budget "${category}" à ${Math.round((spent / budget.amount) * 100)}% utilisé`, 'info')
          }
        }
      }
    } catch (err: any) {
      showToast("Erreur lors de l'ajout", 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
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

        <div className="form-group form-group-note">
          <label>Note (optionnel)</label>
          <input
            type="text"
            placeholder="Ex: Remboursement taxi, repas client..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="form-recurrent">
          <label className="recurrent-toggle">
            <input
              type="checkbox"
              checked={recurrent}
              onChange={(e) => setRecurrent(e.target.checked)}
            />
            <span>Dépense récurrente</span>
          </label>
          {recurrent && (
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as 'monthly' | 'weekly')}
              className="recurrent-freq"
            >
              <option value="monthly">Mensuelle</option>
              <option value="weekly">Hebdomadaire</option>
            </select>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? 'Ajout...' : 'Ajouter dépense'}
        </button>
      </form>

      {confirming && (
        <div className="modal-overlay" onClick={() => setConfirming(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <p>Ajouter cette dépense ?</p>
            <div className="modal-details">
              <span>{category || 'Sans catégorie'}</span>
              <strong>Ar {parseFloat(amount).toLocaleString('fr-FR')}</strong>
            </div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setConfirming(false)}>Annuler</button>
              <button className="modal-confirm modal-confirm-add" onClick={handleConfirm}>Confirmer</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
