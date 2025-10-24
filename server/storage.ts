import mongoose from 'mongoose';
import {
  User, Crop, DiseaseDetection, Listing, MarketPrice, WeatherAlert,
  type IUser, type ICrop, type IDiseaseDetection, type IListing,
  type IMarketPrice, type IWeatherAlert,
  type InsertUser, type InsertCrop, type InsertDiseaseDetection,
  type InsertListing, type InsertMarketPrice, type InsertWeatherAlert
} from './models';

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
  // Users
  getUser(id: string): Promise<IUser | null>;
  getUserByUsername(username: string): Promise<IUser | null>;
  createUser(user: InsertUser): Promise<IUser>;
  
  // Crops
  getAllCrops(): Promise<ICrop[]>;
  getCrop(id: string): Promise<ICrop | null>;
  createCrop(crop: InsertCrop): Promise<ICrop>;
  
  // Disease Detections
  createDiseaseDetection(detection: InsertDiseaseDetection): Promise<IDiseaseDetection>;
  getUserDiseaseDetections(userId: string): Promise<IDiseaseDetection[]>;
  
  // Listings
  getAllListings(): Promise<IListing[]>;
  getUserListings(userId: string): Promise<IListing[]>;
  createListing(listing: InsertListing): Promise<IListing>;
  updateListing(id: string, update: Partial<IListing>): Promise<IListing | null>;
  
  // Market Prices
  getMarketPrices(): Promise<IMarketPrice[]>;
  getMarketPricesByCrop(cropId: string): Promise<IMarketPrice[]>;
  createMarketPrice(price: InsertMarketPrice): Promise<IMarketPrice>;
  
  // Weather Alerts
  getActiveWeatherAlerts(location: string): Promise<IWeatherAlert[]>;
  createWeatherAlert(alert: InsertWeatherAlert): Promise<IWeatherAlert>;
}

class InMemoryStorage implements IStorageInterface {
  private users: Map<string, any> = new Map();
  private crops: Map<string, any> = new Map();
  private detections: Map<string, any> = new Map();
  private listings: Map<string, any> = new Map();
  private marketPrices: Map<string, any> = new Map();
  private weatherAlerts: Map<string, any> = new Map();
  private idCounter = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    const sampleCrops = [
      { _id: '1', name: 'Rice', nameHindi: 'चावल', nameTelugu: 'బియ్యం', category: 'Grain', currentPrice: 2400, unit: 'quintal' },
      { _id: '2', name: 'Wheat', nameHindi: 'गेहूं', nameTelugu: 'గోధుమలు', category: 'Grain', currentPrice: 2100, unit: 'quintal' },
      { _id: '3', name: 'Cotton', nameHindi: 'कपास', nameTelugu: 'పత్తి', category: 'Cash Crop', currentPrice: 5800, unit: 'quintal' },
      { _id: '4', name: 'Tomato', nameHindi: 'टमाटर', nameTelugu: 'టమాటా', category: 'Vegetable', currentPrice: 1200, unit: 'quintal' },
    ];

    sampleCrops.forEach(crop => this.crops.set(crop._id, crop));

    const sampleMarketPrices = [
      { _id: '1', cropId: '1', price: 2400, priceChange: 12, market: 'Guntur Mandi', date: new Date() },
      { _id: '2', cropId: '2', price: 2100, priceChange: 5, market: 'Delhi Mandi', date: new Date() },
      { _id: '3', cropId: '3', price: 5800, priceChange: -3, market: 'Ahmedabad Mandi', date: new Date() },
      { _id: '4', cropId: '4', price: 1200, priceChange: 8, market: 'Pune Mandi', date: new Date() },
    ];

    sampleMarketPrices.forEach(price => this.marketPrices.set(price._id, price));

    this.idCounter = 10;
  }

  async getUser(id: string): Promise<IUser | null> {
    return this.users.get(id) || null;
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    const users = Array.from(this.users.values());
    for (const user of users) {
      if (user.username === username) return user;
    }
    return null;
  }

  async createUser(insertUser: InsertUser): Promise<IUser> {
    const id = String(this.idCounter++);
    const user = { _id: id, ...insertUser, createdAt: new Date() } as IUser;
    this.users.set(id, user);
    return user;
  }

  async getAllCrops(): Promise<ICrop[]> {
    return Array.from(this.crops.values());
  }

  async getCrop(id: string): Promise<ICrop | null> {
    return this.crops.get(id) || null;
  }

  async createCrop(crop: InsertCrop): Promise<ICrop> {
    const id = String(this.idCounter++);
    const newCrop = { _id: id, ...crop } as ICrop;
    this.crops.set(id, newCrop);
    return newCrop;
  }

  async createDiseaseDetection(detection: InsertDiseaseDetection): Promise<IDiseaseDetection> {
    const id = String(this.idCounter++);
    const newDetection = { _id: id, ...detection, detectedAt: new Date() } as IDiseaseDetection;
    this.detections.set(id, newDetection);
    return newDetection;
  }

  async getUserDiseaseDetections(userId: string): Promise<IDiseaseDetection[]> {
    return Array.from(this.detections.values()).filter(d => d.userId === userId);
  }

  async getAllListings(): Promise<IListing[]> {
    return Array.from(this.listings.values()).filter(l => l.isActive);
  }

  async getUserListings(userId: string): Promise<IListing[]> {
    return Array.from(this.listings.values()).filter(l => l.userId === userId);
  }

  async createListing(listing: InsertListing): Promise<IListing> {
    const id = String(this.idCounter++);
    const newListing = { _id: id, ...listing, isActive: true, createdAt: new Date() } as IListing;
    this.listings.set(id, newListing);
    return newListing;
  }

  async updateListing(id: string, update: Partial<IListing>): Promise<IListing | null> {
    const listing = this.listings.get(id);
    if (!listing) return null;
    const updated = { ...listing, ...update };
    this.listings.set(id, updated);
    return updated;
  }

  async getMarketPrices(): Promise<IMarketPrice[]> {
    return Array.from(this.marketPrices.values());
  }

  async getMarketPricesByCrop(cropId: string): Promise<IMarketPrice[]> {
    return Array.from(this.marketPrices.values()).filter(p => p.cropId === cropId);
  }

  async createMarketPrice(price: InsertMarketPrice): Promise<IMarketPrice> {
    const id = String(this.idCounter++);
    const newPrice = { _id: id, ...price, date: new Date() } as IMarketPrice;
    this.marketPrices.set(id, newPrice);
    return newPrice;
  }

  async getActiveWeatherAlerts(location: string): Promise<IWeatherAlert[]> {
    const now = new Date();
    return Array.from(this.weatherAlerts.values()).filter(a => 
      a.location === location && (!a.validUntil || a.validUntil > now)
    );
  }

  async createWeatherAlert(alert: InsertWeatherAlert): Promise<IWeatherAlert> {
    const id = String(this.idCounter++);
    const newAlert = { _id: id, ...alert, createdAt: new Date() } as IWeatherAlert;
    this.weatherAlerts.set(id, newAlert);
    return newAlert;
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

  async getAllCrops(): Promise<ICrop[]> {
    if (!isConnected) return [];
    return Crop.find().exec();
  }

  async getCrop(id: string): Promise<ICrop | null> {
    if (!isConnected) return null;
    return Crop.findById(id).exec();
  }

  async createCrop(crop: InsertCrop): Promise<ICrop> {
    if (!isConnected) throw new Error('Database not connected');
    const newCrop = new Crop(crop);
    return newCrop.save();
  }

  async createDiseaseDetection(detection: InsertDiseaseDetection): Promise<IDiseaseDetection> {
    if (!isConnected) throw new Error('Database not connected');
    const newDetection = new DiseaseDetection(detection);
    return newDetection.save();
  }

  async getUserDiseaseDetections(userId: string): Promise<IDiseaseDetection[]> {
    if (!isConnected) return [];
    return DiseaseDetection.find({ userId }).sort({ detectedAt: -1 }).exec();
  }

  async getAllListings(): Promise<IListing[]> {
    if (!isConnected) return [];
    return Listing.find({ isActive: true }).sort({ createdAt: -1 }).exec();
  }

  async getUserListings(userId: string): Promise<IListing[]> {
    if (!isConnected) return [];
    return Listing.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async createListing(listing: InsertListing): Promise<IListing> {
    if (!isConnected) throw new Error('Database not connected');
    const newListing = new Listing(listing);
    return newListing.save();
  }

  async updateListing(id: string, update: Partial<IListing>): Promise<IListing | null> {
    if (!isConnected) return null;
    return Listing.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  async getMarketPrices(): Promise<IMarketPrice[]> {
    if (!isConnected) return [];
    return MarketPrice.find().sort({ date: -1 }).limit(50).exec();
  }

  async getMarketPricesByCrop(cropId: string): Promise<IMarketPrice[]> {
    if (!isConnected) return [];
    return MarketPrice.find({ cropId }).sort({ date: -1 }).limit(30).exec();
  }

  async createMarketPrice(price: InsertMarketPrice): Promise<IMarketPrice> {
    if (!isConnected) throw new Error('Database not connected');
    const newPrice = new MarketPrice(price);
    return newPrice.save();
  }

  async getActiveWeatherAlerts(location: string): Promise<IWeatherAlert[]> {
    if (!isConnected) return [];
    const now = new Date();
    return WeatherAlert.find({
      location,
      $or: [
        { validUntil: { $gte: now } },
        { validUntil: null }
      ]
    }).sort({ createdAt: -1 }).exec();
  }

  async createWeatherAlert(alert: InsertWeatherAlert): Promise<IWeatherAlert> {
    if (!isConnected) throw new Error('Database not connected');
    const newAlert = new WeatherAlert(alert);
    return newAlert.save();
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
