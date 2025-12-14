"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { apiRequest } from "./api-client"

type UserRole = "user" | "creator" | "admin"

interface User {
  id: string
  firstName?: string
  lastName?: string
  phone: string
  email?: string
  studentId?: string
  role: UserRole
  bio? : string
  position?: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (identifier: string, password: string, isStudentId: boolean) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  isAdmin: () => boolean
  isCreator: () => boolean
}

interface RegisterData {
  firstName: string
  lastName: string
  phone: string
  email?: string
  studentId?: string
  password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await apiRequest("/auth/me/", {
      method: "GET",})

      if (response.ok) {
        const userData = await response.json()
        setUser({
          id: userData.id,
          firstName: userData.first_name,
          lastName: userData.last_name,
          phone: userData.phone || userData.mobile,
          email: userData.email,
          studentId: userData.student_id,
          role: userData.role || "user",
          bio : userData.bio || "",
          avatar: userData.avatar || "",
          position: userData.position || "",
        })
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (identifier: string, password: string, isStudentId: boolean) => {
    try {
      const loginData = isStudentId ? { student_id: identifier, password } : { phone: identifier, password }

      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(loginData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "خطا در ورود")
      }

      const data = await response.json()

      document.cookie = `access_token=${data.access}; path=/; max-age=86400; samesite=strict; ${
        process.env.NODE_ENV === "production" ? "secure;" : ""
      }`
      document.cookie = `refresh_token=${data.refresh}; path=/; max-age=604800; samesite=strict; ${
        process.env.NODE_ENV === "production" ? "secure;" : ""
      }`

      await checkAuth()
      router.push("/")
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          email: data.email,
          student_id: data.studentId,
          password: data.password,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "خطا در ثبت‌نام")
      }

      await login(data.phone, data.password, false)
    } catch (error) {
      console.error("Register error:", error)
      throw error
    }
  }

  const logout = () => {
    document.cookie = "access_token=; path=/; max-age=0"
    document.cookie = "refresh_token=; path=/; max-age=0"

    setUser(null)
    router.push("/")
  }

  const isAdmin = () => user?.role === "admin"
  const isCreator = () => user?.role === "creator" || user?.role === "admin"

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isCreator }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
