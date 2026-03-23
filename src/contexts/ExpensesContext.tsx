import { createContext, useState, useCallback, ReactNode } from 'react'
import { db } from '../services/firebase/init'
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  Unsubscribe,
} from 'firebase/firestore'

export interface Expense {
  id: string
  userId: string
  [key: string]: any
  createdAt?: Date
}

export interface ExpensesContextType {
  expenses: Expense[]
  loading: boolean
  loadExpenses: (userId: string) => Unsubscribe | void
  addExpense: (userId: string, expenseData: any) => Promise<string>
  deleteExpense: (expenseId: string) => Promise<void>
  updateExpense: (expenseId: string, updates: any) => Promise<void>
}

export const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined)

interface ExpensesProviderProps {
  children: ReactNode
}

export function ExpensesProvider({ children }: ExpensesProviderProps) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(false)

  const loadExpenses = useCallback((userId: string) => {
    if (!userId) {
      setExpenses([])
      return
    }

    setLoading(true)
    const q = query(collection(db, 'expenses'), where('userId', '==', userId))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Expense[]
      setExpenses(data)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const addExpense = async (userId: string, expenseData: any): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'expenses'), {
        userId,
        ...expenseData,
        createdAt: new Date(),
      })
      return docRef.id
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error)
      throw error
    }
  }

  const deleteExpense = async (expenseId: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'expenses', expenseId))
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      throw error
    }
  }

  const updateExpense = async (expenseId: string, updates: any): Promise<void> => {
    try {
      await updateDoc(doc(db, 'expenses', expenseId), updates)
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      throw error
    }
  }

  const value: ExpensesContextType = {
    expenses,
    loading,
    loadExpenses,
    addExpense,
    deleteExpense,
    updateExpense,
  }

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  )
}
