export type User = {
  _id: string;
  username: string;
  password: string;
  phone?: string | null;
  location?: string | null;
  language?: string | null;
  createdAt: Date;
};

export type Crop = {
  _id: string;
  name: string;
  nameHindi?: string | null;
  nameTelugu?: string | null;
  category: string;
  currentPrice?: number | null;
  unit?: string | null;
};

export type DiseaseDetection = {
  _id: string;
  userId: string;
  cropId?: string | null;
  imageUrl: string;
  detectedDisease?: string | null;
  confidence?: number | null;
  treatment?: string | null;
  detectedAt: Date;
};

export type Listing = {
  _id: string;
  userId: string;
  cropId?: string | null;
  quantity: number;
  pricePerUnit: number;
  location: string;
  description?: string | null;
  isActive: boolean;
  createdAt: Date;
};

export type MarketPrice = {
  _id: string;
  cropId?: string | null;
  price: number;
  priceChange?: number | null;
  market: string;
  date: Date;
};

export type WeatherAlert = {
  _id: string;
  location: string;
  alertType: string;
  severity: string;
  message: string;
  messageHindi?: string | null;
  messageTelugu?: string | null;
  validUntil?: Date | null;
  createdAt: Date;
};

export type InsertUser = Pick<User, 'username' | 'password' | 'phone' | 'location' | 'language'>;
export type InsertCrop = Pick<Crop, 'name' | 'nameHindi' | 'nameTelugu' | 'category' | 'currentPrice' | 'unit'>;
export type InsertDiseaseDetection = Pick<DiseaseDetection, 'userId' | 'cropId' | 'imageUrl' | 'detectedDisease' | 'confidence' | 'treatment'>;
export type InsertListing = Pick<Listing, 'userId' | 'cropId' | 'quantity' | 'pricePerUnit' | 'location' | 'description'>;
export type InsertMarketPrice = Pick<MarketPrice, 'cropId' | 'price' | 'priceChange' | 'market'>;
export type InsertWeatherAlert = Pick<WeatherAlert, 'location' | 'alertType' | 'severity' | 'message' | 'messageHindi' | 'messageTelugu' | 'validUntil'>;
