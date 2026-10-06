import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../api/admin'
import { jobsApi } from '../api/jobs'
import { useAuth } from '../context/AuthContext'
import type { AdminEnrollment, AdminOverview } from '../types/admin'
import type { UserRole } from '../types/auth'
import type { AdminJob } from '../types/job'
import { listingStatus } from '../types/job'

function formatDate(value?: string): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

function statusLabel(status: AdminEnrollment['status']): string {
  if (status === 'in-progress') return 'In progress'
  if (status === 'completed') return 'Completed'
  return 'Enrolled'
}

function statusClass(status: AdminEnrollment['status']): string {
  if (status === 'completed') return 'admin-badge is-completed'
  if (status === 'in-progress') return 'admin-badge is-progress'
  return 'admin-badge'
}

export function AdminPage() {
  const { token, user, refreshUser } = useAuth()
  const [overview, setOverview] = useState<AdminOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [query, setQuery] = useState('')
  const [savingId, setSavingId] = useState<string | null>(null)
  const [jobs, setJobs] = useState<AdminJob[]>([])
  const [jobBusyId, setJobBusyId] = useState<string | null>(null)

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
        const [data, jobData] = await Promise.all([
          adminApi.overview(authToken),
          jobsApi.adminList(authToken),
        ])
        if (active) {
          setOverview(data)
          setJobs(jobData.jobs)
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load the admin overview.')
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()
    return () => {
      active = false
    }
  }, [token])

  const accounts = useMemo(() => {
    const people = overview?.users ?? []
    const needle = query.trim().toLowerCase()
    if (!needle) return people
    return people.filter(
      (person) =>
        person.fullName.toLowerCase().includes(needle) || person.email.toLowerCase().includes(needle),
    )
  }, [overview, query])

  async function changeRole(userId: string, role: UserRole) {
    if (!token) return
    const current = overview?.users.find((person) => person.id === userId)
    if (!current || current.role === role) return

    setSavingId(userId)
    setNotice('')
    setError('')

    try {
      const result = await adminApi.updateRole(token, userId, role)
      if (user?.id === userId) {
        await refreshUser()
      }
      const [data, jobData] = await Promise.all([adminApi.overview(token), jobsApi.adminList(token)])
      setOverview(data)
      setJobs(jobData.jobs)
      setNotice(result.message)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update that role.')
    } finally {
      setSavingId(null)
    }
  }

  async function approveJob(job: AdminJob) {
    if (!token) return
    setJobBusyId(job.id)
    setNotice('')
    setError('')

    try {
      const result = await jobsApi.setPublished(token, job.id, true)
      setJobs((current) => current.map((item) => (item.id === job.id ? result.job : item)))
      setNotice(result.message)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to approve that listing.')
    } finally {
      setJobBusyId(null)
    }
  }

  const stats = overview?.stats
  const pendingJobs = jobs.filter((job) => listingStatus(job) === 'pending')

  return (
    <section className="dashboard-page">
      <p className="eyebrow">Administration</p>
      <h1 className="section-title">Institute overview</h1>
      <p className="section-lead">
        Track who has an account, how learning is progressing, and which programmes people are asking
        about. Assign the job lister role when someone should submit roles for your approval.
      </p>

      <nav className="admin-jump" aria-label="Admin sections">
        <a href="#admin-approvals">Job approvals</a>
        <a href="#admin-accounts">Accounts</a>
        <a href="#admin-learning">Learning</a>
        <a href="#admin-enquiries">Enquiries</a>
        <Link to="/dashboard/jobs">Job listings</Link>
      </nav>

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

      <div className="admin-stats">
        <article>
          <strong>{loading ? '—' : stats?.users ?? 0}</strong>
          <span>Accounts</span>
        </article>
        <article>
          <strong>{loading ? '—' : stats?.admins ?? 0}</strong>
          <span>Administrators</span>
        </article>
        <article>
          <strong>{loading ? '—' : stats?.enrollments ?? 0}</strong>
          <span>Enrolments</span>
        </article>
        <article>
          <strong>{loading ? '—' : stats?.inProgress ?? 0}</strong>
          <span>In progress</span>
        </article>
        <article>
          <strong>{loading ? '—' : stats?.completed ?? 0}</strong>
          <span>Completed</span>
        </article>
        <article>
          <strong>{loading ? '—' : stats?.enquiries ?? 0}</strong>
          <span>Enquiries</span>
        </article>
      </div>

      <div className="dashboard-section-head" id="admin-approvals">
        <h2>Jobs awaiting approval</h2>
        <Link to="/dashboard/jobs">All job listings</Link>
      </div>
      <p className="admin-note">
        Listings from job listers stay off the public board until you approve them. Posted roles can be taken
        down from job listings.
      </p>
      {loading ? <p className="section-lead">Loading listings…</p> : null}
      {!loading && pendingJobs.length === 0 ? (
        <div className="dashboard-empty">
          <h3>Nothing waiting</h3>
          <p>New submissions from job listers will show here for approval.</p>
        </div>
      ) : null}
      {!loading && pendingJobs.length > 0 ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Role</th>
                <th>Organisation</th>
                <th>Submitted by</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingJobs.map((job) => (
                <tr key={job.id}>
                  <td>
                    <strong>{job.title}</strong>
                    <span className="admin-muted">{job.location}</span>
                  </td>
                  <td>{job.organisation}</td>
                  <td>
                    {job.submittedByName || '—'}
                    {job.submittedByEmail ? <span className="admin-muted">{job.submittedByEmail}</span> : null}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="admin-text-btn"
                      disabled={jobBusyId === job.id}
                      onClick={() => void approveJob(job)}
                    >
                      {jobBusyId === job.id ? 'Approving…' : 'Approve'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <div className="dashboard-section-head" id="admin-accounts">
        <h2>Accounts</h2>
      </div>
      <p className="admin-note">
        Learners use the dashboard and courses. Job listers submit roles for approval. Administrators can open
        this page and change roles.
        {stats
          ? ` ${stats.learners} learner${stats.learners === 1 ? '' : 's'} and ${stats.jobListers ?? 0} job lister${(stats.jobListers ?? 0) === 1 ? '' : 's'} right now.`
          : ''}
      </p>
      <input
        className="admin-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by name or email"
        aria-label="Search accounts"
      />

      {loading ? <p className="section-lead">Loading accounts…</p> : null}

      {!loading && accounts.length === 0 ? (
        <div className="dashboard-empty">
          <h3>{query ? 'No matching accounts' : 'No accounts yet'}</h3>
          <p>
            {query
              ? 'Try a different name or email.'
              : 'People appear here after they create an account.'}
          </p>
        </div>
      ) : null}

      {!loading && accounts.length > 0 ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Joined</th>
                <th>Courses</th>
                <th>Completed</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((person) => (
                <tr key={person.id}>
                  <td>
                    <strong>{person.fullName}</strong>
                    <span className="admin-muted">{person.email}</span>
                    {person.id === user?.id ? <span className="admin-muted">This is you</span> : null}
                  </td>
                  <td>{formatDate(person.createdAt)}</td>
                  <td>{person.enrollmentCount}</td>
                  <td>{person.completedCount}</td>
                  <td>
                    <select
                      className="admin-role-select"
                      aria-label={`Role for ${person.fullName}`}
                      value={person.role}
                      disabled={Boolean(savingId) || person.roleLocked}
                      title={
                        person.roleLocked
                          ? 'This administrator is set in server configuration'
                          : undefined
                      }
                      onChange={(event) => void changeRole(person.id, event.target.value as UserRole)}
                    >
                      <option value="learner">Learner</option>
                      <option value="job-lister">Job lister</option>
                      <option value="admin">Admin</option>
                    </select>
                    {person.roleLocked ? <span className="admin-muted">Configured admin</span> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <div className="dashboard-section-head" id="admin-learning">
        <h2>Learning</h2>
      </div>
      <p className="admin-note">Enrolment and progress across the course catalogue.</p>

      {!loading && (overview?.courses.length ?? 0) === 0 ? (
        <div className="dashboard-empty">
          <h3>No courses in the catalogue</h3>
          <p>Course uptake will show here once programmes are available.</p>
        </div>
      ) : null}

      {!loading && overview && overview.courses.length > 0 ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Duration</th>
                <th>Enrolled</th>
                <th>In progress</th>
                <th>Completed</th>
              </tr>
            </thead>
            <tbody>
              {overview.courses.map((course) => (
                <tr key={course.slug}>
                  <td>
                    <strong>{course.title}</strong>
                    <span className="admin-muted">{course.track}</span>
                  </td>
                  <td>{course.duration}</td>
                  <td>{course.enrolled}</td>
                  <td>{course.inProgress}</td>
                  <td>{course.completed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <h3 className="admin-subhead">Recent enrolments</h3>
      {!loading && (overview?.enrollments.length ?? 0) === 0 ? (
        <div className="dashboard-empty">
          <h3>No enrolments yet</h3>
          <p>When a learner joins a course, it will show here with progress and status.</p>
        </div>
      ) : null}
      {!loading && overview && overview.enrollments.length > 0 ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Learner</th>
                <th>Course</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Enrolled</th>
              </tr>
            </thead>
            <tbody>
              {overview.enrollments.map((enrollment) => (
                <tr key={enrollment.id}>
                  <td>
                    <strong>{enrollment.learnerName}</strong>
                    {enrollment.learnerEmail ? (
                      <span className="admin-muted">{enrollment.learnerEmail}</span>
                    ) : null}
                  </td>
                  <td>{enrollment.courseTitle}</td>
                  <td>{enrollment.progress}%</td>
                  <td>
                    <span className={statusClass(enrollment.status)}>{statusLabel(enrollment.status)}</span>
                  </td>
                  <td>{formatDate(enrollment.enrolledAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <div className="dashboard-section-head" id="admin-enquiries">
        <h2>Enquiries</h2>
      </div>
      <p className="admin-note">
        Admissions interest by programme, including the person’s current role and growth goal.
      </p>

      {!loading && overview ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Programme</th>
                <th>Enquiries</th>
              </tr>
            </thead>
            <tbody>
              {overview.programmes.map((programme) => (
                <tr key={programme.programme}>
                  <td>
                    <strong>{programme.programme}</strong>
                  </td>
                  <td>{programme.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <h3 className="admin-subhead">Latest enquiries</h3>
      {!loading && (overview?.enquiries.length ?? 0) === 0 ? (
        <div className="dashboard-empty">
          <h3>No enquiries yet</h3>
          <p>Applications from the public site will appear here.</p>
        </div>
      ) : null}
      {!loading && overview && overview.enquiries.length > 0 ? (
        <div className="admin-table-wrap">
          <table className="admin-table admin-table-wide">
            <thead>
              <tr>
                <th>Name</th>
                <th>Current role</th>
                <th>Programme</th>
                <th>Growth goal</th>
                <th>Received</th>
              </tr>
            </thead>
            <tbody>
              {overview.enquiries.map((enquiry) => (
                <tr key={enquiry.id}>
                  <td>
                    <strong>{enquiry.fullName}</strong>
                    <span className="admin-muted">{enquiry.email}</span>
                  </td>
                  <td>{enquiry.currentRole}</td>
                  <td>{enquiry.programmeInterest}</td>
                  <td>
                    <span className="admin-goal" title={enquiry.growthGoal}>
                      {enquiry.growthGoal}
                    </span>
                  </td>
                  <td>{formatDate(enquiry.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  )
}
