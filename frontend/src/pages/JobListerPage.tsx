import { useEffect, useState } from 'react'
import { jobsApi } from '../api/jobs'
import { useAuth } from '../context/AuthContext'
import type { AdminJob, JobDraft } from '../types/job'
import {
  EMPLOYMENT_OPTIONS,
  WORKPLACE_OPTIONS,
  emptyJobDraft,
  employmentLabel,
  listingStatus,
  listingStatusClass,
  listingStatusLabel,
  workplaceLabel,
} from '../types/job'

function formatDate(value?: string | null): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

function draftFromJob(job: AdminJob): JobDraft {
  return {
    title: job.title,
    organisation: job.organisation,
    location: job.location,
    workplace: job.workplace,
    employmentType: job.employmentType,
    summary: job.summary,
    description: job.description,
    applyEmail: job.applyEmail,
    applyUrl: job.applyUrl,
    published: false,
  }
}

export function JobListerPage() {
  const { token } = useAuth()
  const [jobs, setJobs] = useState<AdminJob[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<JobDraft>(emptyJobDraft)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    const authToken = token
    let active = true

    async function load() {
      setLoading(true)
      setError('')
      try {
        const data = await jobsApi.mine(authToken)
        if (active) setJobs(data.jobs)
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load your listings.')
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()
    return () => {
      active = false
    }
  }, [token])

  function openCreate() {
    setEditingId(null)
    setDraft(emptyJobDraft())
    setFormOpen(true)
    setError('')
    setNotice('')
  }

  function openEdit(job: AdminJob) {
    setEditingId(job.id)
    setDraft(draftFromJob(job))
    setFormOpen(true)
    setError('')
    setNotice('')
  }

  function closeForm() {
    setFormOpen(false)
    setEditingId(null)
    setDraft(emptyJobDraft())
  }

  function updateDraft<K extends keyof JobDraft>(key: K, value: JobDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  async function saveJob(event: React.FormEvent) {
    event.preventDefault()
    if (!token) return

    setSaving(true)
    setError('')
    setNotice('')

    try {
      const result = editingId
        ? await jobsApi.updateMine(token, editingId, draft)
        : await jobsApi.submit(token, draft)
      const data = await jobsApi.mine(token)
      setJobs(data.jobs)
      setNotice(result.message)
      closeForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit that listing.')
    } finally {
      setSaving(false)
    }
  }

  const pendingCount = jobs.filter((job) => listingStatus(job) === 'pending').length

  return (
    <section className="dashboard-page">
      <p className="eyebrow">Job lister</p>
      <div className="dashboard-section-head">
        <h1 className="section-title">List a job</h1>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          New listing
        </button>
      </div>
      <p className="section-lead">
        Submit a role for review. It appears on the public board only after an administrator approves it.
        {loading ? '' : ` ${pendingCount} waiting for approval.`}
      </p>

      {error ? (
        <p className="dashboard-alert" role="alert">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p className="dashboard-notice" role="status">
          {notice}
        </p>
      ) : null}

      {formOpen ? (
        <form className="dashboard-form" id="listing-form" onSubmit={(event) => void saveJob(event)}>
          <h2 className="admin-subhead">{editingId ? 'Update listing' : 'New listing'}</h2>
          <label className="field">
            Title
            <input
              value={draft.title}
              onChange={(event) => updateDraft('title', event.target.value)}
              required
              maxLength={140}
            />
          </label>
          <label className="field">
            Organisation
            <input
              value={draft.organisation}
              onChange={(event) => updateDraft('organisation', event.target.value)}
              required
              maxLength={140}
            />
          </label>
          <label className="field">
            Location
            <input
              value={draft.location}
              onChange={(event) => updateDraft('location', event.target.value)}
              required
              maxLength={120}
              placeholder="Lagos, Nigeria"
            />
          </label>
          <label className="field">
            Workplace
            <select
              value={draft.workplace}
              onChange={(event) => updateDraft('workplace', event.target.value as JobDraft['workplace'])}
            >
              {WORKPLACE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Employment type
            <select
              value={draft.employmentType}
              onChange={(event) =>
                updateDraft('employmentType', event.target.value as JobDraft['employmentType'])
              }
            >
              {EMPLOYMENT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Application email
            <input
              type="email"
              value={draft.applyEmail}
              onChange={(event) => updateDraft('applyEmail', event.target.value)}
              maxLength={160}
              placeholder="careers@organisation.com"
            />
          </label>
          <label className="field full">
            Application link
            <input
              type="url"
              value={draft.applyUrl}
              onChange={(event) => updateDraft('applyUrl', event.target.value)}
              maxLength={500}
              placeholder="https://"
            />
          </label>
          <label className="field full">
            Summary
            <textarea
              value={draft.summary}
              onChange={(event) => updateDraft('summary', event.target.value)}
              required
              maxLength={400}
              rows={3}
              placeholder="Short line shown on the job card"
            />
          </label>
          <label className="field full">
            Description
            <textarea
              value={draft.description}
              onChange={(event) => updateDraft('description', event.target.value)}
              required
              maxLength={8000}
              rows={8}
              placeholder="Responsibilities, requirements, and how to apply"
            />
          </label>
          <div className="job-form-actions">
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Sending…' : editingId ? 'Resubmit for approval' : 'Submit for approval'}
            </button>
            <button className="btn btn-outline" type="button" onClick={closeForm} disabled={saving}>
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      {loading ? <p className="section-lead">Loading your listings…</p> : null}

      {!loading && jobs.length === 0 ? (
        <div className="dashboard-empty">
          <h3>No listings yet</h3>
          <p>Submit a role and it will wait here until an administrator posts it.</p>
        </div>
      ) : null}

      {!loading && jobs.length > 0 ? (
        <div className="admin-table-wrap">
          <table className="admin-table admin-table-wide">
            <thead>
              <tr>
                <th>Role</th>
                <th>Location</th>
                <th>Type</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => {
                const status = listingStatus(job)
                return (
                  <tr key={job.id}>
                    <td>
                      <strong>{job.title}</strong>
                      <span className="admin-muted">{job.organisation}</span>
                    </td>
                    <td>
                      {job.location}
                      <span className="admin-muted">{workplaceLabel(job.workplace)}</span>
                    </td>
                    <td>{employmentLabel(job.employmentType)}</td>
                    <td>
                      <span className={listingStatusClass(status)}>{listingStatusLabel(status)}</span>
                      {status === 'published' ? (
                        <span className="admin-muted">Since {formatDate(job.publishedAt)}</span>
                      ) : null}
                    </td>
                    <td>{formatDate(job.updatedAt)}</td>
                    <td>
                      {status === 'published' ? (
                        <span className="admin-muted">Posted. Ask an admin to take it down before editing.</span>
                      ) : (
                        <button type="button" className="admin-text-btn" onClick={() => openEdit(job)}>
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  )
}
