import { createContext, useState, useEffect, ReactNode } from 'react'
import { db, auth } from '../services/firebase/init'
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
import { onAuthStateChanged } from 'firebase/auth'

export interface Expense {
  id: string
  userId: string
  [key: string]: any
  createdAt?: Date
}

export interface ExpensesContextType {
  expenses: Expense[]
  loading: boolean
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null

    let initialized = false

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot()
        unsubscribeSnapshot = null
      }

      if (!user) {
        if (initialized) {
          // Vraiment déconnecté (pas juste l'init au reload)
          setExpenses([])
          setLoading(false)
        } else {
          // Premier appel null au reload — on attend le vrai état
          initialized = true
        }
        return
      }

      initialized = true
      setLoading(true)
      const q = query(collection(db, 'expenses'), where('userId', '==', user.uid))
      unsubscribeSnapshot = onSnapshot(q, async (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Expense[]
        setExpenses(data)
        setLoading(false)

        // Générer les dépenses récurrentes manquantes pour le mois courant
        const now = new Date()
        const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
        const recurrentExpenses = data.filter((e) => e.recurrent)
        for (const template of recurrentExpenses) {
          if (template.frequency === 'monthly') {
            const alreadyExists = data.some((e) => {
              if (!e.recurrentSourceId || e.recurrentSourceId !== template.id) return false
              const d = new Date((e.date as any)?.seconds * 1000 || e.date)
              const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
              return m === currentMonthKey
            })
            const templateDate = new Date((template.date as any)?.seconds * 1000 || template.date)
            const templateMonthKey = `${templateDate.getFullYear()}-${String(templateDate.getMonth() + 1).padStart(2, '0')}`
            if (!alreadyExists && templateMonthKey !== currentMonthKey) {
              const newDate = new Date(now.getFullYear(), now.getMonth(), templateDate.getDate())
              await addDoc(collection(db, 'expenses'), {
                userId: user.uid,
                amount: template.amount,
                category: template.category,
                note: template.note || null,
                date: newDate,
                recurrent: false,
                recurrentSourceId: template.id,
                createdAt: new Date(),
              })
            }
          }
        }
      })
    })

    return () => {
      unsubscribeAuth()
      if (unsubscribeSnapshot) unsubscribeSnapshot()
    }
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
