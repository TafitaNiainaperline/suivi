import { useContext } from 'react'
import { ExpensesContext, ExpensesContextType, Expense } from '../contexts/ExpensesContext'

export function useExpenses(): ExpensesContextType {
  const context = useContext(ExpensesContext)
  if (!context) {
    throw new Error('useExpenses doit être utilisé dans ExpensesProvider')
  }
  return context
}

export type { Expense, ExpensesContextType }

