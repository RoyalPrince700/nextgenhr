import type { AuthResponse, AuthUser } from '../types/auth'
import { apiFetch } from './client'

const TOKEN_KEY = 'nextgenhrlab_token'

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setStoredToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

function authFetch<T>(path: string, options: RequestInit = {}, token?: string | null): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return apiFetch<T>(path, {
    ...options,
    headers,
  })
}

export const authApi = {
  signup(payload: { fullName: string; email: string; password: string }) {
    return authFetch<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  login(payload: { email: string; password: string }) {
    return authFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  forgotPassword(email: string) {
    return authFetch<{ message: string; resetUrl?: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  },

  resetPassword(payload: { token: string; password: string }) {
    return authFetch<AuthResponse>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  me(token: string) {
    return authFetch<{ user: AuthUser }>('/auth/me', { method: 'GET' }, token)
  },

  updateSettings(
    token: string,
    payload: {
      fullName?: string
      email?: string
      currentPassword?: string
      newPassword?: string
    },
  ) {
    return authFetch<{ message: string; user: AuthUser }>(
      '/auth/settings',
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      },
      token,
    )
  },
}
