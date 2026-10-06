import { Schema, model, type Document, type Types } from 'mongoose';

export type UserRole = 'learner' | 'job-lister' | 'admin';

export interface IUser extends Document {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 160,
    },
    password: { type: String, required: true, minlength: 8 },
    role: {
      type: String,
      required: true,
      enum: ['learner', 'job-lister', 'admin'],
      default: 'learner',
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true },
);

userSchema.pre('validate', function ensureRole() {
  if (this.role !== 'admin' && this.role !== 'learner' && this.role !== 'job-lister') {
    this.role = 'learner';
  }
});

export const User = model<IUser>('User', userSchema);
