# Overview

This is a full-stack web application called "Professor AI" - an intelligent teaching companion that provides personalized educational support. The application features a modern landing page with sections for features, testimonials, pricing, and contact information. It's built as a single-page application with a React frontend and Express.js backend, designed to showcase an AI-powered educational platform.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side is built with **React 18** using TypeScript and follows a component-based architecture:

- **UI Framework**: Uses shadcn/ui components built on top of Radix UI primitives for consistent, accessible design
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and data fetching
- **Build Tool**: Vite for fast development and optimized production builds
- **3D Graphics**: Three.js integration for animated background elements

The frontend follows a modular structure with reusable UI components, custom hooks, and organized page sections.

## Backend Architecture
The server-side uses **Node.js with Express.js** in a RESTful API pattern:

- **Framework**: Express.js with TypeScript support
- **Development**: tsx for running TypeScript directly in development
- **Production**: esbuild for bundling the server code
- **Storage Interface**: Abstracted storage layer with in-memory implementation (MemStorage class)
- **API Prefix**: All routes are prefixed with `/api`

The backend includes middleware for request logging, error handling, and JSON parsing.

## Data Storage Architecture
The application uses a **hybrid storage approach**:

- **Development/Demo**: In-memory storage using Map data structures for user data
- **Database Ready**: Drizzle ORM configured for PostgreSQL with schema definitions
- **Database Provider**: Neon Database (@neondatabase/serverless) for serverless PostgreSQL
- **Schema Management**: Drizzle Kit for database migrations and schema management

The storage interface is abstracted through the `IStorage` interface, allowing easy switching between implementations.

## Build and Deployment Strategy
The application uses a **monorepo structure** with shared code:

- **Shared Schema**: Common TypeScript types and Zod schemas in `/shared` directory
- **Client Build**: Vite builds the React app to `dist/public`
- **Server Build**: esbuild bundles the Express server to `dist/index.js`
- **Development**: Vite dev server with HMR integration and Express API proxy
- **Production**: Serves static files from Express with API routes

## Authentication Architecture
Currently implements a **basic user system**:

- User schema with username/password fields
- UUID primary keys with PostgreSQL's gen_random_uuid()
- Password storage (implementation details not shown in current codebase)
- Session management ready (connect-pg-simple for PostgreSQL sessions)

# External Dependencies

## UI and Styling
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives (@radix-ui/react-*)
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Lucide React**: Icon library for consistent iconography
- **Three.js**: 3D graphics library for animated background elements

## State Management and Data Fetching
- **TanStack Query**: Server state management, caching, and synchronization
- **React Hook Form**: Form state management with @hookform/resolvers
- **Wouter**: Lightweight routing library for React

## Database and ORM
- **Drizzle ORM**: Type-safe SQL ORM with PostgreSQL dialect
- **Neon Database**: Serverless PostgreSQL database provider
- **Drizzle Zod**: Integration between Drizzle and Zod for schema validation

## Development and Build Tools
- **Vite**: Fast build tool with React plugin and development server
- **TypeScript**: Static type checking throughout the application
- **ESBuild**: Fast JavaScript bundler for server-side code
- **tsx**: TypeScript execution for development

## Session and Security
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **nanoid**: Secure URL-friendly unique string ID generator

## Utilities and Helpers
- **clsx & tailwind-merge**: Conditional CSS class composition
- **date-fns**: Modern JavaScript date utility library
- **class-variance-authority**: Utility for creating variant-based component APIs