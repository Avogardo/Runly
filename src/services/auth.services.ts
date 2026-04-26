import * as SecureStore from 'expo-secure-store'

import {API_BASE_URL} from '@/consts'
import {RegisterResponse, AuthUser, SessionResponse} from "@/types";

const LOGGED_IN_KEY = 'runly_logged_in'

async function fetchCsrf(): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/auth/csrf`, {
    credentials: 'include'
  })
  const data = (await response.json()) as {csrfToken: string}
  return data.csrfToken
}

async function register(
  email: string,
  password: string,
  name?: string
): Promise<RegisterResponse> {
  const body: Record<string, string> = {email, password}
  if (name) body.name = name

  const response = await fetch(`${API_BASE_URL}/api/register`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    const error = (await response.json()) as {error: string}
    throw new Error(error.error || 'Registration failed')
  }

  return (await response.json()) as RegisterResponse
}

async function login(email: string, password: string): Promise<AuthUser> {
  const csrfToken = await fetchCsrf()

  await fetch(`${API_BASE_URL}/api/auth/callback/credentials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&csrfToken=${encodeURIComponent(csrfToken)}`,
    credentials: 'include',
    redirect: 'follow'
  })

  const user = await getSession()
  if (!user) {
    throw new Error('Invalid email or password')
  }

  await SecureStore.setItemAsync(LOGGED_IN_KEY, 'true')

  return user
}

async function getSession(): Promise<AuthUser | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/session`, {
      credentials: 'include'
    })

    const data = (await response.json()) as SessionResponse
    return data.user || null
  } catch {
    return null
  }
}

async function logout(): Promise<void> {
  try {
    const csrfToken = await fetchCsrf()

    await fetch(`${API_BASE_URL}/api/auth/signout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `csrfToken=${encodeURIComponent(csrfToken)}`,
      credentials: 'include'
    })
  } catch {
    // Ignore errors on logout
  } finally {
    await SecureStore.deleteItemAsync(LOGGED_IN_KEY)
  }
}

async function isAuthenticated(): Promise<boolean> {
  const flag = await SecureStore.getItemAsync(LOGGED_IN_KEY)
  return flag === 'true'
}

async function buildCookieHeader(): Promise<Record<string, string>> {
  return {}
}

export const authService = {
  register,
  login,
  logout,
  getSession,
  isAuthenticated,
  buildCookieHeader
}
