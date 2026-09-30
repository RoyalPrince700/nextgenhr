import { Schema, model, type Document, type Types } from 'mongoose';

export type EnrollmentStatus = 'enrolled' | 'in-progress' | 'completed';

export interface IEnrollment extends Document {
  user: Types.ObjectId;
  courseSlug: string;
  progress: number;
  status: EnrollmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    courseSlug: { type: String, required: true, trim: true },
    progress: { type: Number, required: true, default: 0, min: 0, max: 100 },
    status: {
      type: String,
      required: true,
      enum: ['enrolled', 'in-progress', 'completed'],
      default: 'enrolled',
    },
  },
  { timestamps: true },
);

enrollmentSchema.index({ user: 1, courseSlug: 1 }, { unique: true });

export const Enrollment = model<IEnrollment>('Enrollment', enrollmentSchema);
