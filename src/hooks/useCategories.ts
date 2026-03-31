import { useContext } from 'react'
import { CategoriesContext, CategoriesContextType } from '../contexts/CategoriesContext'

export function useCategories(): CategoriesContextType {
  const context = useContext(CategoriesContext)
  if (!context) {
    throw new Error('useCategories doit être utilisé dans CategoriesProvider')
  }
  return context
}
