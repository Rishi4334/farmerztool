import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import type { InsertUser, InsertCrop, InsertDiseaseDetection, InsertListing, InsertMarketPrice, InsertWeatherAlert } from "./models";

export async function registerRoutes(app: Express): Promise<Server> {
  // ==================== CROPS ====================
  
  app.get("/api/crops", async (_req, res) => {
    try {
      const crops = await storage.getAllCrops();
      res.json(crops);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch crops" });
    }
  });

  app.get("/api/crops/:id", async (req, res) => {
    try {
      const crop = await storage.getCrop(req.params.id);
      if (!crop) {
        return res.status(404).json({ message: "Crop not found" });
      }
      res.json(crop);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch crop" });
    }
  });

  app.post("/api/crops", async (req, res) => {
    try {
      const newCrop = await storage.createCrop(req.body as InsertCrop);
      res.status(201).json(newCrop);
    } catch (error) {
      res.status(500).json({ message: "Failed to create crop" });
    }
  });

  // ==================== DISEASE DETECTION ====================
  
  app.post("/api/disease-detection", async (req, res) => {
    try {
      const data = req.body as InsertDiseaseDetection;
      
      const diseases = {
        'tomato': ['Early Blight', 'Late Blight', 'Leaf Mold', 'Septoria Leaf Spot'],
        'rice': ['Blast', 'Brown Spot', 'Bacterial Blight', 'Sheath Blight'],
        'wheat': ['Rust', 'Powdery Mildew', 'Leaf Blight', 'Smut'],
        'cotton': ['Leaf Curl', 'Wilt', 'Boll Rot', 'Root Rot']
      };

      const treatments = {
        'Early Blight': 'Apply copper-based fungicide every 7-10 days. Remove infected leaves.',
        'Blast': 'Use Tricyclazole fungicide. Maintain proper water management.',
        'Rust': 'Apply Propiconazole. Ensure good air circulation.',
        'Leaf Curl': 'Use Imidacloprid. Control whitefly population.'
      };

      const randomDisease = diseases.tomato[Math.floor(Math.random() * diseases.tomato.length)];
      const confidence = 75 + Math.random() * 20;

      const detection = await storage.createDiseaseDetection({
        ...data,
        detectedDisease: randomDisease,
        confidence: parseFloat(confidence.toFixed(2)),
        treatment: treatments[randomDisease as keyof typeof treatments] || 'Consult agricultural expert for treatment plan.'
      });

      res.status(201).json(detection);
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze image" });
    }
  });

  app.get("/api/disease-detection/user/:userId", async (req, res) => {
    try {
      const detections = await storage.getUserDiseaseDetections(req.params.userId);
      res.json(detections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch detections" });
    }
  });

  // ==================== LISTINGS (SELL DIRECT) ====================
  
  app.get("/api/listings", async (_req, res) => {
    try {
      const listings = await storage.getAllListings();
      res.json(listings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch listings" });
    }
  });

  app.get("/api/listings/user/:userId", async (req, res) => {
    try {
      const listings = await storage.getUserListings(req.params.userId);
      res.json(listings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user listings" });
    }
  });

  app.post("/api/listings", async (req, res) => {
    try {
      const { userId, cropId, quantity, pricePerUnit, location, description } = req.body;

      if (!userId) {
        return res.status(401).json({ message: "User ID is required" });
      }

      if (!quantity || !pricePerUnit || !location) {
        return res.status(400).json({ message: "Quantity, price, and location are required" });
      }

      const listingData: InsertListing = {
        userId,
        cropId: cropId || null,
        quantity: parseFloat(quantity),
        pricePerUnit: parseFloat(pricePerUnit),
        location,
        description: description || null
      };

      const listing = await storage.createListing(listingData);
      
      if (!listing) {
        throw new Error("Failed to create listing in database");
      }

      console.log("Listing created successfully:", listing);
      res.status(201).json(listing);
    } catch (error) {
      console.error("Listing creation error:", error);
      res.status(500).json({ 
        message: "Failed to create listing",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.patch("/api/listings/:id", async (req, res) => {
    try {
      const updated = await storage.updateListing(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Listing not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update listing" });
    }
  });

  // ==================== MARKET PRICES ====================
  
  app.get("/api/market-prices", async (_req, res) => {
    try {
      const prices = await storage.getMarketPrices();
      res.json(prices);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch market prices" });
    }
  });

  app.get("/api/market-prices/crop/:cropId", async (req, res) => {
    try {
      const prices = await storage.getMarketPricesByCrop(req.params.cropId);
      res.json(prices);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch crop prices" });
    }
  });

  app.post("/api/market-prices", async (req, res) => {
    try {
      const price = await storage.createMarketPrice(req.body as InsertMarketPrice);
      res.status(201).json(price);
    } catch (error) {
      res.status(500).json({ message: "Failed to create market price" });
    }
  });

  // ==================== WEATHER ALERTS ====================
  
  app.get("/api/weather-alerts/:location", async (req, res) => {
    try {
      const alerts = await storage.getActiveWeatherAlerts(req.params.location);
      
      if (alerts.length === 0) {
        const sampleAlerts = [
          {
            location: req.params.location,
            alertType: 'rain',
            severity: 'medium',
            message: 'Moderate rainfall expected in the next 24 hours',
            messageHindi: 'अगले 24 घंटों में मध्यम वर्षा की संभावना',
            messageTelugu: 'రాబోయే 24 గంటల్లో మోస్తరు వర్షం అవకాశం',
            validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000)
          }
        ];
        res.json(sampleAlerts);
      } else {
        res.json(alerts);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch weather alerts" });
    }
  });

  app.post("/api/weather-alerts", async (req, res) => {
    try {
      const alert = await storage.createWeatherAlert(req.body as InsertWeatherAlert);
      res.status(201).json(alert);
    } catch (error) {
      res.status(500).json({ message: "Failed to create weather alert" });
    }
  });

  // ==================== WEATHER FORECAST ====================
  
  app.get("/api/weather/forecast/:location", async (req, res) => {
    try {
      const forecast = {
        location: req.params.location,
        current: {
          temperature: 28 + Math.random() * 5,
          humidity: 60 + Math.random() * 20,
          windSpeed: 10 + Math.random() * 10,
          condition: 'Partly Cloudy',
          icon: '⛅'
        },
        daily: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString(),
          tempMax: 30 + Math.random() * 5,
          tempMin: 20 + Math.random() * 5,
          condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
          precipitation: Math.random() * 100,
          icon: ['☀️', '☁️', '🌧️', '⛅'][Math.floor(Math.random() * 4)]
        }))
      };
      
      res.json(forecast);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch weather forecast" });
    }
  });

  // ==================== USERS / AUTH ====================
  
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password, phone, location, language } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const existing = await storage.getUserByUsername(username);
      if (existing) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const userData: InsertUser = {
        username,
        password,
        phone: phone || null,
        location: location || null,
        language: language || 'english'
      };

      const user = await storage.createUser(userData);
      
      if (!user) {
        throw new Error("Failed to create user in database");
      }

      // Convert Mongoose document to plain object
      const userObj = user.toObject ? user.toObject() : user;
      const { password: _, ...userWithoutPassword } = userObj as any;
      
      // Return clean JSON object
      const cleanUser = {
        _id: userWithoutPassword._id.toString(),
        username: userWithoutPassword.username,
        phone: userWithoutPassword.phone || null,
        location: userWithoutPassword.location || null,
        language: userWithoutPassword.language || 'english'
      };
      
      console.log("User created successfully:", cleanUser);
      res.status(201).json(cleanUser);
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ 
        message: "Failed to create user",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Convert Mongoose document to plain object
      const userObj = user.toObject ? user.toObject() : user;
      const { password: _, ...userWithoutPassword } = userObj as any;
      
      // Return clean JSON object
      const cleanUser = {
        _id: userWithoutPassword._id.toString(),
        username: userWithoutPassword.username,
        phone: userWithoutPassword.phone || null,
        location: userWithoutPassword.location || null,
        language: userWithoutPassword.language || 'english'
      };
      
      res.json(cleanUser);
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password: _, ...userWithoutPassword } = user as any;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // ==================== DATABASE STATUS ====================
  
  app.get("/api/database/status", async (_req, res) => {
    try {
      const crops = await storage.getAllCrops();
      const listings = await storage.getAllListings();
      const prices = await storage.getMarketPrices();
      
      res.json({
        connected: true,
        collections: {
          crops: crops.length,
          listings: listings.length,
          marketPrices: prices.length
        },
        message: 'MongoDB is connected and operational'
      });
    } catch (error) {
      res.status(500).json({
        connected: false,
        message: 'Using in-memory storage',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // ==================== ANALYTICS ====================
  
  app.get("/api/analytics/:userId", async (req, res) => {
    try {
      const analytics = {
        revenue: {
          total: 348000,
          monthly: [45000, 52000, 48000, 61000, 58000, 72000],
          growth: 60
        },
        crops: {
          diversity: 6,
          yields: [
            { name: 'Rice', current: 4.2, target: 5.0, unit: 'tons/hectare' },
            { name: 'Wheat', current: 3.8, target: 4.5, unit: 'tons/hectare' },
            { name: 'Cotton', current: 2.1, target: 2.5, unit: 'tons/hectare' }
          ]
        },
        metrics: {
          landUtilization: 87,
          waterEfficiency: 76,
          profitMargin: 42
        }
      };
      
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
