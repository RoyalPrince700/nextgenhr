import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { authApi, getStoredToken, setStoredToken } from '../api/auth'
import type { AuthUser } from '../types/auth'

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (fullName: string, email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
  updateSettings: (payload: {
    fullName?: string
    email?: string
    currentPassword?: string
    newPassword?: string
  }) => Promise<string>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(() => getStoredToken())
  const [loading, setLoading] = useState(true)

  const applySession = useCallback((nextToken: string, nextUser: AuthUser) => {
    setStoredToken(nextToken)
    setToken(nextToken)
    setUser(nextUser)
  }, [])

  const logout = useCallback(() => {
    setStoredToken(null)
    setToken(null)
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    const stored = getStoredToken()
    if (!stored) {
      setUser(null)
      setToken(null)
      setLoading(false)
      return
    }

    try {
      const data = await authApi.me(stored)
      setToken(stored)
      setUser(data.user)
    } catch {
      logout()
    } finally {
      setLoading(false)
    }
  }, [logout])

  useEffect(() => {
    void refreshUser()
  }, [refreshUser])

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await authApi.login({ email, password })
      applySession(data.token, data.user)
    },
    [applySession],
  )

  const signup = useCallback(
    async (fullName: string, email: string, password: string) => {
      const data = await authApi.signup({ fullName, email, password })
      applySession(data.token, data.user)
    },
    [applySession],
  )

  const updateSettings = useCallback(
    async (payload: {
      fullName?: string
      email?: string
      currentPassword?: string
      newPassword?: string
    }) => {
      if (!token) {
        throw new Error('Authentication required.')
      }
      const data = await authApi.updateSettings(token, payload)
      setUser(data.user)
      return data.message
    },
    [token],
  )

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      signup,
      logout,
      refreshUser,
      updateSettings,
    }),
    [user, token, loading, login, signup, logout, refreshUser, updateSettings],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
