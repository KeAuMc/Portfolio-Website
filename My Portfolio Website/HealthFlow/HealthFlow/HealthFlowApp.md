# Overview

This is a healthcare appointment booking application called "MedConnect" built as a full-stack web application. The system allows patients and caregivers to schedule appointments with healthcare providers through an intuitive mobile-first interface. The application features provider search, appointment scheduling with date/time selection, appointment management, and accessibility features including high contrast mode.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system variables for consistent theming
- **State Management**: 
  - Zustand for client-side state (appointment booking flow, authentication)
  - TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Data Validation**: Shared Zod schemas between client and server
- **Development**: Hot module replacement via Vite integration

## Data Storage
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema**: Defined in shared TypeScript files for consistency
- **Migrations**: Drizzle Kit for database schema management
- **Connection**: Neon Database serverless PostgreSQL

## Key Features
- **Multi-step Appointment Booking**: Provider selection → Date/time selection → Confirmation
- **Provider Search**: Filter by specialty and search by name
- **Accessibility**: High contrast toggle, keyboard navigation, ARIA labels
- **Mobile-first Design**: Responsive layout optimized for mobile devices
- **Progress Tracking**: Visual progress indicators during booking flow

## External Dependencies

- **Database**: Neon Database (serverless PostgreSQL)
- **UI Components**: Radix UI primitives for accessible components
- **Fonts**: Google Fonts (Inter, Architects Daughter, DM Sans, Fira Code, Geist Mono)
- **Development Tools**: Replit-specific plugins for development environment integration
- **Session Management**: PostgreSQL-based session storage with connect-pg-simple

The application follows a mobile-first approach with a clean, healthcare-appropriate design system emphasizing accessibility and user experience. The architecture supports both development and production environments with proper build processes and database migrations.