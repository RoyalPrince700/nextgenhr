export type UserRole = 'learner' | 'job-lister' | 'admin'

export interface AuthUser {
  id: string
  fullName: string
  email: string
  role: UserRole
  createdAt?: string
}

export interface AuthResponse {
  message: string
  token: string
  user: AuthUser
}
