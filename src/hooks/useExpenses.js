import { useContext } from 'react'
import { ExpensesContext } from '../contexts/ExpensesContext'

export function useExpenses() {
  const context = useContext(ExpensesContext)
  if (!context) {
    throw new Error('useExpenses doit être utilisé dans ExpensesProvider')
  }
  return context
}
