import type { Course } from '../types/course'

function statusLabel(course: Course): string {
  if (course.status === 'completed' || course.progress >= 100) return 'Completed'
  if (course.status === 'in-progress' || course.progress > 0) return `${course.progress}% complete`
  return 'Not started'
}

export function CourseCard({
  course,
  enrolling,
  onEnroll,
}: {
  course: Course
  enrolling?: boolean
  onEnroll?: (slug: string) => void
}) {
  return (
    <article className="course-card">
      <p className="course-track">{course.track}</p>
      <h3>{course.title}</h3>
      <p>{course.summary}</p>
      <div className="course-meta">
        <span>{course.duration}</span>
        <span>{course.lessons.length} lessons</span>
      </div>
      {course.enrolled ? (
        <div className="course-progress">
          <div className="course-progress-track" aria-hidden="true">
            <span style={{ width: `${course.progress}%` }} />
          </div>
          <span>{statusLabel(course)}</span>
        </div>
      ) : (
        <button
          type="button"
          className="btn btn-primary"
          disabled={enrolling}
          onClick={() => onEnroll?.(course.slug)}
        >
          {enrolling ? 'Enrolling…' : 'Enrol'}
        </button>
      )}
      {course.enrolled ? (
        <ul className="course-lessons">
          {course.lessons.map((lesson) => (
            <li key={lesson}>{lesson}</li>
          ))}
        </ul>
      ) : null}
    </article>
  )
}
