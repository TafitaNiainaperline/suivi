import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useBudget } from '../hooks/useBudget'
import { useExpenses } from '../hooks/useExpenses'
import { useToast } from '../hooks/useToast'
import Sidebar from '../components/Sidebar'
import './BudgetPage.css'
import './HomePage.css'

export default function BudgetPage() {
  const { user } = useAuth()
  const { budgets, addBudget, updateBudget, deleteBudget } = useBudget()
  const { expenses } = useExpenses()
  const { showToast } = useToast()

  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [month, setMonth] = useState(currentMonth)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editAmount, setEditAmount] = useState('')

  const monthBudgets = budgets.filter((b) => b.month === month)

  const getSpent = (cat: string) =>
    expenses
      .filter((e) => {
        const d = new Date((e.date as any)?.seconds * 1000 || (e.date as any))
        const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        return m === month && e.category === cat
      })
      .reduce((s, e) => s + (e.amount || 0), 0)

  const handleAdd = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!category.trim() || !amount) return
    try {
      await addBudget(user!.uid, { category: category.trim(), amount: parseFloat(amount), month })
      setCategory('')
      setAmount('')
      showToast('Budget ajouté')
    } catch (err) {
      showToast('Erreur lors de l\'ajout', 'error')
    }
  }

  const handleUpdate = async (id: string) => {
    if (!editAmount) return
    await updateBudget(id, parseFloat(editAmount))
    setEditingId(null)
    showToast('Budget modifié', 'info')
  }

  const handleDelete = async (id: string) => {
    await deleteBudget(id)
    showToast('Budget supprimé', 'error')
  }

  return (
    <div className="home-page">
      <Sidebar activePath="/budget" />
      <div className="page-wrapper">
        <div className="main-wrapper">
          <div className="content-header">
            <h2>Budget mensuel</h2>
            <p>Définissez un budget par catégorie</p>
          </div>

          <div className="budget-month-picker">
            <label>Mois :</label>
            <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
          </div>

          <form className="budget-form" onSubmit={handleAdd}>
            <input
              type="text"
              placeholder="Catégorie"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Montant (Ar)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <button type="submit" className="btn-budget-add">Ajouter</button>
          </form>

          {monthBudgets.length === 0 ? (
            <div className="empty-state">Aucun budget défini pour ce mois</div>
          ) : (
            <div className="budget-list">
              {monthBudgets.map((b) => {
                const spent = getSpent(b.category)
                const pct = Math.min((spent / b.amount) * 100, 100)
                const over = spent > b.amount
                return (
                  <div key={b.id} className="budget-card">
                    <div className="budget-card-header">
                      <span className="budget-category">{b.category}</span>
                      <div className="budget-actions">
                        <button className="btn-edit-budget" onClick={() => { setEditingId(b.id); setEditAmount(String(b.amount)) }}>Modifier</button>
                        <button className="btn-delete-budget" onClick={() => handleDelete(b.id)}>Supprimer</button>
                      </div>
                    </div>

                    {editingId === b.id ? (
                      <div className="budget-edit-row">
                        <input type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} />
                        <button onClick={() => handleUpdate(b.id)} className="btn-budget-save">Enregistrer</button>
                        <button onClick={() => setEditingId(null)} className="btn-budget-cancel">Annuler</button>
                      </div>
                    ) : (
                      <div className="budget-amounts">
                        <span className={over ? 'over-budget' : ''}>
                          {spent.toLocaleString('fr-FR')} Ar dépensé
                        </span>
                        <span>/ {b.amount.toLocaleString('fr-FR')} Ar</span>
                      </div>
                    )}

                    <div className="budget-bar-bg">
                      <div
                        className={`budget-bar-fill ${over ? 'over' : pct > 80 ? 'warning' : ''}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="budget-pct">{Math.round(pct)}% utilisé</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
