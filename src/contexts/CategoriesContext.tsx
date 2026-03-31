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
  Unsubscribe,
} from 'firebase/firestore'

export interface Category {
  id: string
  userId: string
  name: string
  icon: string
  color: string
}

export interface CategoriesContextType {
  categories: Category[]
  loading: boolean
  loadCategories: (userId: string) => Unsubscribe | void
  addCategory: (userId: string, data: Omit<Category, 'id' | 'userId'>) => Promise<string>
  deleteCategory: (categoryId: string) => Promise<void>
}

export const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined)

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)

  const loadCategories = useCallback((userId: string) => {
    if (!userId) {
      setCategories([])
      return
    }

    setLoading(true)
    const q = query(collection(db, 'categories'), where('userId', '==', userId))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Category[]
      setCategories(data)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const addCategory = async (userId: string, data: Omit<Category, 'id' | 'userId'>): Promise<string> => {
    const docRef = await addDoc(collection(db, 'categories'), { userId, ...data })
    return docRef.id
  }

  const deleteCategory = async (categoryId: string): Promise<void> => {
    await deleteDoc(doc(db, 'categories', categoryId))
  }

  return (
    <CategoriesContext.Provider value={{ categories, loading, loadCategories, addCategory, deleteCategory }}>
      {children}
    </CategoriesContext.Provider>
  )
}
