import { env } from '../config/env'

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  }

  let response: Response

  try {
    response = await fetch(`${env.apiUrl}${path}`, {
      ...options,
      headers,
    })
  } catch {
    throw new Error('Unable to reach the server. Make sure the API is running.')
  }

  let data: ({ message?: string } & T) | null = null

  try {
    data = (await response.json()) as { message?: string } & T
  } catch {
    data = null
  }

  if (!response.ok) {
    throw new Error(data?.message || 'Request failed.')
  }

  if (!data) {
    throw new Error('The server returned an unexpected response.')
  }

  return data
}
