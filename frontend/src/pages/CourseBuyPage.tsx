import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { coursesApi } from '../api/courses'
import { findDemoCourse, formatCoursePrice } from '../data/demoCourses'
import { useAuth } from '../context/AuthContext'

export function CourseBuyPage() {
  const { slug } = useParams()
  const course = findDemoCourse(slug)
  const { user, token, loading } = useAuth()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'idle' | 'buying' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  if (!course) {
    return (
      <section className="section">
        <div className="container">
          <p className="eyebrow">Courses</p>
          <h1 className="section-title">Course not found.</h1>
          <Link className="btn btn-primary" to="/courses">
            Back to courses
          </Link>
        </div>
      </section>
    )
  }

  const buyPath = `/courses/${course.slug}/buy`

  async function handleBuy() {
    if (!user || !token) {
      navigate('/login', { state: { from: buyPath } })
      return
    }

    setStatus('buying')
    setMessage('')

    try {
      await coursesApi.enroll(token, course.slug)
      setStatus('done')
      setMessage(`You now have access to ${course.title}.`)
    } catch (error) {
      const text = error instanceof Error ? error.message : 'Unable to complete this purchase.'
      if (text.toLowerCase().includes('already enrolled')) {
        setStatus('done')
        setMessage(`You already have access to ${course.title}.`)
        return
      }
      setStatus('error')
      setMessage(text)
    }
  }

  return (
    <section className="section programs">
      <div className="container course-buy-layout">
        <div>
          <p className="eyebrow">Buy this course</p>
          <h1 className="section-title">{course.title}</h1>
          <p className="section-lead">{course.summary}</p>
          <p className="course-overview-copy">
            {course.duration} · {course.lessons.length} modules · {course.format}
          </p>
          <Link className="course-back" to={`/courses/${course.slug}`}>
            Read the overview
          </Link>
        </div>
        <aside className="course-buy-panel">
          <p className="eyebrow">Total</p>
          <p className="course-buy-price">{formatCoursePrice(course.price)}</p>
          {status === 'done' ? (
            <>
              <p className="course-buy-note">{message}</p>
              <Link className="btn" to="/dashboard/courses">
                Go to my courses
              </Link>
            </>
          ) : (
            <>
              <p className="course-buy-note">
                {user
                  ? `Buying as ${user.fullName}. Access is added to your dashboard.`
                  : 'Sign in to buy this course and add it to your dashboard.'}
              </p>
              {message ? (
                <p className="course-buy-error" role="alert">
                  {message}
                </p>
              ) : null}
              {user ? (
                <button type="button" className="btn" disabled={loading || status === 'buying'} onClick={() => void handleBuy()}>
                  {status === 'buying' ? 'Processing…' : 'Buy this course'}
                </button>
              ) : (
                <>
                  <Link className="btn" to="/login" state={{ from: buyPath }}>
                    Sign in to buy
                  </Link>
                  <Link className="course-back" to="/signup" state={{ from: buyPath }}>
                    Create an account
                  </Link>
                </>
              )}
            </>
          )}
        </aside>
      </div>
    </section>
  )
}
