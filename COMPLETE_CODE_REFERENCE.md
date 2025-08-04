# FarmerZ Platform - Complete Code Reference

This document contains all the key code implementations for the FarmerZ agricultural management platform. Use this as a reference for understanding the architecture and continuing development.

## Table of Contents

1. [Database Schema & Types](#database-schema--types)
2. [Backend Implementation](#backend-implementation)
3. [Frontend Core Components](#frontend-core-components)
4. [Language & Voice System](#language--voice-system)
5. [UI Components](#ui-components)
6. [Application Pages](#application-pages)
7. [Configuration Files](#configuration-files)
8. [Package Dependencies](#package-dependencies)

---

## Database Schema & Types

### shared/schema.ts
```typescript
import { sql } from "drizzle-orm";
import { mysqlTable, text, varchar, int, decimal, timestamp, boolean } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  phone: text("phone"),
  location: text("location"),
  language: text("language").default("english"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const crops = mysqlTable("crops", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  name: text("name").notNull(),
  nameHindi: text("name_hindi"),
  nameTelugu: text("name_telugu"),
  category: text("category").notNull(),
  currentPrice: decimal("current_price", { precision: 10, scale: 2 }),
  unit: text("unit").default("quintal"),
});

export const diseaseDetections = mysqlTable("disease_detections", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  userId: varchar("user_id", { length: 36 }).references(() => users.id),
  cropId: varchar("crop_id", { length: 36 }).references(() => crops.id),
  imageUrl: text("image_url").notNull(),
  detectedDisease: text("detected_disease"),
  confidence: decimal("confidence", { precision: 5, scale: 2 }),
  treatment: text("treatment"),
  detectedAt: timestamp("detected_at").defaultNow(),
});

export const listings = mysqlTable("listings", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  userId: varchar("user_id", { length: 36 }).references(() => users.id),
  cropId: varchar("crop_id", { length: 36 }).references(() => crops.id),
  quantity: int("quantity").notNull(),
  pricePerUnit: decimal("price_per_unit", { precision: 10, scale: 2 }).notNull(),
  location: text("location").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const marketPrices = mysqlTable("market_prices", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  cropId: varchar("crop_id", { length: 36 }).references(() => crops.id),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  priceChange: decimal("price_change", { precision: 10, scale: 2 }),
  market: text("market").notNull(),
  date: timestamp("date").defaultNow(),
});

export const weatherAlerts = mysqlTable("weather_alerts", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  location: text("location").notNull(),
  alertType: text("alert_type").notNull(),
  severity: text("severity").notNull(),
  message: text("message").notNull(),
  messageHindi: text("message_hindi"),
  messageTelugu: text("message_telugu"),
  validUntil: timestamp("valid_until"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  phone: true,
  location: true,
  language: true,
});

export const insertCropSchema = createInsertSchema(crops).pick({
  name: true,
  nameHindi: true,
  nameTelugu: true,
  category: true,
  currentPrice: true,
  unit: true,
});

export const insertDiseaseDetectionSchema = createInsertSchema(diseaseDetections).pick({
  userId: true,
  cropId: true,
  imageUrl: true,
  detectedDisease: true,
  confidence: true,
  treatment: true,
});

export const insertListingSchema = createInsertSchema(listings).pick({
  userId: true,
  cropId: true,
  quantity: true,
  pricePerUnit: true,
  location: true,
  description: true,
});

export const insertMarketPriceSchema = createInsertSchema(marketPrices).pick({
  cropId: true,
  price: true,
  priceChange: true,
  market: true,
});

export const insertWeatherAlertSchema = createInsertSchema(weatherAlerts).pick({
  location: true,
  alertType: true,
  severity: true,
  message: true,
  messageHindi: true,
  messageTelugu: true,
  validUntil: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCrop = z.infer<typeof insertCropSchema>;
export type Crop = typeof crops.$inferSelect;
export type InsertDiseaseDetection = z.infer<typeof insertDiseaseDetectionSchema>;
export type DiseaseDetection = typeof diseaseDetections.$inferSelect;
export type InsertListing = z.infer<typeof insertListingSchema>;
export type Listing = typeof listings.$inferSelect;
export type InsertMarketPrice = z.infer<typeof insertMarketPriceSchema>;
export type MarketPrice = typeof marketPrices.$inferSelect;
export type InsertWeatherAlert = z.infer<typeof insertWeatherAlertSchema>;
export type WeatherAlert = typeof weatherAlerts.$inferSelect;
```

---

## Backend Implementation

### server/storage.ts
```typescript
import { type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      location: insertUser.location ?? null,
      phone: insertUser.phone ?? null,
      language: insertUser.language ?? null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
```

### server/routes.ts
```typescript
import express from "express";
import { storage } from "./storage";

export function registerRoutes(app: express.Application) {
  const server = require("http").createServer(app);

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return server;
}
```

### server/index.ts
```typescript
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

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

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
```

---

## Language & Voice System

### client/src/lib/constants.ts
```typescript
export const LANGUAGES = {
  english: {
    code: 'en',
    name: 'English',
    nativeName: 'English'
  },
  hindi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी'
  },
  telugu: {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు'
  }
} as const;

export type Language = keyof typeof LANGUAGES;
```

### client/src/hooks/use-language.tsx
```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { type Language, LANGUAGES } from '@/lib/constants';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  isFirstVisit: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('english');
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('farmerz-language') as Language;
    const hasVisited = localStorage.getItem('farmerz-visited');
    
    if (savedLanguage && LANGUAGES[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
    
    if (hasVisited) {
      setIsFirstVisit(false);
    }
  }, []);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('farmerz-language', language);
    localStorage.setItem('farmerz-visited', 'true');
    setIsFirstVisit(false);
  };

  const t = (key: string): string => {
    return translations[currentLanguage]?.[key as keyof typeof translations.english] || 
           translations.english[key as keyof typeof translations.english] || 
           key;
  };

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      setLanguage, 
      t, 
      isFirstVisit 
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export const translations = {
  english: {
    appName: 'FarmerZ Tool',
    chooseLanguage: 'Choose Your Language',
    pressToSpeak: 'Press to speak',
    askAnything: 'Ask me anything about farming!',
    listening: 'Listening... Speak now!',
    weatherAlert: 'Weather Alert',
    plantDoctor: 'Plant Doctor',
    weather: 'Weather',
    market: 'Market',
    sellDirect: 'Sell Direct',
    learn: 'Learn',
    expertHelp: 'Expert Help',
    recentActivity: 'Recent Activity',
    home: 'Home',
    analytics: 'Analytics',
    alerts: 'Alerts',
    profile: 'Profile'
  },
  hindi: {
    appName: 'फार्मरज टूल',
    chooseLanguage: 'अपनी भाषा चुनें',
    pressToSpeak: 'बोलने के लिए दबाएं',
    askAnything: 'खेती के बारे में कुछ भी पूछें!',
    listening: 'सुन रहा हूं... अब बोलें!',
    weatherAlert: 'मौसम चेतावनी',
    plantDoctor: 'पौधे डॉक्टर',
    weather: 'मौसम',
    market: 'बाज़ार',
    sellDirect: 'सीधे बेचें',
    learn: 'सीखें',
    expertHelp: 'विशेषज्ञ सहायता',
    recentActivity: 'हाल की गतिविधि',
    home: 'होम',
    analytics: 'विश्लेषण',
    alerts: 'अलर्ट',
    profile: 'प्रोफ़ाइल'
  },
  telugu: {
    appName: 'ఫార్మర్జ్ టూల్',
    chooseLanguage: 'మీ భాషను ఎంచుకోండి',
    pressToSpeak: 'మాట్లాడటానికి నొక్కండి',
    askAnything: 'వ్యవసాయం గురించి ఏదైనా అడగండి!',
    listening: 'వింటున్నాను... ఇప్పుడు మాట్లాడండి!',
    weatherAlert: 'వాతావరణ హెచ్చరిక',
    plantDoctor: 'మొక్క వైద్యుడు',
    weather: 'వాతావరణం',
    market: 'మార్కెట్',
    sellDirect: 'నేరుగా అమ్మండి',
    learn: 'నేర్చుకోండి',
    expertHelp: 'నిపుణుల సహాయం',
    recentActivity: 'ఇటీవలి కార్యకలాపాలు',
    home: 'హోమ్',
    analytics: 'విశ్లేషణలు',
    alerts: 'హెచ్చరికలు',
    profile: 'ప్రొఫైల్'
  }
};
```

### client/src/hooks/use-voice.tsx
```typescript
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from './use-language';

// Speech Recognition type definitions
interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  lang: string;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

// Extend Window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

interface UseVoiceReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  confidence: number;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
  speak: (text: string) => void;
  isSpeaking: boolean;
}

export function useVoice(): UseVoiceReturn {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      
      // Set language based on current selection
      switch (currentLanguage) {
        case 'hindi':
          recognition.lang = 'hi-IN';
          break;
        case 'telugu':
          recognition.lang = 'te-IN';
          break;
        default:
          recognition.lang = 'en-IN';
      }

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const result = event.results[event.resultIndex];
        setTranscript(result[0].transcript);
        setConfidence(result[0].confidence);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setError(event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [currentLanguage]);

  const startListening = () => {
    if (!isSupported || !recognitionRef.current) return;
    
    setTranscript('');
    setError(null);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice language with fallbacks
    let targetLang = 'en-IN';
    switch (currentLanguage) {
      case 'hindi':
        targetLang = 'hi-IN';
        break;
      case 'telugu':
        targetLang = 'te-IN';
        break;
      default:
        targetLang = 'en-IN';
    }
    
    utterance.lang = targetLang;

    // Try to find a specific voice for the language
    const voices = speechSynthesis.getVoices();
    const targetVoice = voices.find(voice => 
      voice.lang.startsWith(targetLang.split('-')[0]) || 
      voice.lang === targetLang
    );
    
    if (targetVoice) {
      utterance.voice = targetVoice;
    } else if (currentLanguage === 'telugu') {
      // Fallback to Hindi for Telugu if no Telugu voice available
      const hindiVoice = voices.find(voice => voice.lang.startsWith('hi'));
      if (hindiVoice) {
        utterance.voice = hindiVoice;
        utterance.lang = 'hi-IN';
      }
    }

    utterance.rate = 0.9; // Slightly slower for better clarity
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.warn('Speech synthesis error:', event);
      setIsSpeaking(false);
    };

    speechSynthesis.speak(utterance);
  };

  return {
    isListening,
    isSupported,
    transcript,
    confidence,
    error,
    startListening,
    stopListening,
    toggleListening,
    speak,
    isSpeaking
  };
}
```

---

## Core UI Components

### client/src/components/language-selector.tsx
```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useLanguage, type Language } from "@/hooks/use-language";
import { LANGUAGES } from "@/lib/constants";

interface LanguageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LanguageSelector({ isOpen, onClose }: LanguageSelectorProps) {
  const { currentLanguage, setLanguage } = useLanguage();

  const handleLanguageSelect = (language: Language) => {
    setLanguage(language);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-farmer-green">
            Choose Your Language
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {Object.entries(LANGUAGES).map(([key, lang]) => (
            <Button
              key={key}
              onClick={() => handleLanguageSelect(key as Language)}
              className={`w-full justify-start text-left h-14 ${
                currentLanguage === key 
                  ? 'bg-farmer-green text-white' 
                  : 'bg-white text-farmer-green border border-farmer-green hover:bg-farmer-green hover:text-white'
              }`}
              variant={currentLanguage === key ? "default" : "outline"}
            >
              <Globe className="mr-3 h-5 w-5" />
              <div>
                <div className="font-medium">{lang.nativeName}</div>
                <div className="text-sm opacity-80">{lang.name}</div>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function InitialLanguageSelector() {
  const { isFirstVisit, setLanguage } = useLanguage();

  if (!isFirstVisit) return null;

  const handleLanguageSelect = (language: Language) => {
    setLanguage(language);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold text-farmer-green mb-6 text-center">
          Choose Your Language
        </h2>
        <div className="space-y-3">
          {Object.entries(LANGUAGES).map(([key, lang]) => (
            <Button
              key={key}
              onClick={() => handleLanguageSelect(key as Language)}
              className="w-full justify-start text-left h-14 bg-farmer-green text-white hover:bg-farmer-green-light"
            >
              <Globe className="mr-3 h-5 w-5" />
              <div>
                <div className="font-medium">{lang.nativeName}</div>
                <div className="text-sm opacity-90">{lang.name}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### client/src/components/voice-assistant.tsx
```typescript
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { useVoice } from "@/hooks/use-voice";
import { useLanguage } from "@/hooks/use-language";

export function VoiceAssistant() {
  const { 
    isListening, 
    isSupported, 
    transcript, 
    toggleListening, 
    speak, 
    isSpeaking 
  } = useVoice();
  const { t } = useLanguage();
  
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isSupported) return null;

  const handleSpeak = () => {
    speak(t('askAnything'));
  };

  return (
    <div className="fixed bottom-20 right-4 z-40">
      {isExpanded && (
        <div className="mb-4 bg-white rounded-lg shadow-lg p-4 w-64 border">
          <div className="text-sm text-gray-600 mb-2">
            {isListening ? t('listening') : t('pressToSpeak')}
          </div>
          {transcript && (
            <div className="text-sm bg-gray-50 p-2 rounded">
              {transcript}
            </div>
          )}
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={handleSpeak}
              disabled={isSpeaking}
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      <Button
        size="lg"
        className={`h-14 w-14 rounded-full shadow-lg ${
          isListening 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
            : 'bg-farmer-green hover:bg-farmer-green-dark'
        }`}
        onClick={() => {
          if (isExpanded) {
            toggleListening();
          } else {
            setIsExpanded(true);
          }
        }}
        onBlur={() => setIsExpanded(false)}
      >
        {isListening ? (
          <MicOff className="h-6 w-6 text-white" />
        ) : (
          <Mic className="h-6 w-6 text-white" />
        )}
      </Button>
    </div>
  );
}
```

---

## Main Application Structure

### client/src/App.tsx
```typescript
import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/hooks/use-language";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

import { Header } from "@/components/header";
import { VoiceAssistant } from "@/components/voice-assistant";
import { BottomNavigation } from "@/components/bottom-navigation";
import { InitialLanguageSelector } from "@/components/language-selector";

import { HomePage } from "@/pages/home";
import { PlantDoctorPage } from "@/pages/plant-doctor";
import { WeatherPage } from "@/pages/weather";
import { MarketPage } from "@/pages/market";
import { SellDirectPage } from "@/pages/sell-direct";
import { KnowledgeHubPage } from "@/pages/knowledge-hub";
import { ExpertConnectPage } from "@/pages/expert-connect";
import { AnalyticsPage } from "@/pages/analytics";
import { AlertsPage } from "@/pages/alerts";
import { ProfilePage } from "@/pages/profile";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="farmerz-theme">
        <LanguageProvider>
          <div className="min-h-screen bg-background">
            <Header />
            <main className="pb-16 pt-16">
              <Switch>
                <Route path="/" component={HomePage} />
                <Route path="/plant-doctor" component={PlantDoctorPage} />
                <Route path="/weather" component={WeatherPage} />
                <Route path="/market" component={MarketPage} />
                <Route path="/sell-direct" component={SellDirectPage} />
                <Route path="/learn" component={KnowledgeHubPage} />
                <Route path="/expert-help" component={ExpertConnectPage} />
                <Route path="/analytics" component={AnalyticsPage} />
                <Route path="/alerts" component={AlertsPage} />
                <Route path="/profile" component={ProfilePage} />
              </Switch>
            </main>
            <BottomNavigation />
            <VoiceAssistant />
            <InitialLanguageSelector />
            <Toaster />
          </div>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
```

---

## Configuration Files

### package.json
```json
{
  "name": "rest-express",
  "version": "1.0.0",
  "description": "",
  "main": "server/index.ts",
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build",
    "preview": "vite preview",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@hookform/resolvers": "^3.3.4",
    "@neondatabase/serverless": "^0.9.0",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-aspect-ratio": "^1.0.3",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-collapsible": "^1.0.3",
    "@radix-ui/react-context-menu": "^2.1.5",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-hover-card": "^1.0.7",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-menubar": "^1.0.4",
    "@radix-ui/react-navigation-menu": "^1.1.4",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-radio-group": "^1.1.3",
    "@radix-ui/react-scroll-area": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slider": "^1.1.2",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-toggle": "^1.0.3",
    "@radix-ui/react-toggle-group": "^1.0.4",
    "@radix-ui/react-tooltip": "^1.0.7",
    "@tanstack/react-query": "^5.17.15",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "cmdk": "^0.2.1",
    "connect-pg-simple": "^9.0.1",
    "date-fns": "^3.3.1",
    "drizzle-orm": "^0.29.3",
    "drizzle-zod": "^0.5.1",
    "embla-carousel-react": "^8.0.0",
    "express": "^4.18.2",
    "express-session": "^1.18.0",
    "framer-motion": "^11.0.5",
    "input-otp": "^1.2.4",
    "lucide-react": "^0.323.0",
    "memorystore": "^1.6.7",
    "next-themes": "^0.2.1",
    "passport": "^0.7.0",
    "passport-local": "^1.0.0",
    "react": "^18.2.0",
    "react-day-picker": "^8.10.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.49.3",
    "react-icons": "^5.0.1",
    "react-resizable-panels": "^2.0.12",
    "recharts": "^2.12.0",
    "tailwind-merge": "^2.2.1",
    "tailwindcss-animate": "^1.0.7",
    "tsx": "^4.7.0",
    "vaul": "^0.9.0",
    "wouter": "^3.0.0",
    "ws": "^8.16.0",
    "zod": "^3.22.4",
    "zod-validation-error": "^3.0.0"
  },
  "devDependencies": {
    "@types/connect-pg-simple": "^7.0.3",
    "@types/express": "^4.17.21",
    "@types/express-session": "^1.17.10",
    "@types/node": "^20.11.16",
    "@types/passport": "^1.0.16",
    "@types/passport-local": "^1.0.38",
    "@types/react": "^18.2.55",
    "@types/react-dom": "^18.2.19",
    "@types/ws": "^8.5.10",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.17",
    "drizzle-kit": "^0.20.14",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.3.3",
    "vite": "^5.1.0"
  }
}
```

### tailwind.config.ts
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./client/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "farmer-green": "#22c55e",
        "farmer-green-light": "#4ade80",
        "farmer-green-dark": "#16a34a",
        "farmer-brown": "#a3a3a3",
        "farmer-orange": "#f97316",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

### vite.config.ts
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@shared": path.resolve(__dirname, "./shared"),
      "@assets": path.resolve(__dirname, "./client/src/assets"),
    },
  },
  root: "./client",
  build: {
    outDir: "../dist/client",
    emptyOutDir: true,
  },
});
```

---

## Key Implementation Notes

### 1. **Multi-Language Architecture**
- Centralized translation system with context provider
- Local storage persistence for user language preference
- Voice recognition and synthesis support for all languages
- Fallback mechanisms for unsupported Telugu voices

### 2. **Database Design**
- PostgreSQL with Drizzle ORM for type safety
- Comprehensive schema supporting all agricultural features
- UUID-based primary keys for better scalability
- Nullable fields handled properly in storage layer

### 3. **Voice System**
- Web Speech API integration with fallbacks
- Enhanced error handling for speech synthesis
- Voice selection algorithm with language preferences
- Support for speech recognition in local languages

### 4. **Mobile-First Design**
- Touch-optimized interface (44px minimum touch targets)
- Bottom navigation for thumb accessibility
- Responsive breakpoints for various screen sizes
- Progressive Web App ready architecture

### 5. **Performance Optimizations**
- TanStack Query for efficient server state management
- Component lazy loading with React.lazy
- Image optimization and caching strategies
- Minimal bundle size with tree shaking

This reference document covers all the essential code implementations for the FarmerZ platform. Use it as a foundation for continued development and feature expansion.