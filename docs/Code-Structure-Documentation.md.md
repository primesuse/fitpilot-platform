# FitPilot Platform - Code Structure Documentation
## Current Implementation Status as of Week 8

### Project Overview
The FitPilot platform is built using Next.js 15 with TypeScript, implementing a comprehensive fitness management system for Personal Trainers and their clients. The codebase follows modern React patterns with server-side rendering and API routes.

---
## 1. Project Structure

fitpilot-platform/
├── prisma/
│ ├── schema.prisma ✅ # Database schema definition
│ ├── migrations/ ✅ # Database migration files
│ └── dev.db ✅ # SQLite database file
├── src/
│ ├── app/ # Next.js 15 App Router
│ │ ├── api/ ✅ # API routes
│ │ ├── pt/ ✅ # PT-specific pages
│ │ ├── client/ ✅ # Client-specific pages
│ │ ├── login/ ✅ # Authentication pages
│ │ └── page.tsx ✅ # Home page
│ ├── components/ ✅ # Reusable React components
│ ├── lib/ ✅ # Utility libraries and configurations
│ └── types/ ⚠️ # TypeScript type definitions (partial)
├── public/ ✅ # Static assets
├── .env ✅ # Environment variables
├── package.json ✅ # Dependencies and scripts
├── tailwind.config.js ✅ # Tailwind CSS configuration
└── tsconfig.json ✅ # TypeScript configuration

text

---
## 2. Database Layer (Prisma)

### 2.1 Schema Definition ✅ IMPLEMENTED
**File**: `prisma/schema.prisma`
// Core models implemented:
model PersonalTrainer {
id String @id @default(uuid())
name String
email String @unique
passwordHash String
subscriptionTier String @default("Solo")
// ... relationships
}

model Client {
id String @id @default(uuid())
trainerId String
name String
email String @unique
passwordHash String
// ... additional fields needed
}

model Exercise {
id String @id @default(uuid())
trainerId String
name String
description String?
videoUrl String?
}

model WorkoutProgram {
id String @id @default(uuid())
name String
clientId String
// ... workout structure
}

text

### 2.2 Database Utilities ✅ IMPLEMENTED
**File**: `src/lib/prisma.ts`
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

text

---
## 3. Authentication System

### 3.1 NextAuth Configuration ✅ IMPLEMENTED
**File**: `src/lib/auth.ts`
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
providers: [
CredentialsProvider({
// Custom credentials provider for PT/Client authentication
// Supports role-based authentication
})
],
session: { strategy: "jwt" },
callbacks: {
// JWT and session callbacks for role management
}
}

text

### 3.2 Auth Route Handler ✅ IMPLEMENTED
**File**: `src/app/api/auth/[...nextauth]/route.ts`
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

text

### 3.3 Registration API ✅ IMPLEMENTED
**File**: `src/app/api/auth/register/route.ts`
- Handles PT registration with password hashing
- Email uniqueness validation
- Client registration through invitation system

---
## 4. API Routes Structure

### 4.1 Client Management APIs ✅ IMPLEMENTED
**File**: `src/app/api/clients/route.ts`
- GET: List trainer's clients
- POST: Create new client (invitation system)

**File**: `src/app/api/clients/invite/route.ts` ✅
- POST: Send client invitation emails
- Generates temporary passwords
- Email template integration

### 4.2 Exercise Management APIs ✅ IMPLEMENTED
**File**: `src/app/api/exercises/route.ts`
- GET: List trainer's exercises
- POST: Create new exercise
- PUT: Update existing exercise  
- DELETE: Remove exercise (with safety checks)

### 4.3 Program Management APIs ✅ IMPLEMENTED
**File**: `src/app/api/programs/route.ts`
- POST: Save workout programs to database
- GET: Retrieve saved programs
- Supports 7-day program structure with exercise parameters

### 4.4 Food Search API ✅ IMPLEMENTED
**File**: `src/app/api/food/search/route.ts`
- GET: Search USDA food database
- Returns nutritional information (calories, macros)
- Supports meal plan creation

### 4.5 Debug APIs ✅ IMPLEMENTED
**File**: `src/app/api/debug/users/route.ts`
- Development utility for user management
- Database inspection and testing

---
## 5. Frontend Pages Structure

### 5.1 Public Pages ✅ IMPLEMENTED

#### Home Page
**File**: `src/app/page.tsx`
- Landing page with platform overview
- Call-to-action for registration

#### Authentication
**File**: `src/app/login/page.tsx`
- Unified login form for PT/Client
- Role selection and validation
- NextAuth integration

### 5.2 PT Dashboard Pages ✅ IMPLEMENTED

#### Main Dashboard
**File**: `src/app/pt/dashboard/page.tsx`
- Client list with stats
- Invitation system
- Quick action buttons
- Revenue and engagement metrics

#### Exercise Library
**File**: `src/app/pt/library/exercises/page.tsx`
- Exercise CRUD interface
- Video URL management
- Search and filtering capabilities

#### Program Builder
**File**: `src/app/pt/library/templates/workouts/page.tsx`
- Drag-and-drop workout creation
- 7-day program grid
- Exercise parameter configuration
- Save programs to database

#### Meal Plan Builder
**File**: `src/app/pt/library/meal-plans/page.tsx` ⚠️ PARTIALLY IMPLEMENTED
- USDA food database search
- Meal plan creation interface
- Calorie and macro calculations
- Save functionality in progress

### 5.3 Client Dashboard Pages ✅ PARTIALLY IMPLEMENTED

#### Client Dashboard
**File**: `src/app/client/dashboard/page.tsx`
- Basic client information
- Trainer details
- Account overview

---
## 6. Component Library

### 6.1 UI Components ✅ IMPLEMENTED

#### Navigation
**File**: `src/components/Navbar.tsx`
- Role-based navigation menu
- Authentication state management
- Responsive design

#### Modals
**File**: `src/components/InviteClientModal.tsx` ✅
- Client invitation interface
- Form validation
- Email integration

**File**: `src/components/AddExerciseModal.tsx` ✅
- Exercise creation form
- Video URL input
- Validation and error handling

**File**: `src/components/EditExerciseModal.tsx` ✅
- Exercise editing interface
- Pre-populated form data
- Update functionality

### 6.2 Specialized Components ✅ IMPLEMENTED

#### Exercise Management
**File**: `src/components/ExerciseManagement.tsx`
- Exercise list display
- CRUD operations interface
- Search and filtering

#### Program Builder
**File**: `src/components/ProgramBuilderInterface.tsx` ✅
- Drag-and-drop program creation
- 7-day workout grid
- Exercise parameter editing
- Real-time statistics

**File**: `src/components/DraggableExercise.tsx` ✅
- Draggable exercise components
- @dnd-kit integration
- Visual feedback during drag operations

**File**: `src/components/DroppableWorkoutDay.tsx` ✅
- Workout day containers
- Exercise dropping zones
- Parameter editing interface

#### Meal Planning
**File**: `src/components/FoodSearch.tsx` ✅
- USDA food database search
- Nutritional information display
- Food selection interface

**File**: `src/components/MealPlanBuilderInterface.tsx` ✅
- Meal plan creation
- Food selection and tracking
- Calorie and macro summaries

---
## 7. Utility Libraries

### 7.1 Database Connection ✅ IMPLEMENTED
**File**: `src/lib/prisma.ts`
- Prisma client configuration
- Connection management
- Development/production setup

### 7.2 Authentication Configuration ✅ IMPLEMENTED
**File**: `src/lib/auth.ts`
- NextAuth options configuration
- JWT strategy setup
- Role-based callbacks

---
## 8. Configuration Files

### 8.1 TypeScript Configuration ✅ IMPLEMENTED
**File**: `tsconfig.json`
- Next.js optimized TypeScript settings
- Path aliases configuration
- Strict type checking enabled

### 8.2 Tailwind CSS Configuration ✅ IMPLEMENTED
**File**: `tailwind.config.js`
- Custom color palette
- Component classes
- Responsive breakpoints

### 8.3 Package Dependencies ✅ IMPLEMENTED
**File**: `package.json`
Key dependencies:
- `next: 15.4.2` - React framework
- `@prisma/client` - Database ORM
- `next-auth` - Authentication
- `@dnd-kit/*` - Drag and drop functionality
- `bcryptjs` - Password hashing
- `tailwindcss` - Styling framework

---
## 9. Environment Configuration ✅ IMPLEMENTED

### 9.1 Environment Variables
**File**: `.env`
Database
DATABASE_URL="file:./dev.db"

Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

External APIs
USDA_API_KEY="your-usda-api-key"

Email (future implementation)
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASS=""

text

---
## 10. Current Implementation Status

### ✅ FULLY IMPLEMENTED FEATURES
1. **Authentication System**: Complete PT/Client role-based auth
2. **Database Layer**: Prisma schema with core tables
3. **PT Dashboard**: Client management, statistics, invitations
4. **Exercise Library**: Full CRUD operations with video support
5. **Workout Program Builder**: Drag-and-drop with 7-day grid and database saving
6. **Meal Plan Builder**: USDA food search and basic plan creation
7. **Client Dashboard**: Basic profile and trainer information
8. **Responsive UI**: Tailwind CSS with mobile-friendly design

### ⚠️ PARTIALLY IMPLEMENTED FEATURES
1. **Meal Plan Saving**: API endpoint needs completion
2. **Client Profile Management**: Extended fields needed
3. **Program Editing**: Load and edit existing programs
4. **Type Definitions**: Comprehensive TypeScript types needed

### 🔲 NOT IMPLEMENTED FEATURES
1. **Subscription System**: Stripe integration and payment processing
2. **Progress Photo System**: File upload and comparison tools
3. **Calendar & Booking**: Availability management and booking requests
4. **Messaging System**: Real-time communication between PT and clients
5. **Achievement System**: Gamification and milestone tracking
6. **File Storage**: AWS S3 or Cloudinary integration
7. **Email System**: SMTP configuration and templates
8. **AI Integration**: OpenAI API for program suggestions

---
## 11. Development Commands

### Available Scripts
Development
npm run dev # Start development server
npm run build # Build for production
npm run start # Start production server

Database
npx prisma generate # Generate Prisma client
npx prisma migrate dev # Run database migrations
npx prisma studio # Open database GUI

Code Quality
npm run lint # Run ESLint
npm run lint:fix # Fix ESLint issues

text

### Common Development Workflow
1. Make code changes
2. Test with `npm run dev`
3. Update database schema if needed with `npx prisma migrate dev`
4. Build and test with `npm run build`
5. Commit changes to Git

---
## 12. Next Development Steps

### Immediate Priorities (Week 8-9)
1. **Implement Stripe subscription system**
2. **Add subscription enforcement middleware**
3. **Create enhanced client profile management**
4. **Add client removal functionality**
5. **Implement progress photo upload system**

### File Structure for New Features
src/
├── app/api/
│ ├── subscription/ # Stripe subscription management
│ ├── photos/ # Progress photo handling
│ └── calendar/ # Booking system APIs
├── components/
│ ├── SubscriptionGate.tsx # Subscription enforcement
│ ├── PhotoUpload.tsx # Progress photo upload
│ ├── PhotoComparison.tsx # Week-by-week comparison
│ └── CalendarWidget.tsx # Booking interface
└── lib/
├── stripe.ts # Stripe configuration
├── storage.ts # File upload utilities
└── calendar.ts # Calendar utilities

text

This code structure documentation provides a comprehensive overview of the current FitPilot platform implementation, allowing any developer to understand the existing codebase and continue development from the current state.