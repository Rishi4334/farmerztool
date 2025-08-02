# Overview

This is a comprehensive farmer-focused mobile web application called "FarmerZ" built with React and Express.js. The app provides essential agricultural tools including AI-powered plant disease detection, weather forecasting, market price tracking, direct selling capabilities, educational resources, and expert consultation services. The application features multi-language support (English, Hindi, Telugu) with voice assistance capabilities, designed specifically for farmers in India.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React SPA**: Built with React 18 using TypeScript and Vite for fast development and building
- **Routing**: Client-side routing implemented with Wouter for lightweight navigation
- **UI Framework**: Shadcn/ui component library with Radix UI primitives and Tailwind CSS for responsive design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Mobile-First Design**: Touch-optimized interface with bottom navigation and gesture-friendly components

## Backend Architecture
- **Express.js Server**: RESTful API server with middleware for logging and error handling
- **Development Setup**: Vite integration for hot module replacement during development
- **Storage Layer**: Abstracted storage interface supporting both in-memory and database implementations
- **Session Management**: PostgreSQL session store with connect-pg-simple

## Data Layer
- **Database**: PostgreSQL with Neon serverless database
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Comprehensive schema including users, crops, disease detections, listings, and market prices
- **Migrations**: Drizzle Kit for database schema management and migrations

## Key Features Architecture
- **Multi-language Support**: Context-based language switching with localStorage persistence
- **Voice Integration**: Web Speech API for voice commands and text-to-speech functionality
- **Plant Disease Detection**: Image upload and AI analysis simulation for crop disease identification
- **Market Integration**: Real-time price tracking and trend analysis for agricultural commodities
- **Direct Sales Platform**: Farmer-to-buyer marketplace with listing management

## Authentication & User Management
- **User System**: UUID-based user identification with username/password authentication
- **Profile Management**: Multi-language user profiles with location and contact information
- **Session Persistence**: Secure session management with PostgreSQL backing

## Mobile Optimization
- **Touch Interface**: Large touch targets and gesture-friendly interactions
- **Voice Assistant**: Always-available voice commands for accessibility
- **Offline Considerations**: Service worker ready architecture for progressive web app features
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting for production data storage
- **Drizzle ORM**: Type-safe database operations and schema management

## Development Tools
- **Vite**: Frontend build tool with hot module replacement
- **TypeScript**: Static type checking across the entire application
- **ESLint & Prettier**: Code quality and formatting tools

## UI Libraries
- **Radix UI**: Accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Icon library for consistent iconography

## Runtime Dependencies
- **React Query**: Server state management and caching
- **React Hook Form**: Form validation and management
- **Date-fns**: Date manipulation and formatting
- **Zod**: Runtime type validation and schema parsing

## Voice & Accessibility
- **Web Speech API**: Browser-native speech recognition and synthesis
- **ARIA Standards**: Accessibility compliance through Radix UI components

## Build & Deployment
- **ESBuild**: Fast JavaScript bundling for production builds
- **PostCSS**: CSS processing with Tailwind CSS compilation
- **Node.js**: Server runtime environment