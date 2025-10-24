import mongoose from 'mongoose';
import { User, type IUser, type InsertUser } from './models';

if (!process.env.MONGODB_URI) {
  console.warn('MONGODB_URI not set, using in-memory storage');
}

let isConnected = false;
let connectionAttempted = false;

export async function connectDB() {
  if (isConnected || connectionAttempted) {
    return;
  }

  connectionAttempted = true;

  if (!process.env.MONGODB_URI) {
    console.log('Using in-memory storage (no MONGODB_URI configured)');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.warn('MongoDB connection failed, using in-memory storage:', error instanceof Error ? error.message : 'Unknown error');
    console.warn('To fix: Whitelist Replit IP in MongoDB Atlas Network Access');
  }
}

interface IStorageInterface {
  getUser(id: string): Promise<IUser | null>;
  getUserByUsername(username: string): Promise<IUser | null>;
  createUser(user: InsertUser): Promise<IUser>;
}

class InMemoryStorage implements IStorageInterface {
  private users: Map<string, any> = new Map();
  private idCounter = 1;

  async getUser(id: string): Promise<IUser | null> {
    return this.users.get(id) || null;
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return null;
  }

  async createUser(insertUser: InsertUser): Promise<IUser> {
    const id = String(this.idCounter++);
    const user = {
      _id: id,
      ...insertUser,
      createdAt: new Date(),
    } as IUser;
    this.users.set(id, user);
    return user;
  }
}

class DatabaseStorage implements IStorageInterface {
  async getUser(id: string): Promise<IUser | null> {
    if (!isConnected) return null;
    return User.findById(id).exec();
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    if (!isConnected) return null;
    return User.findOne({ username }).exec();
  }

  async createUser(insertUser: InsertUser): Promise<IUser> {
    if (!isConnected) throw new Error('Database not connected');
    const user = new User(insertUser);
    return user.save();
  }
}

let storageInstance: IStorageInterface | null = null;

export function getStorage(): IStorageInterface {
  if (!storageInstance) {
    storageInstance = isConnected ? new DatabaseStorage() : new InMemoryStorage();
  }
  return storageInstance;
}

export const storage = new Proxy({} as IStorageInterface, {
  get(_target, prop) {
    return (getStorage() as any)[prop];
  }
});
