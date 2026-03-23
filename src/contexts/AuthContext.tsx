import { createContext, useEffect, useState, ReactNode } from 'react'
import { auth } from '../services/firebase/init'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth'

export interface AuthContextType {
  user: User | null
  loading: boolean
  register: (email: string, password: string) => Promise<any>
  login: (email: string, password: string) => Promise<any>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const register = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password)

  const login = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password)

  const logout = () => signOut(auth)

  const value: AuthContextType = { user, loading, register, login, logout }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
