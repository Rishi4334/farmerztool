import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  phone?: string;
  location?: string;
  language?: string;
  createdAt: Date;
}

export interface ICrop extends Document {
  name: string;
  nameHindi?: string;
  nameTelugu?: string;
  category: string;
  currentPrice?: number;
  unit?: string;
}

export interface IDiseaseDetection extends Document {
  userId: string;
  cropId?: string;
  imageUrl: string;
  detectedDisease?: string;
  confidence?: number;
  treatment?: string;
  detectedAt: Date;
}

export interface IListing extends Document {
  userId: string;
  cropId?: string;
  quantity: number;
  pricePerUnit: number;
  location: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface IMarketPrice extends Document {
  cropId?: string;
  price: number;
  priceChange?: number;
  market: string;
  date: Date;
}

export interface IWeatherAlert extends Document {
  location: string;
  alertType: string;
  severity: string;
  message: string;
  messageHindi?: string;
  messageTelugu?: string;
  validUntil?: Date;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  phone: { type: String, default: null },
  location: { type: String, default: null },
  language: { type: String, default: 'english' },
  createdAt: { type: Date, default: Date.now },
});

const CropSchema = new Schema<ICrop>({
  name: { type: String, required: true },
  nameHindi: { type: String },
  nameTelugu: { type: String },
  category: { type: String, required: true },
  currentPrice: { type: Number },
  unit: { type: String, default: 'quintal' },
});

const DiseaseDetectionSchema = new Schema<IDiseaseDetection>({
  userId: { type: String, required: true },
  cropId: { type: String },
  imageUrl: { type: String, required: true },
  detectedDisease: { type: String },
  confidence: { type: Number },
  treatment: { type: String },
  detectedAt: { type: Date, default: Date.now },
});

const ListingSchema = new Schema<IListing>({
  userId: { type: String, required: true, index: true },
  cropId: { type: String, default: null },
  quantity: { type: Number, required: true, min: 0 },
  pricePerUnit: { type: Number, required: true, min: 0 },
  location: { type: String, required: true, trim: true },
  description: { type: String, default: null },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const MarketPriceSchema = new Schema<IMarketPrice>({
  cropId: { type: String },
  price: { type: Number, required: true },
  priceChange: { type: Number },
  market: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const WeatherAlertSchema = new Schema<IWeatherAlert>({
  location: { type: String, required: true },
  alertType: { type: String, required: true },
  severity: { type: String, required: true },
  message: { type: String, required: true },
  messageHindi: { type: String },
  messageTelugu: { type: String },
  validUntil: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model<IUser>('User', UserSchema);
export const Crop = mongoose.model<ICrop>('Crop', CropSchema);
export const DiseaseDetection = mongoose.model<IDiseaseDetection>('DiseaseDetection', DiseaseDetectionSchema);
export const Listing = mongoose.model<IListing>('Listing', ListingSchema);
export const MarketPrice = mongoose.model<IMarketPrice>('MarketPrice', MarketPriceSchema);
export const WeatherAlert = mongoose.model<IWeatherAlert>('WeatherAlert', WeatherAlertSchema);

export type InsertUser = Pick<IUser, 'username' | 'password' | 'phone' | 'location' | 'language'>;
export type InsertCrop = Pick<ICrop, 'name' | 'nameHindi' | 'nameTelugu' | 'category' | 'currentPrice' | 'unit'>;
export type InsertDiseaseDetection = Pick<IDiseaseDetection, 'userId' | 'cropId' | 'imageUrl' | 'detectedDisease' | 'confidence' | 'treatment'>;
export type InsertListing = Pick<IListing, 'userId' | 'cropId' | 'quantity' | 'pricePerUnit' | 'location' | 'description'>;
export type InsertMarketPrice = Pick<IMarketPrice, 'cropId' | 'price' | 'priceChange' | 'market'>;
export type InsertWeatherAlert = Pick<IWeatherAlert, 'location' | 'alertType' | 'severity' | 'message' | 'messageHindi' | 'messageTelugu' | 'validUntil'>;
