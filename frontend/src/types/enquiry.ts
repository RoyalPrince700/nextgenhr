export const PROGRAMME_OPTIONS = [
  'Young HR Professionals',
  'New Managers Accelerator',
  'HR Leaders Strategic Leadership',
  'Corporate HR Capability & Transformation Solutions',
  'Clarity of Purpose & Exponential Growth Coaching',
  'Corporate / Custom Programme',
] as const

export type ProgrammeInterest = (typeof PROGRAMME_OPTIONS)[number]

export interface EnquiryPayload {
  fullName: string
  email: string
  currentRole: string
  programmeInterest: ProgrammeInterest
  growthGoal: string
}
