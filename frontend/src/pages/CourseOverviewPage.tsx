import { Link, useParams } from 'react-router-dom'
import { findDemoCourse, formatCoursePrice } from '../data/demoCourses'

export function CourseOverviewPage() {
  const { slug } = useParams()
  const course = findDemoCourse(slug)

  if (!course) {
    return (
      <section className="section">
        <div className="container">
          <p className="eyebrow">Courses</p>
          <h1 className="section-title">Course not found.</h1>
          <p className="section-lead">That course is not in the current catalogue.</p>
          <Link className="btn btn-primary" to="/courses">
            Back to courses
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="section programs">
      <div className="container course-overview">
        <div>
          <p className="eyebrow">{course.track}</p>
          <h1 className="section-title">{course.title}</h1>
          <p className="section-lead">{course.summary}</p>
          {course.overview.map((paragraph) => (
            <p className="course-overview-copy" key={paragraph}>
              {paragraph}
            </p>
          ))}
          <h2>Who it is for</h2>
          <p className="course-overview-copy">{course.audience}</p>
          <h2>What you will be able to do</h2>
          <ul className="course-outcome-list">
            {course.outcomes.map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>
          <h2>Modules</h2>
          <ol className="course-module-list">
            {course.lessons.map((lesson, index) => (
              <li key={lesson}>
                <span>0{index + 1}</span>
                {lesson}
              </li>
            ))}
          </ol>
        </div>
        <aside className="course-buy-panel">
          <p className="eyebrow">Enrolment</p>
          <p className="course-buy-price">{formatCoursePrice(course.price)}</p>
          <ul>
            <li>{course.duration}</li>
            <li>{course.lessons.length} modules</li>
            <li>{course.format}</li>
          </ul>
          <Link className="btn" to={`/courses/${course.slug}/buy`}>
            Buy this course
          </Link>
          <Link className="course-back" to="/courses">
            All courses
          </Link>
        </aside>
      </div>
    </section>
  )
}
