
# 🌾 FarmConnect - AI-Powered Farming Assistant Platform

## Complete Project Documentation

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Technology Stack](#architecture--technology-stack)
3. [Project Structure](#project-structure)
4. [Detailed Code Explanation](#detailed-code-explanation)
5. [Database Schema](#database-schema)
6. [API Endpoints](#api-endpoints)
7. [Frontend Flow](#frontend-flow)
8. [Key Features Implementation](#key-features-implementation)
9. [Data Flow Diagrams](#data-flow-diagrams)

---

## 1. Project Overview

### What is FarmConnect?
FarmConnect is a comprehensive, AI-powered farming assistance platform designed to help farmers in India with:
- **Disease Detection**: Upload crop images to detect diseases using AI
- **Market Prices**: Real-time crop price tracking across mandis
- **Direct Selling**: Platform for farmers to list and sell crops directly
- **Weather Forecasts**: Location-based weather alerts and forecasts
- **Knowledge Hub**: Educational resources, videos, and farming tips
- **Expert Connect**: Connect with agricultural experts
- **Analytics**: Track farm performance and revenue
- **Multilingual Support**: English, Hindi, and Telugu

### Target Users
- Small and medium-scale farmers in India
- Agricultural cooperatives
- Farming communities in rural areas

### Problem It Solves
1. **Information Gap**: Farmers lack access to real-time market prices and weather data
2. **Middleman Exploitation**: Direct selling eliminates intermediaries
3. **Disease Management**: Early detection of crop diseases prevents losses
4. **Language Barrier**: Multilingual support makes technology accessible

---

## 2. Architecture & Technology Stack

### Frontend (Client)
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: React Query (TanStack Query) for server state
- **Styling**: Tailwind CSS with custom farmer-themed colors
- **UI Components**: shadcn/ui component library
- **Build Tool**: Vite (fast dev server and bundler)
- **HTTP Client**: Fetch API with React Query

### Backend (Server)
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Development**: tsx for TypeScript execution
- **Environment**: dotenv for environment variables

### Database
- **Primary**: MongoDB Atlas (cloud-hosted)
- **Fallback**: In-memory storage for development
- **Collections**: Users, Crops, Listings, MarketPrices, DiseaseDetections, WeatherAlerts

### Key Libraries
```json
Frontend:
- react-query: Server state management
- wouter: Routing
- tailwindcss: Styling
- lucide-react: Icons
- recharts: Data visualization

Backend:
- express: Web framework
- mongoose: MongoDB ODM
- dotenv: Environment configuration
- cross-env: Cross-platform environment vars
```

---

## 3. Project Structure

```
FarmConnect/
│
├── client/                          # Frontend application
│   ├── src/
│   │   ├── components/             # Reusable React components
│   │   │   ├── ui/                # shadcn/ui components
│   │   │   │   ├── button.tsx     # Reusable button component
│   │   │   │   ├── card.tsx       # Card container component
│   │   │   │   ├── input.tsx      # Form input component
│   │   │   │   ├── select.tsx     # Dropdown select component
│   │   │   │   └── ...            # Other UI primitives
│   │   │   ├── bottom-navigation.tsx    # Mobile bottom nav bar
│   │   │   ├── header.tsx               # Top header with logo
│   │   │   ├── language-selector.tsx    # Language switcher
│   │   │   ├── theme-toggle.tsx         # Dark/light mode toggle
│   │   │   ├── voice-assistant.tsx      # Voice input feature
│   │   │   └── weather-alert.tsx        # Weather alert display
│   │   │
│   │   ├── hooks/                 # Custom React hooks
│   │   │   ├── use-language.tsx   # Language context & translations
│   │   │   ├── use-theme.tsx      # Theme (dark/light) management
│   │   │   ├── use-toast.ts       # Toast notifications
│   │   │   ├── use-voice.tsx      # Voice recognition & speech
│   │   │   └── use-mobile.tsx     # Mobile device detection
│   │   │
│   │   ├── lib/                   # Utility libraries
│   │   │   ├── queryClient.ts     # React Query configuration
│   │   │   ├── constants.ts       # App constants (colors, etc.)
│   │   │   └── utils.ts           # Helper functions
│   │   │
│   │   ├── pages/                 # Page components (routes)
│   │   │   ├── home.tsx           # Dashboard/home page
│   │   │   ├── login.tsx          # Login/registration page
│   │   │   ├── plant-doctor.tsx   # Disease detection page
│   │   │   ├── weather.tsx        # Weather forecast page
│   │   │   ├── market.tsx         # Market prices page
│   │   │   ├── sell-direct.tsx    # Direct selling platform
│   │   │   ├── knowledge-hub.tsx  # Learning resources
│   │   │   ├── expert-connect.tsx # Expert consultation
│   │   │   ├── analytics.tsx      # Farm analytics
│   │   │   ├── alerts.tsx         # Weather alerts
│   │   │   ├── profile.tsx        # User profile
│   │   │   └── not-found.tsx      # 404 page
│   │   │
│   │   ├── App.tsx                # Main app component
│   │   ├── main.tsx               # Entry point
│   │   └── index.css              # Global styles
│   │
│   └── index.html                 # HTML template
│
├── server/                         # Backend application
│   ├── index.ts                   # Server entry point
│   ├── routes.ts                  # API route definitions
│   ├── models.ts                  # MongoDB schemas (Mongoose)
│   ├── storage.ts                 # Database abstraction layer
│   └── vite.ts                    # Vite dev server integration
│
├── shared/                         # Shared TypeScript types
│   └── schema.ts                  # Type definitions
│
├── package.json                   # Dependencies & scripts
├── tsconfig.json                  # TypeScript configuration
├── vite.config.ts                 # Vite bundler config
├── tailwind.config.ts             # Tailwind CSS config
└── .env                           # Environment variables
```

---

## 4. Detailed Code Explanation

### 4.1 Backend - Server Entry Point (`server/index.ts`)

**Purpose**: Initialize Express server, connect to MongoDB, register routes

```typescript
import 'dotenv/config';  // Load environment variables from .env file
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { connectDB } from "./storage";

const app = express();
app.use(express.json());  // Parse JSON request bodies
app.use(express.urlencoded({ extended: false }));  // Parse URL-encoded bodies

// Middleware to log API requests
app.use((req, res, next) => {
  const start = Date.now();  // Record start time
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  // Capture JSON responses for logging
  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  // Log when response is finished
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

// Async IIFE to start server
(async () => {
  await connectDB();  // Connect to MongoDB
  const server = await registerRoutes(app);  // Register all API routes

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  // Setup Vite in development, serve static files in production
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Start server on port 5000 (accessible to users)
  const port = parseInt(process.env.PORT || "5000", 10);
  const host = "0.0.0.0";  // Required for Replit/cloud hosting

  app.listen(port, host, () => {
    log(`serving on http://${host}:${port}`);
  });
})();
```

**Key Concepts**:
- **Middleware**: Functions that process requests before reaching routes
- **IIFE (Immediately Invoked Function Expression)**: `(async () => {})()` executes immediately
- **Error Handling**: Global error handler catches all errors
- **Port Binding**: `0.0.0.0` makes server accessible externally

---

### 4.2 Database Layer (`server/storage.ts`)

**Purpose**: Abstracts database operations, provides fallback to in-memory storage

```typescript
// Database connection management
let isConnected = false;
let connectionAttempted = false;

export async function connectDB() {
  if (isConnected || connectionAttempted) {
    return;  // Prevent multiple connection attempts
  }

  connectionAttempted = true;

  if (!process.env.MONGODB_URI) {
    console.log('Using in-memory storage (no MONGODB_URI configured)');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,  // Timeout after 5 seconds
    });
    isConnected = true;
    console.log('MongoDB connected successfully');
    
    await seedDatabase();  // Populate initial data
  } catch (error) {
    console.warn('MongoDB connection failed, using in-memory storage:', error);
  }
}
```

**Storage Interface Pattern**:
```typescript
// Define common interface for both storage types
interface IStorageInterface {
  getAllCrops(): Promise<ICrop[]>;
  createListing(listing: InsertListing): Promise<IListing>;
  // ... more methods
}

// MongoDB implementation
class DatabaseStorage implements IStorageInterface {
  async getAllCrops(): Promise<ICrop[]> {
    if (!isConnected) return [];
    return Crop.find().exec();
  }
}

// In-memory fallback
class InMemoryStorage implements IStorageInterface {
  private crops: Map<string, any> = new Map();
  
  async getAllCrops(): Promise<ICrop[]> {
    return Array.from(this.crops.values());
  }
}

// Proxy pattern to switch between implementations
export const storage = new Proxy({} as IStorageInterface, {
  get(_target, prop) {
    return (getStorage() as any)[prop];
  }
});
```

**Why This Design?**:
- **Abstraction**: Same code works with MongoDB or in-memory storage
- **Resilience**: App works even if database is unavailable
- **Testing**: Easy to test with in-memory storage

---

### 4.3 Database Models (`server/models.ts`)

**Purpose**: Define MongoDB schemas using Mongoose

```typescript
import mongoose, { Schema, Document } from 'mongoose';

// TypeScript interface for type safety
export interface IListing extends Document {
  userId: string;         // Who created the listing
  cropId?: string;        // What crop (optional)
  quantity: number;       // How much (in quintals)
  pricePerUnit: number;   // Price per quintal
  location: string;       // Farm location
  description?: string;   // Additional details
  isActive: boolean;      // Is listing still available?
  createdAt: Date;        // When created
}

// Mongoose schema (database structure)
const ListingSchema = new Schema<IListing>({
  userId: { type: String, required: true },
  cropId: { type: String },
  quantity: { type: Number, required: true },
  pricePerUnit: { type: Number, required: true },
  location: { type: String, required: true },
  description: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

// Export Mongoose model
export const Listing = mongoose.model<IListing>('Listing', ListingSchema);

// Type for inserting new listings (subset of fields)
export type InsertListing = Pick<IListing, 'userId' | 'cropId' | 'quantity' | 'pricePerUnit' | 'location' | 'description'>;
```

**Key Collections**:
1. **Users**: Authentication and profile data
2. **Crops**: Master list of crops (Rice, Wheat, etc.)
3. **Listings**: Farmer's products for sale
4. **MarketPrices**: Historical price data per mandi
5. **DiseaseDetections**: AI detection history
6. **WeatherAlerts**: Active weather warnings

---

### 4.4 API Routes (`server/routes.ts`)

**Purpose**: Define all REST API endpoints

**Example: Creating a Listing**
```typescript
app.post("/api/listings", async (req, res) => {
  try {
    // Extract data from request body
    const listing = await storage.createListing(req.body as InsertListing);
    res.status(201).json(listing);  // 201 = Created
  } catch (error) {
    res.status(500).json({ message: "Failed to create listing" });
  }
});
```

**Example: User Authentication**
```typescript
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user by username
    const user = await storage.getUserByUsername(username);
    
    // Check credentials
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Remove password before sending response
    const { password: _, ...userWithoutPassword } = user as any;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});
```

**Complete API Endpoints**:
```
Authentication:
  POST   /api/auth/register        - Create new user account
  POST   /api/auth/login           - Login user

Crops:
  GET    /api/crops                - List all crops
  GET    /api/crops/:id            - Get single crop
  POST   /api/crops                - Add new crop

Disease Detection:
  POST   /api/disease-detection    - Analyze crop image
  GET    /api/disease-detection/user/:userId - Get user's history

Listings (Sell Direct):
  GET    /api/listings             - All active listings
  GET    /api/listings/user/:userId - User's listings
  POST   /api/listings             - Create new listing
  PATCH  /api/listings/:id         - Update listing

Market Prices:
  GET    /api/market-prices        - Recent prices
  GET    /api/market-prices/crop/:cropId - Crop-specific prices
  POST   /api/market-prices        - Add price data

Weather:
  GET    /api/weather-alerts/:location - Active alerts
  GET    /api/weather/forecast/:location - 7-day forecast
  POST   /api/weather-alerts       - Create alert

Analytics:
  GET    /api/analytics/:userId    - User's farm analytics

Database:
  GET    /api/database/status      - Check DB connection
```

---

### 4.5 Frontend - Main App (`client/src/App.tsx`)

**Purpose**: Root component that sets up routing and global providers

```typescript
function App() {
  return (
    // React Query: Manages server state (API calls, caching)
    <QueryClientProvider client={queryClient}>
      {/* Tooltip: Hover effects for UI elements */}
      <TooltipProvider>
        {/* Theme: Dark/light mode management */}
        <ThemeProvider>
          {/* Language: Multilingual support (English/Hindi/Telugu) */}
          <LanguageProvider>
            {/* Toast: Notification system */}
            <Toaster />
            {/* Language selection on first visit */}
            <InitialLanguageSelector />
            {/* Main app layout */}
            <AppLayout />
          </LanguageProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function AppLayout() {
  return (
    <div className="min-h-screen">
      <Header />              {/* Top navigation bar */}
      <VoiceAssistant />      {/* Voice input button */}
      <main className="flex-1">
        <Router />            {/* Page routing */}
      </main>
      <BottomNavigation />    {/* Mobile bottom nav */}
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={Home} />
      <Route path="/plant-doctor" component={PlantDoctor} />
      <Route path="/market" component={Market} />
      {/* ... more routes */}
    </Switch>
  );
}
```

**Provider Pattern Explained**:
- **Context Providers**: Wrap app to share data globally
- **Nesting Order**: Outer providers available to inner components
- **React Query**: Handles API calls, caching, and synchronization

---

### 4.6 React Query Setup (`client/src/lib/queryClient.ts`)

**Purpose**: Configure API request handling

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        // Automatic API fetching based on query key
        const res = await fetch(queryKey[0] as string, {
          credentials: "include",  // Send cookies
        });

        if (!res.ok) {
          // Error handling
          if (res.status >= 500) {
            throw new Error(`${res.status}: ${res.statusText}`);
          }
          throw new Error(`${res.status}: ${await res.text()}`);
        }

        return res.json();
      },
      staleTime: 5 * 60 * 1000,  // Data fresh for 5 minutes
      retry: false,  // Don't retry failed requests
    },
  },
});
```

**How It Works**:
```typescript
// In a component:
const { data: crops } = useQuery({
  queryKey: ["/api/crops"],  // This becomes the fetch URL
});

// React Query automatically:
// 1. Fetches from /api/crops
// 2. Caches the result
// 3. Re-fetches when stale
// 4. Handles loading/error states
```

---

### 4.7 Language Support (`client/src/hooks/use-language.tsx`)

**Purpose**: Multilingual interface (English, Hindi, Telugu)

```typescript
const translations = {
  english: {
    home: "Home",
    weather: "Weather",
    market: "Market",
    // ... 100+ translations
  },
  hindi: {
    home: "होम",
    weather: "मौसम",
    market: "बाजार",
    // ...
  },
  telugu: {
    home: "హోమ్",
    weather: "వాతావరణం",
    market: "మార్కెట్",
    // ...
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    // Load saved language or default to English
    return (localStorage.getItem('language') as Language) || 'english';
  });

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook to get translations
export function useTranslation() {
  const { language } = useLanguage();
  return translations[language];
}

// Usage in components:
function MyComponent() {
  const t = useTranslation();
  return <h1>{t.home}</h1>;  // Displays "Home", "होम", or "హోమ్"
}
```

---

### 4.8 Sell Direct Page (`client/src/pages/sell-direct.tsx`)

**Purpose**: Farmers can list crops for direct sale

**Component Structure**:
```typescript
export default function SellDirect() {
  const [, setLocation] = useLocation();  // Navigation
  const { toast } = useToast();  // Notifications
  const queryClient = useQueryClient();  // Cache management
  
  // Form state
  const [formData, setFormData] = useState({
    crop: "",
    quantity: "",
    location: "",
    description: "",
    pricePerUnit: ""
  });

  // Get logged-in user from localStorage
  const [user, setUser] = useState<any>(() => {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  });

  // Fetch available crops
  const { data: crops } = useQuery({
    queryKey: ["/api/crops"],
  });

  // Fetch user's listings
  const { data: userListings = [], refetch: refetchListings } = useQuery({
    queryKey: ["/api/listings/user", user?._id],
    enabled: !!user?._id,  // Only fetch if user logged in
  });

  // Mutation to create listing
  const createListingMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create listing");
      return response.json();
    },
    onSuccess: () => {
      // Refresh listings after creating
      queryClient.invalidateQueries({ queryKey: ["/api/listings"] });
      refetchListings();
      toast({
        title: "Success!",
        description: "Your listing has been created successfully.",
      });
      // Reset form
      setFormData({
        crop: "",
        quantity: "",
        location: "",
        description: "",
        pricePerUnit: ""
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check authentication
    if (!user || !user._id) {
      toast({
        title: "Error",
        description: "Please login to create a listing",
        variant: "destructive",
      });
      setTimeout(() => setLocation("/login"), 1500);
      return;
    }

    // Submit listing
    createListingMutation.mutate({
      userId: user._id,
      cropId: formData.crop,
      quantity: parseFloat(formData.quantity),
      pricePerUnit: parseFloat(formData.pricePerUnit),
      location: formData.location,
      description: formData.description,
    });
  };

  return (
    <div>
      {/* Form to create listing */}
      <Card>
        <form onSubmit={handleSubmit}>
          <Select onValueChange={(value) => handleInputChange("crop", value)}>
            {crops?.map((crop: any) => (
              <SelectItem key={crop._id} value={crop._id}>
                {crop.name}
              </SelectItem>
            ))}
          </Select>
          {/* ... quantity, price, location inputs */}
          <Button type="submit">List Product</Button>
        </form>
      </Card>

      {/* Display user's active listings */}
      <Card>
        {userListings.map((listing: any) => (
          <div key={listing._id}>
            <p>{listing.quantity} quintals • {listing.location}</p>
            <p>₹{listing.pricePerUnit}/quintal</p>
          </div>
        ))}
      </Card>
    </div>
  );
}
```

**Data Flow**:
1. User fills form → `formData` state updated
2. User clicks submit → `handleSubmit` called
3. Form validated → Check if user logged in
4. API call → `createListingMutation.mutate()`
5. Success → Refresh listings, show toast, reset form
6. Display → User's listings fetched and shown

---

### 4.9 Market Prices Page (`client/src/pages/market.tsx`)

**Purpose**: Display real-time crop prices from different mandis

```typescript
export default function Market() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch all crops
  const { data: crops } = useQuery({
    queryKey: ["/api/crops"],
  });
  
  // Fetch market prices
  const { data: marketPrices = [] } = useQuery({
    queryKey: ["/api/market-prices"],
  });

  // Filter crops based on search
  const filteredCrops = (crops || []).filter(crop =>
    crop?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Search input */}
      <Input
        placeholder="Search crops..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Display crops with prices */}
      {filteredCrops.map((crop: any) => {
        const price = marketPrices.find((p: any) => p.cropId === crop._id);
        return (
          <Card key={crop._id}>
            <h3>{crop.name}</h3>
            <p>₹{price?.price || crop.currentPrice}/quintal</p>
            <Badge variant={price?.priceChange > 0 ? "default" : "destructive"}>
              {price?.priceChange > 0 ? "↑" : "↓"} {Math.abs(price?.priceChange)}%
            </Badge>
          </Card>
        );
      })}
    </div>
  );
}
```

**Search Implementation**:
- **Real-time filtering**: Updates as user types
- **Case-insensitive**: `.toLowerCase()` for matching
- **Null-safe**: Optional chaining (`?.`) prevents errors

---

### 4.10 Plant Doctor (Disease Detection) (`client/src/pages/plant-doctor.tsx`)

**Purpose**: AI-powered crop disease detection

```typescript
export default function PlantDoctor() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const detectDiseaseMutation = useMutation({
    mutationFn: async (data: { userId: string; imageUrl: string }) => {
      const response = await fetch("/api/disease-detection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);  // Display detection results
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);  // Convert to base64
    }
  };

  const analyzeImage = () => {
    if (selectedImage) {
      detectDiseaseMutation.mutate({
        userId: user._id,
        imageUrl: selectedImage,
      });
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageUpload} accept="image/*" />
      {selectedImage && <img src={selectedImage} />}
      <Button onClick={analyzeImage}>Analyze Image</Button>

      {result && (
        <Card>
          <h3>Detected: {result.detectedDisease}</h3>
          <p>Confidence: {result.confidence}%</p>
          <p>Treatment: {result.treatment}</p>
        </Card>
      )}
    </div>
  );
}
```

**Image Processing Flow**:
1. User selects image → FileReader converts to base64
2. Image displayed → User confirms
3. Click analyze → API call with base64 image
4. Backend processes → Simulated AI detection
5. Results shown → Disease name, confidence, treatment

---

## 5. Database Schema

### Collections Structure

**Users Collection**:
```javascript
{
  _id: ObjectId("..."),
  username: "farmer123",
  password: "hashed_password",  // In production, should be hashed
  phone: "+91-9876543210",
  location: "Warangal, Telangana",
  language: "telugu",
  createdAt: ISODate("2024-01-15T10:30:00Z")
}
```

**Crops Collection**:
```javascript
{
  _id: ObjectId("..."),
  name: "Rice",
  nameHindi: "चावल",
  nameTelugu: "బియ్యం",
  category: "Grain",
  currentPrice: 2400,
  unit: "quintal"
}
```

**Listings Collection**:
```javascript
{
  _id: ObjectId("..."),
  userId: "675abc...",
  cropId: "675def...",
  quantity: 50,
  pricePerUnit: 2200,
  location: "Warangal",
  description: "Premium quality basmati",
  isActive: true,
  createdAt: ISODate("2024-01-20T14:20:00Z")
}
```

**MarketPrices Collection**:
```javascript
{
  _id: ObjectId("..."),
  cropId: "675def...",
  price: 2450,
  priceChange: 12,  // +12% increase
  market: "Guntur Mandi",
  date: ISODate("2024-01-20T00:00:00Z")
}
```

**DiseaseDetections Collection**:
```javascript
{
  _id: ObjectId("..."),
  userId: "675abc...",
  cropId: "675ghi...",
  imageUrl: "data:image/jpeg;base64,...",
  detectedDisease: "Early Blight",
  confidence: 87.5,
  treatment: "Apply copper-based fungicide...",
  detectedAt: ISODate("2024-01-20T15:45:00Z")
}
```

---

## 6. API Endpoints

### Complete API Reference

#### Authentication

**POST /api/auth/register**
```
Request:
{
  "username": "farmer123",
  "password": "securepass",
  "phone": "+91-9876543210",
  "location": "Warangal",
  "language": "telugu"
}

Response (201):
{
  "_id": "675abc...",
  "username": "farmer123",
  "phone": "+91-9876543210",
  "location": "Warangal",
  "language": "telugu",
  "createdAt": "2024-01-20T10:30:00Z"
}
```

**POST /api/auth/login**
```
Request:
{
  "username": "farmer123",
  "password": "securepass"
}

Response (200):
{
  "_id": "675abc...",
  "username": "farmer123",
  "location": "Warangal"
}

Error (401):
{
  "message": "Invalid credentials"
}
```

#### Crops

**GET /api/crops**
```
Response (200):
[
  {
    "_id": "675def...",
    "name": "Rice",
    "nameHindi": "चावल",
    "nameTelugu": "బియ్యం",
    "category": "Grain",
    "currentPrice": 2400,
    "unit": "quintal"
  }
]
```

#### Listings

**POST /api/listings**
```
Request:
{
  "userId": "675abc...",
  "cropId": "675def...",
  "quantity": 50,
  "pricePerUnit": 2200,
  "location": "Warangal",
  "description": "Premium quality"
}

Response (201):
{
  "_id": "675ghi...",
  "userId": "675abc...",
  "cropId": "675def...",
  "quantity": 50,
  "pricePerUnit": 2200,
  "location": "Warangal",
  "isActive": true,
  "createdAt": "2024-01-20T14:20:00Z"
}
```

---

## 7. Frontend Flow

### User Journey: Creating a Listing

```
1. User opens app → Home page loads
   ↓
2. Clicks "Sell Direct" → Navigate to /sell-direct
   ↓
3. Page loads → Check localStorage for user
   ↓
4. If not logged in → Redirect to /login
   ↓
5. User logs in → Save user to localStorage
   ↓
6. Return to /sell-direct → Form displayed
   ↓
7. Fetch crops → Populate dropdown
   ↓
8. User fills form:
   - Select crop
   - Enter quantity
   - Enter price
   - Enter location
   ↓
9. User clicks "List Product"
   ↓
10. Form validation → Check all fields
   ↓
11. API call → POST /api/listings
   ↓
12. Success response → Show success toast
   ↓
13. Refresh listings → Re-fetch user's listings
   ↓
14. Display updated list → New listing appears
```

### State Management Flow

```
Component State (useState):
- formData: Input values
- user: Logged-in user info

Server State (React Query):
- crops: Master crop list
- userListings: User's active listings

Side Effects:
- onSuccess → Invalidate cache, show toast
- onError → Show error message
```

---

## 8. Key Features Implementation

### 8.1 Multilingual Support

**Implementation**:
- Translations stored in `use-language.tsx`
- Context API provides language to all components
- `useTranslation()` hook returns current language object

**Example**:
```typescript
const t = useTranslation();
<h1>{t.welcome}</h1>  // "Welcome" or "स्वागत" or "స్వాగతం"
```

### 8.2 Voice Assistant

**Technologies**:
- Web Speech API (browser-native)
- Speech Recognition for input
- Speech Synthesis for output

**Code**:
```typescript
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'hi-IN';  // Hindi
recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  // Process voice command
};
recognition.start();
```

### 8.3 Real-time Price Updates

**Implementation**:
- React Query auto-refetches every 5 minutes
- `staleTime` controls cache freshness
- Manual refresh with `refetch()`

### 8.4 Responsive Design

**Approach**:
- Tailwind CSS breakpoints
- Mobile-first design
- Bottom navigation for mobile
- Top navigation for desktop

**Example**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
</div>
```

---

## 9. Data Flow Diagrams

### Overall System Architecture

```
┌─────────────┐
│   Browser   │
│  (React)    │
└──────┬──────┘
       │ HTTP/REST
       ▼
┌─────────────┐
│  Express    │
│  Server     │
└──────┬──────┘
       │ Mongoose
       ▼
┌─────────────┐
│  MongoDB    │
│  Database   │
└─────────────┘
```

### Request-Response Cycle

```
User Action (Click Button)
       ↓
React Component (handleSubmit)
       ↓
React Query Mutation (mutate)
       ↓
Fetch API (POST /api/listings)
       ↓
Express Route Handler (app.post)
       ↓
Storage Layer (storage.createListing)
       ↓
MongoDB (Listing.save())
       ↓
Response (JSON)
       ↓
React Query (onSuccess)
       ↓
Update UI + Show Toast
```

### Authentication Flow

```
Login Page
    ↓
Enter credentials
    ↓
POST /api/auth/login
    ↓
Server validates
    ↓
If valid → Return user object
    ↓
Store in localStorage
    ↓
Redirect to home
    ↓
All subsequent requests include user context
```

---

## Key Learning Points

### Backend Concepts
1. **RESTful API Design**: CRUD operations via HTTP methods
2. **MVC Pattern**: Routes → Controllers → Models
3. **Database Abstraction**: Interface pattern for flexibility
4. **Error Handling**: Try-catch blocks and global handlers
5. **Environment Variables**: Secure configuration management

### Frontend Concepts
1. **Component Architecture**: Reusable, composable components
2. **State Management**: Local state vs. server state
3. **React Hooks**: useState, useEffect, custom hooks
4. **Context API**: Global state without prop drilling
5. **Routing**: Client-side navigation with Wouter

### Full-Stack Integration
1. **API Communication**: Fetch API with React Query
2. **Type Safety**: Shared TypeScript types
3. **Authentication**: JWT-less session with localStorage
4. **Real-time Updates**: Polling and cache invalidation
5. **Error Boundaries**: Graceful error handling

---

## Technologies Used & Why

| Technology | Purpose | Why This Choice |
|------------|---------|----------------|
| React | UI Framework | Component-based, declarative, large ecosystem |
| TypeScript | Type Safety | Catches errors early, better IDE support |
| Tailwind CSS | Styling | Utility-first, rapid development, responsive |
| React Query | Server State | Automatic caching, refetching, synchronization |
| Express | Backend | Simple, flexible, widely-used Node.js framework |
| MongoDB | Database | Document-based, flexible schema, scalable |
| Mongoose | ODM | Schema validation, easy MongoDB interaction |
| Wouter | Routing | Lightweight, simple API, small bundle size |
| Vite | Build Tool | Fast HMR, optimized builds, modern dev experience |

---

## Performance Optimizations

1. **Code Splitting**: Pages loaded on-demand
2. **Lazy Loading**: Images loaded as needed
3. **Memoization**: useMemo, useCallback for expensive operations
4. **Query Caching**: React Query reduces redundant API calls
5. **Debouncing**: Search input delays API calls
6. **Optimistic Updates**: UI updates before server response

---

## Security Considerations

### Current Implementation
- Passwords stored in plain text (development only)
- No HTTPS enforcement
- No CORS configuration
- Basic authentication (username/password)

### Production Requirements
- Hash passwords with bcrypt
- Implement JWT tokens
- Add HTTPS/TLS
- Configure CORS properly
- Add rate limiting
- Input validation and sanitization
- SQL injection prevention (MongoDB less vulnerable)
- XSS protection

---

## Future Enhancements

1. **Real AI Integration**: TensorFlow.js or external AI API
2. **Payment Gateway**: For direct crop purchases
3. **Chat System**: Farmer-to-farmer or farmer-to-expert
4. **Push Notifications**: Weather alerts, price updates
5. **Offline Mode**: PWA with service workers
6. **GPS Integration**: Auto-fill location
7. **Image Compression**: Optimize disease detection images
8. **Export Data**: PDF reports for analytics
9. **Social Features**: Community forums, success stories
10. **Government Integration**: Subsidy tracking, scheme info

---

## Deployment Checklist

- [x] Environment variables configured
- [x] MongoDB Atlas connected
- [x] Production build tested
- [ ] HTTPS enabled
- [ ] Password hashing implemented
- [ ] Error logging setup (Sentry/LogRocket)
- [ ] Performance monitoring
- [ ] SEO optimization
- [ ] Accessibility audit (WCAG)
- [ ] Browser compatibility testing
- [ ] Load testing
- [ ] Backup strategy

---

## Conclusion

FarmConnect is a comprehensive full-stack application that demonstrates:
- Modern web development practices
- RESTful API design
- Database integration
- Real-time data handling
- Responsive UI/UX
- Multilingual support
- Progressive enhancement

The architecture is scalable, maintainable, and can be extended with advanced features like real AI, payments, and real-time chat.

---

**Document Version**: 1.0
**Last Updated**: January 2024
**Total Lines of Code**: ~5,000+
**Technologies**: 15+
**API Endpoints**: 20+
**Features**: 10+
