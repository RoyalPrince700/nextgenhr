import { Link } from 'react-router-dom'
import { CourseCard } from '../components/CourseCard'
import { PublishedJobList } from '../components/PublishedJobList'
import { useAuth } from '../context/AuthContext'
import { useCourses } from '../hooks/useCourses'

function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || fullName
}

function formatMemberSince(value?: string): string {
  if (!value) return 'Recently joined'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Recently joined'
  return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}

export function DashboardPage() {
  const { user } = useAuth()
  const { data, loading, error } = useCourses()
  const enrolled = data?.enrolled ?? []
  const inProgress = enrolled.filter(
    (course) => course.progress > 0 && course.progress < 100 && course.status !== 'completed',
  ).length
  const completed = enrolled.filter(
    (course) => course.status === 'completed' || course.progress >= 100,
  ).length

  return (
    <section className="dashboard-page">
      <p className="eyebrow">Your learning</p>
      <h1 className="section-title">Welcome back, {user ? firstName(user.fullName) : 'there'}.</h1>
      <p className="section-lead">
        Continue the programmes you are enrolled in, and pick up the next lesson when you are ready.
      </p>

      <div className="dashboard-stats">
        <article>
          <strong>{loading ? '—' : enrolled.length}</strong>
          <span>Enrolled courses</span>
        </article>
        <article>
          <strong>{loading ? '—' : inProgress}</strong>
          <span>In progress</span>
        </article>
        <article>
          <strong>{loading ? '—' : completed}</strong>
          <span>Completed</span>
        </article>
        <article>
          <strong>{formatMemberSince(user?.createdAt)}</strong>
          <span>Member since</span>
        </article>
      </div>

      {error ? (
        <p className="dashboard-alert" role="alert">
          {error}
        </p>
      ) : null}

      <div className="dashboard-section-head">
        <h2>Your courses</h2>
        <Link to="/dashboard/courses">Browse catalogue</Link>
      </div>

      {loading ? <p className="section-lead">Loading your courses…</p> : null}

      {!loading && enrolled.length === 0 ? (
        <div className="dashboard-empty">
          <h3>No courses yet</h3>
          <p>Enrol in a programme and it will appear here with its lessons and progress.</p>
          <Link className="btn btn-primary" to="/dashboard/courses">
            View courses
          </Link>
        </div>
      ) : null}

      {enrolled.length > 0 ? (
        <div className="course-grid">
          {enrolled.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      ) : null}

      <div className="dashboard-section-head">
        <h2>Published jobs</h2>
        <Link to="/dashboard/listings">Open job listings</Link>
      </div>
      <PublishedJobList />
    </section>
  )
}
