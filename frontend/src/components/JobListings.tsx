import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { jobsApi } from '../api/jobs'
import type { Job } from '../types/job'
import { employmentLabel, workplaceLabel } from '../types/job'

export function JobListings() {
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

  return (
    <section className="section jobs" id="roles">
      <div className="container">
        <p className="eyebrow">Open roles</p>
        <h2 className="section-title">Job listings for the HR community.</h2>
        <div className="rule" />
        <p className="section-lead">
          Current opportunities published by NextGen HR Lab. Open a role to read the brief and apply.
        </p>

        {loading ? <p className="section-lead">Loading open roles…</p> : null}
        {error ? (
          <p className="dashboard-alert" role="alert">
            {error}
          </p>
        ) : null}

        {!loading && !error && jobs.length === 0 ? (
          <div className="dashboard-empty">
            <h3>No open roles right now</h3>
            <p>New listings appear here once they are published.</p>
          </div>
        ) : null}

        {!loading && jobs.length > 0 ? (
          <div className="job-grid">
            {jobs.map((job) => (
              <article className="job-card" key={job.id}>
                <p className="job-kicker">
                  {employmentLabel(job.employmentType)} · {workplaceLabel(job.workplace)}
                </p>
                <h3>{job.title}</h3>
                <p className="job-org">{job.organisation}</p>
                <p>{job.summary}</p>
                <div className="job-card-foot">
                  <span>{job.location}</span>
                  <Link to={`/jobs/${job.id}`}>View role</Link>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
