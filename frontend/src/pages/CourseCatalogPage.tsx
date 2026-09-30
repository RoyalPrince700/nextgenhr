import { Link } from 'react-router-dom'
import { demoCourses, formatCoursePrice } from '../data/demoCourses'

export function CourseCatalogPage() {
  return (
    <section className="section programs">
      <div className="container">
        <p className="eyebrow">Courses</p>
        <h1 className="section-title">Programmes you can start now.</h1>
        <p className="section-lead">
          Practical courses drawn from the NextGen learning architecture: AI for HR, emotional
          intelligence, leadership, core HR practice, next-generation soft skills and strategic
          people leadership.
        </p>
        <div className="course-catalog-grid">
          {demoCourses.map((course) => (
            <article className="track" key={course.slug}>
              <div className="track-label">{course.track}</div>
              <h2>{course.title}</h2>
              <p>{course.summary}</p>
              <div className="course-meta">
                <span>{course.duration}</span>
                <span>{course.lessons.length} modules</span>
              </div>
              <p className="catalog-price">{formatCoursePrice(course.price)}</p>
              <div className="catalog-actions">
                <Link className="btn btn-outline" to={`/courses/${course.slug}`}>
                  View overview
                </Link>
                <Link className="btn btn-primary" to={`/courses/${course.slug}/buy`}>
                  Buy this course
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
