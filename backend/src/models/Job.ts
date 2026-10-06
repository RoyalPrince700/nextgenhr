import { Schema, model, type Document, type Types } from 'mongoose';

export const EMPLOYMENT_TYPES = ['full-time', 'part-time', 'contract', 'internship'] as const;
export const WORKPLACE_TYPES = ['on-site', 'hybrid', 'remote'] as const;

export const JOB_STATUSES = ['draft', 'pending', 'published', 'taken-down'] as const;

export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];
export type WorkplaceType = (typeof WORKPLACE_TYPES)[number];
export type JobStatus = (typeof JOB_STATUSES)[number];

export interface IJob extends Document {
  title: string;
  organisation: string;
  location: string;
  workplace: WorkplaceType;
  employmentType: EmploymentType;
  summary: string;
  description: string;
  applyEmail: string;
  applyUrl: string;
  published: boolean;
  status?: JobStatus;
  publishedAt: Date | null;
  submittedBy?: Types.ObjectId | null;
  submittedByName: string;
  submittedByEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    organisation: { type: String, required: true, trim: true, maxlength: 140 },
    location: { type: String, required: true, trim: true, maxlength: 120 },
    workplace: { type: String, required: true, enum: WORKPLACE_TYPES },
    employmentType: { type: String, required: true, enum: EMPLOYMENT_TYPES },
    summary: { type: String, required: true, trim: true, maxlength: 400 },
    description: { type: String, required: true, trim: true, maxlength: 8000 },
    applyEmail: { type: String, trim: true, lowercase: true, maxlength: 160, default: '' },
    applyUrl: { type: String, trim: true, maxlength: 500, default: '' },
    published: { type: Boolean, default: false },
    status: { type: String, enum: JOB_STATUSES },
    publishedAt: { type: Date, default: null },
    submittedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    submittedByName: { type: String, trim: true, default: '' },
    submittedByEmail: { type: String, trim: true, lowercase: true, default: '' },
  },
  { timestamps: true },
);

jobSchema.index({ published: 1, publishedAt: -1 });
jobSchema.index({ status: 1, updatedAt: -1 });
jobSchema.index({ submittedBy: 1, updatedAt: -1 });

export const Job = model<IJob>('Job', jobSchema);
