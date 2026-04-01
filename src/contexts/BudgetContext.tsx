import { createContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { db, auth } from '../services/firebase/init'
import { collection, query, where, onSnapshot, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

export interface Budget {
  id: string
  userId: string
  category: string
  amount: number
  month: string // format YYYY-MM
}

export interface BudgetContextType {
  budgets: Budget[]
  loading: boolean
  addBudget: (userId: string, data: Omit<Budget, 'id' | 'userId'>) => Promise<void>
  updateBudget: (id: string, amount: number) => Promise<void>
  deleteBudget: (id: string) => Promise<void>
}

export const BudgetContext = createContext<BudgetContextType | undefined>(undefined)

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubSnap: (() => void) | null = null
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (unsubSnap) { unsubSnap(); unsubSnap = null }
      if (!user) { setBudgets([]); setLoading(false); return }
      setLoading(true)
      const q = query(collection(db, 'budgets'), where('userId', '==', user.uid))
      unsubSnap = onSnapshot(q, (snap) => {
        setBudgets(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Budget[])
        setLoading(false)
      })
    })
    return () => { unsubAuth(); if (unsubSnap) unsubSnap() }
  }, [])

  const addBudget = useCallback(async (userId: string, data: Omit<Budget, 'id' | 'userId'>) => {
    await addDoc(collection(db, 'budgets'), { userId, ...data })
  }, [])

  const updateBudget = useCallback(async (id: string, amount: number) => {
    await updateDoc(doc(db, 'budgets', id), { amount })
  }, [])

  const deleteBudget = useCallback(async (id: string) => {
    await deleteDoc(doc(db, 'budgets', id))
  }, [])

  return (
    <BudgetContext.Provider value={{ budgets, loading, addBudget, updateBudget, deleteBudget }}>
      {children}
    </BudgetContext.Provider>
  )
}
