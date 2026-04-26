import {createContext, useContext, useEffect, useState, useCallback, type FC, type ReactNode} from 'react'

import {authService} from '@/services'
import {AuthUser} from "@/types";

type AuthContextType = {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name?: string) => Promise<void>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: FC<{children: ReactNode}> = ({children}) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkSession = useCallback(async () => {
    try {
      const session = await authService.getSession()
      setUser(session)
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void checkSession()
  }, [checkSession])

  const login = useCallback(async (email: string, password: string) => {
    const loggedUser = await authService.login(email, password)
    setUser(loggedUser)
  }, [])

  const register = useCallback(async (email: string, password: string, name?: string) => {
    await authService.register(email, password, name)
    const loggedUser = await authService.login(email, password)
    setUser(loggedUser)
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        checkSession
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

