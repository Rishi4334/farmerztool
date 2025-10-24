import mongoose from 'mongoose';
import { User, type IUser, type InsertUser } from './models';

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI must be set');
}

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export interface IStorage {
  getUser(id: string): Promise<IUser | null>;
  getUserByUsername(username: string): Promise<IUser | null>;
  createUser(user: InsertUser): Promise<IUser>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<IUser | null> {
    await connectDB();
    return User.findById(id).exec();
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    await connectDB();
    return User.findOne({ username }).exec();
  }

  async createUser(insertUser: InsertUser): Promise<IUser> {
    await connectDB();
    const user = new User(insertUser);
    return user.save();
  }
}

export const storage = new DatabaseStorage();
