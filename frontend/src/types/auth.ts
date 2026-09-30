export interface AuthUser {
  id: string
  fullName: string
  email: string
  createdAt?: string
}

export interface AuthResponse {
  message: string
  token: string
  user: AuthUser
}
