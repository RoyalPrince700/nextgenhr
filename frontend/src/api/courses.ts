import type { CourseLists } from '../types/course'
import { apiFetch } from './client'

function withAuth(token: string, options: RequestInit = {}): RequestInit {
  return {
    ...options,
    headers: {
      ...(options.headers as Record<string, string> | undefined),
      Authorization: `Bearer ${token}`,
    },
  }
}

export const coursesApi = {
  list(token: string) {
    return apiFetch<CourseLists>('/courses', withAuth(token))
  },

  enroll(token: string, slug: string) {
    return apiFetch<CourseLists>(`/courses/${slug}/enroll`, withAuth(token, { method: 'POST' }))
  },
}
