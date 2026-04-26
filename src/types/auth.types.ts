export type AuthUser = {
  id: string
  email: string
  name?: string
}

export type RegisterResponse = {
  id: string
  email: string
  name?: string
  createdAt: string
}

export type SessionResponse = {
  user?: AuthUser
  expires?: string
}
