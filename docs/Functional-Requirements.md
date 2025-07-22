# Functional Requirements Specification
## AI-Assisted Fitness Platform for Personal Trainers (FitPilot)

### Executive Summary
This document outlines the comprehensive functional requirements for an all-in-one fitness platform designed for Personal Trainers (PTs) and their clients. The platform combines AI-powered assistance, comprehensive workout and nutrition management, progress tracking, integrated payments, and business management tools into a single, cohesive web application.

### Platform Overview
- **Target Users**: Personal Trainers and their clients
- **Platform Type**: Web-based SaaS application
- **Core Technology**: AI integration via ChatGPT API, real-time messaging, integrated payments
- **Business Model**: Subscription-based for PTs with integrated client payment processing

## Shared Features (Both PT and Client Interfaces)

### User Authentication and Profiles
- **Secure Login System**
  - Email/password authentication with NextAuth.js ✅ COMPLETED
  - Social login options (Google, Facebook)
  - Password reset functionality
  - Two-factor authentication (optional)
- **User Profiles**
  - Name, photo, bio, contact details
  - Role-based access control (PT vs Client) ✅ COMPLETED
  - Privacy settings and data management
  - **Client Extended Profile**: Age, height, weight, body fat percentage, phone number, profile picture

### AI Helper Widget
- **Location**: Floating chat icon in bottom-right corner of every page
- **Functionality**:
  - Powered by ChatGPT API for real-time Q&A
  - Pre-prompted for safe, non-medical advice
  - Suggests consulting PT for personalized guidance
  - Conversation logging for PT review (optional)

### Inbuilt Messaging System
- **Real-time Chat**: One-on-one communication between client and PT
- **Features**:
  - Text messages with emoji support
  - File attachments (photos, videos, documents)
  - Read receipts and typing indicators
  - Message history and search
  - Push notifications for new messages
- **Group Messaging**: PTs can send announcements to all clients

### Subscription and Payment System ⚠️ NEEDS IMPLEMENTATION
- **PT Subscription Enforcement**: 
  - PTs must have active subscription to access platform features
  - Subscription tiers: Solo, Studio, Enterprise
  - Payment gateway integration with Stripe
- **Payment Processor**: Stripe integration for secure transactions
- **Payment Flows**:
  - **PT-to-Platform**: Subscription fees (primary)
  - **Client-to-PT**: Direct payment for sessions/packages
- **Features**:
  - Automatic invoice generation
  - Payment history and receipts
  - Failed payment retry logic
  - Subscription management and billing

### Calendar and Scheduling System ⚠️ NEEDS IMPLEMENTATION
- **PT Calendar Dashboard**:
  - View all booked sessions with client details
  - Set availability slots and time blocks
  - Session management and notes
- **Client Booking System**:
  - View PT's available time slots
  - Request booking with preferred times
  - PT approval/denial workflow
- **Shared Features**:
  - Day, week, month calendar views
  - Automated reminders (24hrs, 2hrs before)
  - Rescheduling and cancellation management
  - Google Calendar sync integration

### Achievement System
- **Standard Achievements**:
  - New personal bests (weight, reps, endurance)
  - Weight loss/gain milestones
  - Body fat percentage targets
  - Consistency streaks (workouts, check-ins)
- **Fun Achievements** (Gamification):
  - "You lifted 25 pandas this month!" (weight equivalents)
  - "You burned enough calories to power a small spaceship!"
- **Features**:
  - Pop-up banner notifications ✅ COMPLETED
  - Achievement gallery and history
  - Social sharing capabilities

## Personal Trainer Interface Requirements

### PT Dashboard Overview ✅ COMPLETED
- **Client Management**:
  - Searchable client list with photos and status indicators ✅ COMPLETED
  - Quick stats: last check-in, program compliance, payment status
  - Client progress summary cards
  - **Client Status Tracking**: Invited, Registered, Active
- **Business Metrics**:
  - Monthly revenue tracking
  - Client retention rates
  - Session completion rates
- **Quick Actions**:
  - "Invite New Client" button ✅ COMPLETED
  - "View Calendar" shortcut ⚠️ NEEDS IMPLEMENTATION
  - "Remove Client" functionality ⚠️ NEEDS IMPLEMENTATION

### Enhanced Client Profile Management ⚠️ PARTIALLY COMPLETED
**Comprehensive Client Profile View**:

#### Overview Tab ⚠️ NEEDS ENHANCEMENT
- **Client Stats Dashboard**:
  - Current weight, BMI, body fat percentage
  - Starting weight vs current weight comparison
  - Next scheduled booking
  - Recent activity summary
  - Profile completion status
- **Quick Actions**:
  - Edit client profile
  - View progress photos
  - Assign new programs/meal plans
  - Remove client (with confirmation)

#### Workout Program Tab ✅ COMPLETED - NEEDS EDITING CAPABILITY
- **Program Builder Interface**: ✅ COMPLETED
  - Drag-and-drop program creation
  - Exercise parameters (sets, reps, rest periods)
  - 7-day workout grid
  - Save programs to database
- **Program Management**: ⚠️ NEEDS IMPLEMENTATION
  - View all client's existing programs
  - Edit existing workout programs
  - Program history and versioning
  - Copy programs between clients

#### Meal Plan Tab ✅ PARTIALLY COMPLETED - NEEDS EDITING CAPABILITY
- **Food Database Integration**: ✅ COMPLETED
  - USDA food database search
  - Accurate calories/macros calculation
  - Meal plan creation interface
- **Meal Plan Management**: ⚠️ NEEDS IMPLEMENTATION
  - View all client's existing meal plans
  - Edit existing meal plans
  - Meal plan history and templates
  - Copy meal plans between clients

#### Progress & Check-ins Tab ⚠️ NEEDS IMPLEMENTATION
- **Progress Photo Management**:
  - View client's progress photos (front, side, back)
  - Week-by-week comparison tool
  - Side-by-side progress comparison (Week 1 vs Week 10)
  - Photo timeline and progress tracking
- **Check-in Management**:
  - Review weekly questionnaire responses
  - Check-in history and trends
- **Measurement Tracking**:
  - Body measurements and skinfold data
  - Weight tracking charts
  - Body fat percentage calculations

### Content Management ✅ PARTIALLY COMPLETED
- **Exercise Library**: ✅ COMPLETED
  - Personal exercise video collection
  - Upload, edit, and delete exercises
  - Exercise CRUD operations with video URLs
- **Program Templates**:
  - Save workout programs as reusable templates ✅ COMPLETED
  - Quick assignment to multiple clients ⚠️ NEEDS IMPLEMENTATION

### Business Management Tools ⚠️ NEEDS IMPLEMENTATION
- **Client Removal System**:
  - Remove client functionality with data retention options
  - Transfer client to another PT
  - Export client data before removal
- **Subscription Management**:
  - View current subscription status
  - Upgrade/downgrade subscription tiers
  - Payment history and invoicing

## Client Interface Requirements

### Client Dashboard ✅ COMPLETED
- **Personal Stats Display**:
  - Current weight and progress metrics
  - BMR calculation
  - Target daily calories
- **Extended Profile Management**: ⚠️ NEEDS IMPLEMENTATION
  - Age, height, weight, body fat percentage
  - Phone number and contact details
  - Profile picture upload and management

### Progress Tracking System ⚠️ NEEDS IMPLEMENTATION
- **Progress Photo System**:
  - Upload progress photos (front, side, back views)
  - Photo comparison tool (Week X vs Week Y)
  - Timeline slider for historical view
  - Photo-taking guidance and examples
- **Self-Comparison Features**:
  - Side-by-side week comparison
  - Progress timeline visualization
  - Achievement milestones based on photos

### Booking and Calendar Features ⚠️ NEEDS IMPLEMENTATION
- **Session Booking System**:
  - View PT's available time slots
  - Request booking with preferred times
  - Booking confirmation and reminders
- **Calendar Integration**:
  - Personal calendar view
  - Upcoming sessions display
  - Rescheduling capabilities

### Workout Experience ✅ COMPLETED
- **Program Viewing**: Can view assigned workout programs
- **Live Workout Interface**: ⚠️ NEEDS IMPLEMENTATION
  - Step-by-step exercise guidance
  - Set-by-set logging functionality
  - Progress tracking and PR notifications

### Nutrition Management ✅ PARTIALLY COMPLETED
- **Meal Plan Display**: Basic meal plan viewing capability
- **Enhanced Features**: ⚠️ NEEDS IMPLEMENTATION
  - Daily meal tracking
  - Grocery list generation
  - Macro target monitoring

## Technical Requirements

### Performance
- **Response Times**: Page loads under 2 seconds
- **Uptime**: 99.9% availability target
- **Scalability**: Support for 10,000+ concurrent users

### Security ✅ PARTIALLY COMPLETED
- **Data Encryption**: All data encrypted in transit and at rest
- **Authentication**: Secure password hashing with bcrypt ✅ COMPLETED
- **Role-based Access Control**: PT vs Client permissions ✅ COMPLETED
- **Subscription Access Control**: ⚠️ NEEDS IMPLEMENTATION

### Integration Requirements
- **Payment Processing**: Stripe API integration ⚠️ NEEDS IMPLEMENTATION
- **AI Services**: OpenAI GPT API (planned)
- **Food Database**: USDA food database ✅ COMPLETED
- **File Storage**: AWS S3 for progress photos ⚠️ NEEDS IMPLEMENTATION
- **Calendar Sync**: Google Calendar API ⚠️ NEEDS IMPLEMENTATION

## Development Status Summary

### ✅ COMPLETED FEATURES
- Basic authentication system (PT/Client roles)
- PT Dashboard with client list
- Client invitation system
- Exercise Library with CRUD operations
- Workout Program Builder (drag-and-drop)
- Meal Plan Builder with USDA food search
- Basic client dashboard
- Database schema implementation

### ⚠️ IN PROGRESS
- Meal plan saving functionality
- Program editing capabilities

### 🔲 NEEDS IMPLEMENTATION
- Subscription payment system
- Calendar and booking system
- Progress photo upload and comparison
- Client removal functionality
- Enhanced client profiles
- Program/meal plan editing for existing items
- Session booking workflow
- Achievement system backend
