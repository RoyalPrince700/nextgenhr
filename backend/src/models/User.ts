import { Schema, model, type Document, type Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
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
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true },
);

export const User = model<IUser>('User', userSchema);
