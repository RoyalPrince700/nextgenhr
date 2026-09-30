const rawApiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'

function isMongoUri(value: string): boolean {
  return /^mongodb(\+srv)?:\/\//i.test(value)
}

function resolveApiUrl(value: string): string {
  const trimmed = value.trim().replace(/\/$/, '')

  if (!trimmed || isMongoUri(trimmed)) {
    return 'http://localhost:5000/api'
  }

  return trimmed
}

export const env = {
  apiUrl: resolveApiUrl(rawApiUrl),
  appName: import.meta.env.VITE_APP_NAME ?? 'NextGen HR Lab',
} as const
