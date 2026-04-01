import { useState, useEffect } from 'react'
import { useExpenses, Expense } from '../../hooks/useExpenses'
import { useToast } from '../../hooks/useToast'
import './ExpenseCard.css'

interface ExpenseCardProps {
  expense: Expense
}

export default function ExpenseCard({ expense }: ExpenseCardProps) {
  const { deleteExpense, updateExpense } = useExpenses()
  const { showToast } = useToast()
  const [confirming, setConfirming] = useState(false)
  const [editing, setEditing] = useState(false)

  const rawDate = new Date((expense.date as any)?.seconds * 1000 || expense.date)
  const isoDate = rawDate.toISOString().split('T')[0]

  const [editAmount, setEditAmount] = useState(String(expense.amount))
  const [editCategory, setEditCategory] = useState(expense.category || '')
  const [editDate, setEditDate] = useState(isoDate)
  const [editNote, setEditNote] = useState(expense.note || '')

  useEffect(() => {
    setEditAmount(String(expense.amount))
    setEditCategory(expense.category || '')
    setEditDate(new Date((expense.date as any)?.seconds * 1000 || expense.date).toISOString().split('T')[0])
    setEditNote(expense.note || '')
  }, [expense])

  const formattedDate = rawDate.toLocaleDateString('fr-FR')

  const handleConfirmDelete = async () => {
    setConfirming(false)
    try {
      await deleteExpense(expense.id)
      showToast('Dépense supprimée', 'error')
    } catch {
      showToast('Erreur lors de la suppression', 'error')
    }
  }

  const handleUpdate = async () => {
    if (!editAmount) return
    setEditing(false)
    try {
      await updateExpense(expense.id, {
        amount: parseFloat(editAmount),
        category: editCategory,
        date: new Date(editDate + 'T00:00:00'),
        note: editNote.trim() || null,
      })
      showToast('Dépense modifiée avec succès', 'info')
    } catch {
      showToast('Erreur lors de la modification', 'error')
    }
  }

  return (
    <>
      <div className="expense-card">
        <div className="card-header">
          <div className="card-info">
            <h3>{expense.category || 'Sans catégorie'}</h3>
          </div>
          <div className="amount">Ar {Number(expense.amount).toLocaleString('fr-FR')}</div>
        </div>
        {expense.note && (
          <p className="card-note">{expense.note}</p>
        )}
        <div className="card-footer">
          <span className="date">{formattedDate}</span>
          <div className="card-actions">
            <button onClick={() => setEditing(true)} className="btn-edit">Modifier</button>
            <button onClick={() => setConfirming(true)} className="btn-delete">Supprimer</button>
          </div>
        </div>
      </div>

      {confirming && (
        <div className="modal-overlay" onClick={() => setConfirming(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <p>Supprimer cette dépense ?</p>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setConfirming(false)}>Annuler</button>
              <button className="modal-confirm" onClick={handleConfirmDelete}>Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(false)}>
          <div className="modal-box modal-edit" onClick={(e) => e.stopPropagation()}>
            <p>Modifier la dépense</p>
            <div className="modal-form">
              <div className="modal-field">
                <label>Montant (Ar)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                />
              </div>
              <div className="modal-field">
                <label>Catégorie</label>
                <input
                  type="text"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                />
              </div>
              <div className="modal-field">
                <label>Date</label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                />
              </div>
              <div className="modal-field">
                <label>Note (optionnel)</label>
                <input
                  type="text"
                  placeholder="Ex: Remboursement taxi..."
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setEditing(false)}>Annuler</button>
              <button className="modal-confirm modal-confirm-add" onClick={handleUpdate}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
