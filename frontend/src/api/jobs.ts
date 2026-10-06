import type { AdminJob, Job, JobDraft } from '../types/job'
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

export const jobsApi = {
  list() {
    return apiFetch<{ jobs: Job[] }>('/jobs')
  },

  get(id: string) {
    return apiFetch<{ job: Job }>(`/jobs/${id}`)
  },

  adminList(token: string) {
    return adminFetch<{ jobs: AdminJob[] }>('/admin/jobs', token)
  },

  create(token: string, draft: JobDraft) {
    return adminFetch<{ message: string; job: AdminJob }>('/admin/jobs', token, {
      method: 'POST',
      body: JSON.stringify(draft),
    })
  },

  update(token: string, id: string, draft: JobDraft) {
    return adminFetch<{ message: string; job: AdminJob }>(`/admin/jobs/${id}`, token, {
      method: 'PATCH',
      body: JSON.stringify(draft),
    })
  },

  setPublished(token: string, id: string, published: boolean) {
    return adminFetch<{ message: string; job: AdminJob }>(`/admin/jobs/${id}/publish`, token, {
      method: 'PATCH',
      body: JSON.stringify({ published }),
    })
  },

  remove(token: string, id: string) {
    return adminFetch<{ message: string }>(`/admin/jobs/${id}`, token, {
      method: 'DELETE',
    })
  },

  mine(token: string) {
    return adminFetch<{ jobs: AdminJob[] }>('/listings', token)
  },

  submit(token: string, draft: JobDraft) {
    return adminFetch<{ message: string; job: AdminJob }>('/listings', token, {
      method: 'POST',
      body: JSON.stringify({ ...draft, published: false }),
    })
  },

  updateMine(token: string, id: string, draft: JobDraft) {
    return adminFetch<{ message: string; job: AdminJob }>(`/listings/${id}`, token, {
      method: 'PATCH',
      body: JSON.stringify({ ...draft, published: false }),
    })
  },
}
