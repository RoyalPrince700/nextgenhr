import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { jobsApi } from '../api/jobs'
import type { Job } from '../types/job'
import { employmentLabel, workplaceLabel } from '../types/job'

export function JobDetailPage() {
  const { id } = useParams()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) {
      setLoading(false)
      setError('That role is not available.')
      return
    }

    const jobId = id
    let active = true

    async function load() {
      setLoading(true)
      setError('')
      try {
        const data = await jobsApi.get(jobId)
        if (active) setJob(data.job)
      } catch (err) {
        if (active) {
          setJob(null)
          setError(err instanceof Error ? err.message : 'Unable to load that role.')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()
    return () => {
      active = false
    }
  }, [id])

  if (loading) {
    return (
      <section className="section jobs">
        <div className="container">
          <p className="section-lead">Loading this role…</p>
        </div>
      </section>
    )
  }

  if (error || !job) {
    return (
      <section className="section jobs">
        <div className="container">
          <p className="eyebrow">Open roles</p>
          <h1 className="section-title">Role not available.</h1>
          <p className="section-lead">{error || 'That role is not on the public board.'}</p>
          <Link className="btn btn-primary" to="/jobs">
            Back to job listings
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="section jobs">
      <div className="container job-detail">
        <div>
          <Link className="job-back" to="/jobs">
            All job listings
          </Link>
          <p className="eyebrow">
            {employmentLabel(job.employmentType)} · {workplaceLabel(job.workplace)}
          </p>
          <h1 className="section-title">{job.title}</h1>
          <p className="section-lead">{job.summary}</p>
          <p className="job-description">{job.description}</p>
        </div>
        <aside className="job-side">
          <p className="eyebrow">Apply</p>
          <h2>{job.organisation}</h2>
          <dl>
            <dt>Location</dt>
            <dd>{job.location}</dd>
            <dt>Workplace</dt>
            <dd>{workplaceLabel(job.workplace)}</dd>
            <dt>Type</dt>
            <dd>{employmentLabel(job.employmentType)}</dd>
          </dl>
          {job.applyUrl ? (
            <a className="btn btn-primary" href={job.applyUrl} target="_blank" rel="noreferrer">
              Apply online
            </a>
          ) : null}
          {job.applyEmail ? (
            <a className="btn btn-outline" href={`mailto:${job.applyEmail}`}>
              Email {job.applyEmail}
            </a>
          ) : null}
        </aside>
      </div>
    </section>
  )
}
