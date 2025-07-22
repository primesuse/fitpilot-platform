# Website Architecture Sitemap
## AI-Assisted Fitness Platform (FitPilot)

### Legend
- **(P)** Public page
- **(PT)** Personal Trainer authenticated page
- **(C)** Client authenticated page
- **✅** Implemented
- **⚠️** Partially implemented
- **🔲** Not implemented

---
## 1. Public-Facing Pages

| Path | Label | Type | Status | Key Components |
|------|-------|------|--------|---------------|
| `/` | Home | P | ✅ | Hero, Value Props, CTA |
| `/login` | Login | P | ✅ | Email/password form, role selection |
| `/register` | PT Registration | P | ✅ | Basic registration form |
| `/privacy-policy` | Privacy Policy | P | 🔲 | Legal text |
| `/terms-of-service` | Terms of Service | P | 🔲 | Legal text |

---
## 2. Personal Trainer Interface

| Path | Label | Type | Status | Key Modules |
|------|-------|------|--------|-------------|
| `/pt/dashboard` | PT Dashboard | PT | ✅ | Client list, stats, invite system |
| `/pt/library/exercises` | Exercise Library | PT | ✅ | CRUD operations, video URLs |
| `/pt/library/templates/workouts` | Program Builder | PT | ✅ | Drag-and-drop, 7-day grid, save functionality |
| `/pt/library/meal-plans` | Meal Plan Builder | PT | ⚠️ | USDA food search, plan creation |
| `/pt/clients/{id}` | **Enhanced Client Profile** | PT | 🔲 | **NEW: Comprehensive client management** |
| `/pt/clients/{id}/overview` | Client Overview | PT | 🔲 | Stats, next booking, quick actions |
| `/pt/clients/{id}/programs` | Client Programs | PT | 🔲 | View/edit existing workout programs |
| `/pt/clients/{id}/meals` | Client Meal Plans | PT | 🔲 | View/edit existing meal plans |
| `/pt/clients/{id}/progress` | Client Progress | PT | 🔲 | Progress photos, measurements, check-ins |
| `/pt/calendar` | **PT Calendar** | PT | 🔲 | **NEW: Booked sessions, availability management** |
| `/pt/calendar/availability` | Set Availability | PT | 🔲 | Define available time slots |
| `/pt/calendar/bookings` | Booking Requests | PT | 🔲 | Approve/deny client requests |
| `/pt/business/subscription` | **Subscription Management** | PT | 🔲 | **NEW: Required for platform access** |
| `/pt/business/payments` | Payments & Invoicing | PT | 🔲 | Stripe integration, billing |
| `/pt/business/analytics` | Analytics | PT | 🔲 | Client metrics, revenue tracking |
| `/pt/settings` | Account Settings | PT | 🔲 | Profile, notifications |

---
## 3. Client Interface

| Path | Label | Type | Status | Key Modules |
|------|-------|------|--------|-------------|
| `/client/dashboard` | Client Dashboard | C | ✅ | Basic stats, trainer info |
| `/client/profile` | **Extended Profile** | C | 🔲 | **NEW: Age, height, weight, body fat %, phone, photo** |
| `/client/profile/edit` | Edit Profile | C | 🔲 | Enhanced profile management |
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