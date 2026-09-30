import { CourseCard } from '../components/CourseCard'
import { useCourses } from '../hooks/useCourses'

export function CoursesPage() {
  const { data, loading, error, enrollingSlug, enroll } = useCourses()
  const enrolled = data?.enrolled ?? []
  const available = data?.available ?? []

  return (
    <section className="dashboard-page">
      <p className="eyebrow">Catalogue</p>
      <h1 className="section-title">My courses</h1>
      <p className="section-lead">
        Courses you enrol in stay on your account. Open a card to see the lessons included.
      </p>

      {error ? (
        <p className="dashboard-alert" role="alert">
          {error}
        </p>
      ) : null}

      {loading ? <p className="section-lead">Loading courses…</p> : null}

      {!loading ? (
        <>
          <div className="dashboard-section-head">
            <h2>Enrolled</h2>
          </div>
          {enrolled.length === 0 ? (
            <div className="dashboard-empty">
              <h3>You have not enrolled yet</h3>
              <p>Choose a programme below. It will show on your dashboard as soon as you enrol.</p>
            </div>
          ) : (
            <div className="course-grid">
              {enrolled.map((course) => (
                <CourseCard key={course.slug} course={course} />
              ))}
            </div>
          )}

          <div className="dashboard-section-head">
            <h2>Available to enrol</h2>
          </div>
          {available.length === 0 ? (
            <p className="section-lead">You are enrolled in every current programme.</p>
          ) : (
            <div className="course-grid">
              {available.map((course) => (
                <CourseCard
                  key={course.slug}
                  course={course}
                  enrolling={enrollingSlug === course.slug}
                  onEnroll={(slug) => void enroll(slug)}
                />
              ))}
            </div>
          )}
        </>
      ) : null}
    </section>
  )
}
