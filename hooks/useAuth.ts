"use client"

import { createContext, useContext } from "react"

interface User {
  phone: string
  firstName: string
  lastName: string
  email?: string
  studentId?: string
  role: "user" | "creator" | "admin"
  position?: string
  profileImage?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (phone: string, password: string) => Promise<void>
  logout: () => void
  isCreator: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

export { AuthContext }
