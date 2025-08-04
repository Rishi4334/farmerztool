# Project Overview

This is a full-stack JavaScript application being migrated from Replit Agent to Replit environment.

## Architecture
- **Frontend**: React with Vite, using TypeScript
- **Backend**: Express.js server with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Database**: Configured for Drizzle ORM with MySQL support
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for frontend routing

## Key Features
- Modern React with TypeScript
- Express backend API
- Drizzle ORM for database operations
- Radix UI components with shadcn
- Form handling with react-hook-form
- Authentication setup with Passport.js

## Project Structure
- `client/` - React frontend application
- `server/` - Express backend server
- `shared/` - Shared TypeScript schemas and types
- `components.json` - shadcn/ui configuration

## Development Setup
- Run `npm run dev` to start both frontend and backend
- Backend runs on Express with Vite integration
- Frontend served through Vite with HMR

## Recent Changes
- 2025-01-04: Started migration from Replit Agent to Replit environment
- 2025-01-04: Installing missing dependencies (cross-env)
- 2025-01-04: Migrated backend database from PostgreSQL to MySQL
  - Updated all table schemas to use MySQL syntax
  - Installed mysql2 client package
  - Modified UUID generation for MySQL compatibility

## User Preferences
- Prefers MySQL over PostgreSQL for backend database

## Migration Status
- ✅ Migration completed successfully
- ✅ All dependencies installed
- ✅ Project running on Replit
- ✅ Security practices verified