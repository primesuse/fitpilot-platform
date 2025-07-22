# Website Architecture Sitemap
## AI-Assisted Fitness Platform

### Legend
- **(P)** Public page
- **(PT)** Personal Trainer authenticated page
- **(C)** Client authenticated page

---
## 1. Public-Facing Pages
| Path | Label | Type | Key Components |
|------|-------|------|---------------|
| `/` | Home | P | Hero, Value Props, Feature Teasers, Testimonials, CTA |
| `/features` | Features | P | Detailed feature sections with screenshots |
| `/pricing` | Pricing | P | Tiered pricing table, FAQs, CTA |
| `/login` | Login | P | Email/password form, social login, password reset |
| `/register` | PT Registration | P | Multi-step wizard: account, plan, payment, profile |
| `/privacy-policy` | Privacy Policy | P | Legal text |
| `/terms-of-service` | Terms of Service | P | Legal text |

---
## 2. Personal Trainer Interface
| Path | Label | Type | Key Modules |
|------|-------|------|-------------|
| `/pt/dashboard` | PT Dashboard | PT | Client list, KPIs, to-do list |
| `/pt/calendar` | Calendar & Scheduling | PT | Availability, session approvals |
| `/pt/messages` | Messaging | PT | Chat threads, file sharing |
| `/pt/clients/{id}` | Client Profile | PT | Tabs: Overview, Workout, Meal, Progress, Measurements, Notes |
| `/pt/library/exercises` | Exercise Library | PT | CRUD videos, tagging |
| `/pt/library/templates/workouts` | Program Templates | PT | Save/edit templates |
| `/pt/library/content` | Educational Content | PT | Upload/manage videos, guides |
| `/pt/business/payments` | Payments & Invoicing | PT | Transactions, Stripe connect |
| `/pt/business/analytics` | Analytics | PT | Revenue, retention, session stats |
| `/pt/business/subscription` | My Subscription | PT | Plan, billing history |
| `/pt/settings` | Account Settings | PT | Profile, password, notifications |

---
## 3. Client Interface
| Path | Label | Type | Key Modules |
|------|-------|------|-------------|
| `/client/dashboard` | Client Dashboard | C | Daily focus, stats, achievements |
| `/client/workout` | Workout Overview | C | Weekly schedule |
| `/client/workout/session/{id}` | Live Workout | C | Logging, timers, video pop-ups |
| `/client/progress` | Progress & Check-in | C | Tabs: Check-in form, Photos, Charts, Achievements |
| `/client/nutrition` | Nutrition & Habits | C | Meal plan, habit tracker |
| `/client/my-pt/messages` | Messages | C | Direct chat |
| `/client/my-pt/calendar` | Book Sessions | C | PT availability, booking form |
| `/client/my-pt/resources` | Resources | C | Video library, supplement guides |
| `/client/settings` | Account Settings | C | Profile, payments, notifications |

---
## 4. Shared Components
| Component | Description |
|-----------|-------------|
| AI Helper Widget | Floating chat for Q&A (all pages) |
| Notification Center | In-app alerts (PT & C) |
| Achievement Pop-ups | Gamified banners (PT & C) |
| Header & NavBar | Role-aware navigation menu |
| Footer | Links to policy pages |
