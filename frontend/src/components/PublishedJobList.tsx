import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { jobsApi } from '../api/jobs'
import type { Job } from '../types/job'
import { employmentLabel, workplaceLabel } from '../types/job'

function formatPublished(value: string | null): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

export function PublishedJobList() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setError('')
      try {
        const data = await jobsApi.list()
        if (active) setJobs(data.jobs)
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load job listings.')
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()
    return () => {
      active = false
    }
  }, [])

  if (loading) return <p className="section-lead">Loading published jobs…</p>

  if (error) {
    return (
      <p className="dashboard-alert" role="alert">
        {error}
      </p>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="dashboard-empty">
        <h3>No published jobs right now</h3>
        <p>Open roles appear here once they are published.</p>
      </div>
    )
  }

  return (
    <div className="job-grid">
      {jobs.map((job) => {
        const published = formatPublished(job.publishedAt)
        return (
          <article className="job-card" key={job.id}>
            <p className="job-kicker">
              {employmentLabel(job.employmentType)} · {workplaceLabel(job.workplace)}
            </p>
            <h3>{job.title}</h3>
            <p className="job-org">{job.organisation}</p>
            <p>{job.summary}</p>
            <div className="job-card-foot">
              <span>
                {job.location}
                {published ? ` · ${published}` : ''}
              </span>
              <Link to={`/jobs/${job.id}`}>View role</Link>
            </div>
          </article>
        )
      })}
    </div>
  )
}
