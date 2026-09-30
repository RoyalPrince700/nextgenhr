import { useCallback, useEffect, useState } from 'react'
import { coursesApi } from '../api/courses'
import { useAuth } from '../context/AuthContext'
import type { CourseLists } from '../types/course'

export function useCourses() {
  const { token } = useAuth()
  const [data, setData] = useState<CourseLists | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [enrollingSlug, setEnrollingSlug] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!token) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    try {
      const lists = await coursesApi.list(token)
      setData(lists)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load courses.')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    void load()
  }, [load])

  const enroll = useCallback(
    async (slug: string) => {
      if (!token) return

      setEnrollingSlug(slug)
      setError('')

      try {
        const lists = await coursesApi.enroll(token, slug)
        setData(lists)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to enrol.')
      } finally {
        setEnrollingSlug(null)
      }
    },
    [token],
  )

  return { data, loading, error, enrollingSlug, enroll, reload: load }
}
