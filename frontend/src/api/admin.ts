import type { UserRole } from '../types/auth'
import type { AdminAccount, AdminOverview } from '../types/admin'
import { apiFetch } from './client'

function adminFetch<T>(path: string, token: string, options: RequestInit = {}): Promise<T> {
  return apiFetch<T>(path, {
    ...options,
    headers: {
      ...(options.headers as Record<string, string> | undefined),
      Authorization: `Bearer ${token}`,
    },
  })
}

export const adminApi = {
  overview(token: string) {
    return adminFetch<AdminOverview>('/admin/overview', token)
  },

  updateRole(token: string, userId: string, role: UserRole) {
    return adminFetch<{ message: string; user: Pick<AdminAccount, 'id' | 'fullName' | 'email' | 'role'> }>(
      `/admin/users/${userId}/role`,
      token,
      {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      },
    )
  },
}
