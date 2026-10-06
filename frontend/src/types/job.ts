export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'internship'
export type WorkplaceType = 'on-site' | 'hybrid' | 'remote'
export type JobStatus = 'draft' | 'pending' | 'published' | 'taken-down'

export interface Job {
  id: string
  title: string
  organisation: string
  location: string
  workplace: WorkplaceType
  employmentType: EmploymentType
  summary: string
  description: string
  applyEmail: string
  applyUrl: string
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface AdminJob extends Job {
  published: boolean
  status: JobStatus
  submittedByName: string
  submittedByEmail: string
}

export interface JobDraft {
  title: string
  organisation: string
  location: string
  workplace: WorkplaceType
  employmentType: EmploymentType
  summary: string
  description: string
  applyEmail: string
  applyUrl: string
  published: boolean
}

export const EMPLOYMENT_OPTIONS: { value: EmploymentType; label: string }[] = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
]

export const WORKPLACE_OPTIONS: { value: WorkplaceType; label: string }[] = [
  { value: 'on-site', label: 'On-site' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'remote', label: 'Remote' },
]

export function employmentLabel(value: EmploymentType): string {
  return EMPLOYMENT_OPTIONS.find((option) => option.value === value)?.label ?? value
}

export function workplaceLabel(value: WorkplaceType): string {
  return WORKPLACE_OPTIONS.find((option) => option.value === value)?.label ?? value
}

export function listingStatus(job: Pick<AdminJob, 'status' | 'published'>): JobStatus {
  if (job.status === 'pending' || job.status === 'published' || job.status === 'taken-down' || job.status === 'draft') {
    return job.status
  }
  return job.published ? 'published' : 'draft'
}

export function listingStatusLabel(status: JobStatus): string {
  if (status === 'pending') return 'Awaiting approval'
  if (status === 'published') return 'Posted'
  if (status === 'taken-down') return 'Taken down'
  return 'Draft'
}

export function listingStatusClass(status: JobStatus): string {
  if (status === 'published') return 'admin-badge is-completed'
  if (status === 'pending') return 'admin-badge is-pending'
  if (status === 'taken-down') return 'admin-badge is-draft'
  return 'admin-badge is-draft'
}

export const emptyJobDraft = (): JobDraft => ({
  title: '',
  organisation: '',
  location: '',
  workplace: 'hybrid',
  employmentType: 'full-time',
  summary: '',
  description: '',
  applyEmail: '',
  applyUrl: '',
  published: false,
})
