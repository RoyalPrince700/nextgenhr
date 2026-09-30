import { Schema, model, type Document } from 'mongoose';

export const PROGRAMME_OPTIONS = [
  'Young HR Professionals',
  'New Managers Accelerator',
  'HR Leaders Strategic Leadership',
  'Corporate HR Capability & Transformation Solutions',
  'Clarity of Purpose & Exponential Growth Coaching',
  'Corporate / Custom Programme',
] as const;

export type ProgrammeInterest = (typeof PROGRAMME_OPTIONS)[number];

export interface IEnquiry extends Document {
  fullName: string;
  email: string;
  currentRole: string;
  programmeInterest: ProgrammeInterest;
  growthGoal: string;
  createdAt: Date;
  updatedAt: Date;
}

const enquirySchema = new Schema<IEnquiry>(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
    currentRole: { type: String, required: true, trim: true, maxlength: 160 },
    programmeInterest: {
      type: String,
      required: true,
      enum: PROGRAMME_OPTIONS,
    },
    growthGoal: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  { timestamps: true },
);

export const Enquiry = model<IEnquiry>('Enquiry', enquirySchema);
