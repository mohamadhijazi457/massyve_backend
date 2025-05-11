import mongoose, { Document, Schema } from 'mongoose';
import { hashPassword, comparePassword } from '../helpers/authUtils'; // updated path

interface IUser extends Document {
  userId: number;
  username: string;
  password: string;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  userId: {
    type: Number,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Middleware to hash the password before saving
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await hashPassword(this.password);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = function (password: string) {
  return comparePassword(password, this.password);
};

// Bind the model to the collection
const User = mongoose.model<IUser>('User', userSchema, 'users');

export default User;
