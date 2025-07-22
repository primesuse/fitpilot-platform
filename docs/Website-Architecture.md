# Website Architecture Sitemap
## AI-Assisted Fitness Platform (FitPilot)

**UPDATED**: July 23, 2025 - Reflects actual implementation status

### Legend
- **(P)** Public page
- **(PT)** Personal Trainer authenticated page
- **(C)** Client authenticated page
- **✅** Fully implemented and functional
- **⚠️** Partially implemented (backend ready, UI needs work)
- **🔲** Not implemented

---
## IMPLEMENTATION STATUS OVERVIEW

### ✅ FULLY IMPLEMENTED FEATURES
**Core Platform Infrastructure:**
- Complete authentication system with role-based access
- Subscription system with Stripe integration and trial management
- Exercise library with full CRUD operations
- Advanced workout program builder with drag-and-drop interface
- AFCD food database integration (8,500+ items)
- Meal plan builder with real-time nutrition calculations
- Client invitation and management system
- Responsive UI with professional component library

### ⚠️ BACKEND READY, UI PENDING
**Features with database schema implemented but missing user interfaces:**
- Progress photo upload and comparison system
- Body measurement tracking
- Weekly check-in questionnaire system
- Habit tracking dashboard
- Achievement notification system
- Enhanced client profile management

### 🔲 MISSING FEATURES REQUIRING DEVELOPMENT
**Core missing functionality:**
- BMR calculator and automatic calorie recommendations
- Educational content management system
- Supplement tracking and recommendations
- Calendar and booking system
- Real-time messaging between PT and clients
- Client removal functionality
- Advanced business analytics

---
## 1. Public-Facing Pages

| Path | Label | Type | Status | Implementation Notes |
|------|-------|------|--------|---------------------|
| `/` | Home | P | ✅ | Landing page with platform overview |
| `/login` | Login | P | ✅ | Complete NextAuth implementation with role selection |
| `/register` | PT Registration | P | ✅ | Full registration flow with email validation |
| `/privacy-policy` | Privacy Policy | P | 🔲 | Legal content needed |
| `/terms-of-service` | Terms of Service | P | 🔲 | Legal content needed |

---
## 2. Personal Trainer Interface

| Path | Label | Type | Status | Implementation Notes |
|------|-------|------|--------|---------------------|
| `/pt/dashboard` | PT Dashboard | PT | ✅ | Advanced client management, statistics, invitation system |
| `/pt/library/exercises` | Exercise Library | PT | ✅ | Complete CRUD operations, video URLs, search/filter |
| `/pt/library/templates/workouts` | Program Builder | PT | ✅ | Sophisticated drag-and-drop, 7-day grid, database save |
| `/pt/library/meal-plans` | Meal Plan Builder | PT | ⚠️ | AFCD food search working, save functionality incomplete |
| `/pt/business/subscription` | Subscription Management | PT | ✅ | Complete Stripe integration, trial management |
| `/pt/profile` | PT Profile | PT | ✅ | Profile editing with enhanced fields |
| `/pt/settings` | Account Settings | PT | ✅ | Notification preferences, password management |
| **Enhanced Client Management:** |  |  |  | **Backend ready, UI needed** |
| `/pt/clients/{id}` | Client Profile | PT | ⚠️ | Database schema complete, comprehensive UI needed |
| `/pt/clients/{id}/overview` | Client Overview | PT | 🔲 | Stats dashboard, BMR calculator, progress summary |
| `/pt/clients/{id}/programs` | Client Programs | PT | 🔲 | View/edit existing programs (edit functionality) |
| `/pt/clients/{id}/meals` | Client Meal Plans | PT | 🔲 | View/edit existing meal plans (edit functionality) |
| `/pt/clients/{id}/progress` | Client Progress | PT | ⚠️ | Photo comparison, measurements (UI needed) |
| **Missing Core Features:** |  |  |  | **Requires development** |
| `/pt/calendar` | PT Calendar | PT | 🔲 | Booking management, availability setting |
| `/pt/calendar/availability` | Set Availability | PT | 🔲 | Time slot management |
| `/pt/calendar/bookings` | Booking Requests | PT | 🔲 | Approve/deny client requests |
| `/pt/business/payments` | Payments & Invoicing | PT | 🔲 | Revenue tracking, payment history |
| `/pt/business/analytics` | Analytics | PT | 🔲 | Client metrics, business intelligence |

---
## 3. Client Interface

| Path | Label | Type | Status | Implementation Notes |
|------|-------|------|--------|---------------------|
| `/client/dashboard` | Client Dashboard | C | ✅ | Basic implementation - needs enhancement |
| `/client/settings` | Client Settings | C | ✅ | Notification preferences, password management |
| **Enhanced Profile Management:** |  |  |  | **Backend ready, UI needed** |
| `/client/profile` | Extended Profile | C | ⚠️ | Database fields exist (age, weight, body fat %), UI basic |
| `/client/profile/edit` | Edit Profile | C | 🔲 | Comprehensive profile editing interface needed |
| **Progress Tracking System:** |  |  |  | **Backend ready, UI needed** |
| `/client/progress` | Progress Tracking | C | ⚠️ | Database schema complete, upload UI needed |
| `/client/progress/photos` | Progress Photos | C | ⚠️ | Upload interface for front/side/back photos needed |
| `/client/progress/photos/compare` | Photo Comparison | C | ⚠️ | Week-by-week comparison tool needed |
| `/client/progress/measurements` | Body Measurements | C | ⚠️ | Weight, body fat, measurements tracking UI needed |
| `/client/check-in` | Weekly Check-in | C | ⚠️ | Questionnaire interface needed |
| **Program and Nutrition:** |  |  |  |  |
| `/client/workout` | Workout Overview | C | 🔲 | View assigned programs, workout logging |
| `/client/workout/session/{id}` | Live Workout | C | 🔲 | Exercise logging, timers, progress tracking |
| `/client/nutrition` | Nutrition & Meal Plans | C | ⚠️ | Basic meal plan viewing (needs enhancement) |
| **Missing Core Features:** |  |  |  | **Requires development** |
| `/client/booking` | Session Booking | C | 🔲 | PT availability viewing, booking requests |
| `/client/booking/request` | Book Session | C | 🔲 | Time selection, request submission |
| `/client/my-pt/messages` | Messages | C | 🔲 | Real-time chat with PT |
| `/client/my-pt/calendar` | My Sessions | C | 🔲 | Upcoming/past sessions view |
| `/client/education` | Educational Content | C | 🔲 | Learning materials, video library |

---
## 4. API Endpoints Status

### 4.1 ✅ FULLY IMPLEMENTED ENDPOINTS
| Endpoint | Method | Purpose | Implementation Status |
|----------|--------|---------|----------------------|
| `/api/auth/*` | ALL | NextAuth authentication system | ✅ Complete |
| `/api/exercises` | GET/POST/PUT/DELETE | Exercise CRUD operations | ✅ Complete |
| `/api/programs` | GET/POST | Workout program management | ✅ Complete |
| `/api/programs/[id]` | GET/PUT | Individual program operations | ✅ Complete |
| `/api/food/search` | GET | AFCD food database search | ✅ Complete |
| `/api/clients/invite` | POST | Client invitation system | ✅ Complete |
| `/api/subscription/status` | GET | Subscription status checking | ✅ Complete |
| `/api/subscription/create` | POST | Stripe checkout creation | ✅ Complete |
| `/api/settings/password` | PUT | Password change | ✅ Complete |
| `/api/settings/notifications` | GET/PUT | Notification preferences | ✅ Complete |

### 4.2 ⚠️ BACKEND READY, ENDPOINT INCOMPLETE
| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/meal-plans` | GET/POST/PUT/DELETE | Meal plan CRUD | ⚠️ Schema ready, needs completion |
| `/api/progress-photos` | GET/POST/DELETE | Photo upload/management | ⚠️ Schema ready, needs implementation |
| `/api/measurements` | GET/POST/PUT | Body measurement tracking | ⚠️ Schema ready, needs implementation |
| `/api/check-ins` | GET/POST | Client check-in management | ⚠️ Schema ready, needs implementation |
| `/api/habits` | GET/POST/PUT | Habit tracking | ⚠️ Schema ready, needs implementation |
| `/api/achievements` | GET/POST | Achievement system | ⚠️ Schema ready, needs implementation |

### 4.3 🔲 NOT IMPLEMENTED ENDPOINTS
| Endpoint | Method | Purpose | Development Required |
|----------|--------|---------|---------------------|
| `/api/bmr/calculate` | POST | BMR calculation for clients | 🔲 Algorithm implementation needed |
| `/api/calendar/availability` | GET/POST | PT availability management | 🔲 Full calendar system needed |
| `/api/booking/request` | POST | Client booking requests | 🔲 Booking workflow needed |
| `/api/booking/{id}/approve` | PUT | PT booking approval | 🔲 Booking system needed |
| `/api/messages` | GET/POST | Real-time messaging | 🔲 Chat system needed |
| `/api/clients/{id}/remove` | DELETE | Client removal | 🔲 Deletion workflow needed |
| `/api/analytics/business` | GET | Business analytics | 🔲 Analytics engine needed |
| `/api/education/content` | GET | Educational content | 🔲 Content management needed |
| `/api/supplements` | GET/POST | Supplement management | 🔲 Supplement system needed |

---
## 5. Database Schema Status ✅ COMPLETE

**All tables implemented and production-ready:**
- ✅ User management (PersonalTrainer, Client with enhanced fields)
- ✅ Exercise and program management (Exercise, WorkoutProgram, WorkoutDay, WorkoutExercise)
- ✅ Progress tracking (ProgressPhoto, Measurement, CheckIn)
- ✅ Nutrition (MealPlan, Meal, AFCDFood with 8,500+ items)
- ✅ Gamification (Habit, HabitLog, Achievement)
- ✅ Subscription management (Subscription, Payment)
- ✅ Exercise logging (ExerciseLog for workout tracking)

---
## 6. Component Architecture Status

### ✅ IMPLEMENTED COMPONENTS
- `Navbar.tsx` - Role-based navigation with subscription status
- `ProgramBuilderInterface.tsx` - Advanced drag-and-drop workout builder
- `MealPlanBuilderInterface.tsx` - AFCD food search and meal planning
- `ExerciseManagement.tsx` - Exercise library management
- `FoodSearch.tsx` - Food database search
- Various modal components for CRUD operations
- Settings interfaces for PT and clients

### ⚠️ COMPONENTS NEEDED FOR BACKEND-READY FEATURES
- `ProgressPhotoUpload.tsx` - Photo upload interface
- `ProgressPhotoComparison.tsx` - Week-by-week comparison
- `MeasurementTracker.tsx` - Body measurement input
- `CheckInQuestionnaire.tsx` - Weekly check-in interface
- `HabitTracker.tsx` - Habit tracking dashboard
- `AchievementNotifications.tsx` - Achievement display
- `ExtendedClientProfile.tsx` - Comprehensive client profile

### 🔲 COMPONENTS NEEDED FOR NEW FEATURES
- `BMRCalculator.tsx` - Automatic calorie calculation
- `CalendarWidget.tsx` - Booking and scheduling
- `MessagingInterface.tsx` - Real-time chat
- `EducationalContent.tsx` - Content management
- `SupplementTracker.tsx` - Supplement management
- `AnalyticsDashboard.tsx` - Business intelligence

---
## 7. Development Priorities

### **IMMEDIATE (Week 8): Complete Backend-Ready Features**
1. Build UI components for progress photos, measurements, check-ins
2. Complete meal plan saving API endpoint
3. Implement enhanced client profile interfaces
4. Add BMR calculator functionality

### **SHORT-TERM (Week 9): Business Logic Enhancement**
1. Client removal functionality
2. Program and meal plan editing capabilities
3. Achievement notification system
4. Habit tracking dashboard

### **MEDIUM-TERM (Weeks 10-11): New Feature Development**
1. Calendar and booking system
2. Educational content management
3. Supplement tracking system
4. Advanced business analytics

### **LONG-TERM (Weeks 12+): Advanced Features**
1. Real-time messaging system
2. AI integration for program suggestions
3. Mobile app companion
4. Third-party integrations

**Conclusion**: The FitPilot platform is significantly more advanced than initially documented, with a solid foundation requiring primarily UI completion for existing backend features rather than fundamental development work.
| `/client/workout` | Workout Overview | C | 🔲 | Assigned programs, weekly schedule |
| `/client/workout/session/{id}` | Live Workout | C | 🔲 | Exercise logging, timers |
| `/client/progress` | **Progress Tracking** | C | 🔲 | **NEW: Photo upload and comparison** |
| `/client/progress/photos` | Progress Photos | C | 🔲 | Upload (front, side, back), compare weeks |
| `/client/progress/photos/compare` | Photo Comparison | C | 🔲 | Side-by-side week comparison tool |
| `/client/progress/measurements` | Body Measurements | C | 🔲 | Weight, body fat, measurements |
| `/client/nutrition` | Nutrition & Meal Plans | C | ⚠️ | View assigned meal plans |
| `/client/booking` | **Session Booking** | C | 🔲 | **NEW: Request booking from PT availability** |
| `/client/booking/request` | Book Session | C | 🔲 | Select times, send request |
| `/client/my-pt/messages` | Messages | C | 🔲 | Direct chat with PT |
| `/client/my-pt/calendar` | My Sessions | C | 🔲 | Upcoming/past sessions |
| `/client/settings` | Account Settings | C | 🔲 | Profile, notifications |

---
## 4. Enhanced API Endpoints

### 4.1 Client Management APIs ⚠️ PARTIALLY IMPLEMENTED
| Endpoint | Method | Status | Purpose |
|----------|--------|--------|---------|
| `/api/clients` | GET | ✅ | List trainer's clients |
| `/api/clients/{id}` | GET | 🔲 | Get detailed client profile |
| `/api/clients/{id}` | PUT | 🔲 | Update client profile |
| `/api/clients/{id}` | DELETE | 🔲 | **NEW: Remove client** |
| `/api/clients/{id}/programs` | GET | 🔲 | Get client's workout programs |
| `/api/clients/{id}/programs/{programId}` | PUT | 🔲 | **NEW: Edit existing program** |
| `/api/clients/{id}/meals` | GET | 🔲 | Get client's meal plans |
| `/api/clients/{id}/meals/{mealId}` | PUT | 🔲 | **NEW: Edit existing meal plan** |

### 4.2 Progress Photo APIs 🔲 NEEDS IMPLEMENTATION
| Endpoint | Method | Status | Purpose |
|----------|--------|--------|---------|
| `/api/progress/photos` | POST | 🔲 | Upload progress photos |
| `/api/progress/photos` | GET | 🔲 | Get client's progress photos |
| `/api/progress/photos/compare` | GET | 🔲 | Get photos for comparison |

### 4.3 Calendar & Booking APIs 🔲 NEEDS IMPLEMENTATION
| Endpoint | Method | Status | Purpose |
|----------|--------|--------|---------|
| `/api/calendar/availability` | GET/POST | 🔲 | PT availability management |
| `/api/calendar/bookings` | GET | 🔲 | Get booked sessions |
| `/api/booking/request` | POST | 🔲 | Client booking request |
| `/api/booking/{id}/approve` | PUT | 🔲 | PT approves booking |
| `/api/booking/{id}/reject` | PUT | 🔲 | PT rejects booking |

### 4.4 Subscription APIs 🔲 NEEDS IMPLEMENTATION
| Endpoint | Method | Status | Purpose |
|----------|--------|--------|---------|
| `/api/subscription/status` | GET | 🔲 | Check PT subscription status |
| `/api/subscription/create` | POST | 🔲 | Create Stripe subscription |
| `/api/subscription/update` | PUT | 🔲 | Update subscription tier |
| `/api/subscription/cancel` | DELETE | 🔲 | Cancel subscription |

---
## 5. Shared Components

| Component | Status | Description |
|-----------|--------|-------------|
| **Navbar** | ✅ | Role-aware navigation menu |
| **AI Helper Widget** | 🔲 | Floating chat for Q&A |
| **Notification Center** | 🔲 | In-app alerts |
| **Achievement Pop-ups** | 🔲 | Gamified milestone banners |
| **Photo Upload Component** | 🔲 | **NEW: Progress photo capture** |
| **Calendar Widget** | 🔲 | **NEW: Booking and availability** |
| **Client Status Badge** | 🔲 | **NEW: Invited/Registered/Active status** |
| **Subscription Gate** | 🔲 | **NEW: Blocks access without subscription** |

---
## 6. Protected Route Structure

### PT Routes (Require Active Subscription) 🔲 NEEDS IMPLEMENTATION
All `/pt/*` routes should check:
1. User is authenticated as PT
2. PT has active subscription
3. Subscription hasn't expired

### Client Routes (Require PT Assignment)
All `/client/*` routes should check:
1. User is authenticated as Client
2. Client is assigned to a PT
3. Client status is 'registered' or 'active'

---
## 7. New Navigation Enhancements

### PT Sidebar Navigation ⚠️ NEEDS ENHANCEMENT
Dashboard
├── Client Management
│ ├── Client List
│ └── Remove Clients
├── Content Creation
│ ├── Exercise Library ✅
│ ├── Program Builder ✅
│ └── Meal Plan Builder ⚠️
├── Calendar & Bookings 🔲
│ ├── My Calendar
│ ├── Set Availability
│ └── Booking Requests
└── Business 🔲
├── Subscrip
ion ├──

text

### Client Navigation ⚠️ NEEDS ENHANCEMENT
Dashboard ✅
├── My Profile 🔲
├── Workouts 🔲
├── Nutrition ⚠️
├── Progress 🔲
│ ├── Photos
│ └── Measurements
├── Book Sessions 🔲

text

## Implementation Priority

### Phase 1 (High Priority)
1. **Subscription enforcement system**
2. **Enhanced client profiles**
3. **Progress photo upload and comparison**
4. **Client removal functionality**

### Phase 2 (Medium Priority)
1. **Calendar and booking system**
2. **Program/meal plan editing**
3. **Client status management**

### Phase 3 (Lower Priority)
1. **Messaging system**
2. **Achievement system**
3. **Advanced analytics**