import type { UserRole } from './auth'

export interface AdminStats {
  users: number
  learners: number
  jobListers: number
  admins: number
  enrollments: number
  inProgress: number
  completed: number
  enquiries: number
}

export interface AdminAccount {
  id: string
  fullName: string
  email: string
  role: UserRole
  roleLocked: boolean
  createdAt?: string
  enrollmentCount: number
  completedCount: number
}

export interface AdminCourseStat {
  slug: string
  title: string
  track: string
  duration: string
  enrolled: number
  inProgress: number
  completed: number
}

export interface AdminEnrollment {
  id: string
  learnerName: string
  learnerEmail: string
  courseTitle: string
  courseSlug: string
  progress: number
  status: 'enrolled' | 'in-progress' | 'completed'
  enrolledAt?: string
}

export interface AdminProgrammeStat {
  programme: string
  count: number
}

export interface AdminEnquiry {
  id: string
  fullName: string
  email: string
  currentRole: string
  programmeInterest: string
  growthGoal: string
  createdAt?: string
}

export interface AdminOverview {
  stats: AdminStats
  users: AdminAccount[]
  courses: AdminCourseStat[]
  enrollments: AdminEnrollment[]
  programmes: AdminProgrammeStat[]
  enquiries: AdminEnquiry[]
}
