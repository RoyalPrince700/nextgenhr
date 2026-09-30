export type CourseStatus = 'enrolled' | 'in-progress' | 'completed'

export interface Course {
  slug: string
  title: string
  track: string
  summary: string
  duration: string
  lessons: string[]
  enrolled: boolean
  progress: number
  status: CourseStatus | null
  enrolledAt: string | null
}

export interface CourseLists {
  enrolled: Course[]
  available: Course[]
  message?: string
}
