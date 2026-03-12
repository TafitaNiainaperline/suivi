import { createContext, useState, useCallback } from 'react'
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
} from 'firebase/firestore'

export const ExpensesContext = createContext()

export function ExpensesProvider({ children }) {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(false)

  const loadExpenses = useCallback((userId) => {
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
      }))
      setExpenses(data)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const addExpense = async (userId, expenseData) => {
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

  const deleteExpense = async (expenseId) => {
    try {
      await deleteDoc(doc(db, 'expenses', expenseId))
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      throw error
    }
  }

  const updateExpense = async (expenseId, updates) => {
    try {
      await updateDoc(doc(db, 'expenses', expenseId), updates)
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      throw error
    }
  }

  return (
    <ExpensesContext.Provider
      value={{
        expenses,
        loading,
        loadExpenses,
        addExpense,
        deleteExpense,
        updateExpense,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  )
}
