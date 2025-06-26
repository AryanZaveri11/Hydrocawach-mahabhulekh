# Bharat Bhulekh - Land Records Portal

## Overview

Bharat Bhulekh is a comprehensive land records management system designed to provide Indian citizens with access to various land documents including 7/12 extracts, 8A extracts, Property Cards, and K-Prat documents. The application serves as a digital portal for land record verification and retrieval across Indian states and union territories.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Style**: RESTful APIs with JSON responses
- **Development Server**: Custom Vite middleware integration

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon Database
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **In-Memory Storage**: Fallback MemStorage class for development/testing

## Key Components

### Database Schema
The application uses a hierarchical geographical structure:
- **States**: Top-level administrative divisions
- **Districts**: Secondary administrative divisions within states
- **Talukas**: Sub-district administrative units
- **Villages**: Village-level administrative units
- **Land Records**: Individual property records with ownership details

### API Endpoints
- `GET /api/states` - Retrieve all states
- `GET /api/states/:id/districts` - Get districts by state
- `GET /api/districts/:id/talukas` - Get talukas by district
- `GET /api/talukas/:id/villages` - Get villages by taluka
- Land record search and retrieval endpoints

### UI Components
- **Interactive India Map**: Visual state selection interface
- **Multi-step Form**: Cascading dropdowns for geographical selection
- **Multilingual Support**: 22+ Indian languages supported
- **Responsive Design**: Mobile-first responsive layout
- **Government Theme**: Official Indian government color scheme

## Data Flow

1. **User Interface**: Users interact with the form to select geographical hierarchy
2. **API Requests**: Frontend makes cascading API calls based on user selections
3. **Database Queries**: Backend queries PostgreSQL through Drizzle ORM
4. **Data Transformation**: Raw data is validated and transformed using Zod schemas
5. **Response Handling**: TanStack Query manages caching and state updates
6. **UI Updates**: React components re-render with fetched data

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React, React DOM, React Hook Form
- **UI Libraries**: Radix UI primitives, Lucide React icons
- **State Management**: TanStack Query
- **Validation**: Zod with Drizzle Zod integration
- **Styling**: Tailwind CSS, class-variance-authority, clsx
- **Utilities**: date-fns, embla-carousel-react

### Backend Dependencies
- **Core**: Express.js, TypeScript execution with tsx
- **Database**: Drizzle ORM, Neon Database serverless client
- **Session**: connect-pg-simple for PostgreSQL session storage
- **Build**: esbuild for production bundling

### Development Dependencies
- **Build Tools**: Vite, PostCSS, Autoprefixer
- **TypeScript**: Full TypeScript support with strict configuration
- **Development**: Replit-specific plugins and error handling

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20 with Replit modules
- **Database**: PostgreSQL 16 module
- **Port Configuration**: Internal port 5000, external port 80
- **Hot Reload**: Vite HMR with custom Express middleware

### Production Build
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Deployment**: Autoscale deployment target on Replit
- **Environment**: Production environment variable handling

### Database Management
- **Migrations**: Drizzle Kit manages schema migrations
- **Connection**: Environment-based DATABASE_URL configuration
- **Schema**: Shared schema definitions between client and server

## Changelog

Changelog:
- June 26, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.