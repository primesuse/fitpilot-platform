# Database Schema ERD
## AI-Assisted Fitness Platform

### Overview
This document provides a complete Entity-Relationship Diagram (ERD) specification for the Fitness Platform database. Each entity (table) is listed with its attributes, data types, constraints, and relationships to other entities.

---
## 1. User & Account Management

### 1.1 PersonalTrainer
| Column | Type | Key | Constraints |
|--------|------|-----|-------------|
| TrainerID | UUID | PK | Default uuid_generate_v4() |
| Name | VARCHAR(120) |  | NOT NULL |
| Email | VARCHAR(255) |  | UNIQUE, NOT NULL |
| PasswordHash | VARCHAR(255) |  | NOT NULL |
| SubscriptionTier | ENUM('Solo','Studio','Enterprise') |  | DEFAULT 'Solo' |
| CreatedAt | TIMESTAMP |  | DEFAULT now() |
| UpdatedAt | TIMESTAMP |  | DEFAULT now() |

### 1.2 Client
| Column | Type | Key | Constraints |
|--------|------|-----|-------------|
| ClientID | UUID | PK | Default uuid_generate_v4() |
| TrainerID | UUID | FK → PersonalTrainer.TrainerID | ON DELETE CASCADE |
| Name | VARCHAR(120) |  | NOT NULL |
| Email | VARCHAR(255) |  | UNIQUE, NOT NULL |
| PasswordHash | VARCHAR(255) |  | NOT NULL |
| HeightCm | DECIMAL(5,2) |  | NULL |
| StartingWeightKg | DECIMAL(5,2) |  | NULL |
| CreatedAt | TIMESTAMP |  | DEFAULT now() |
| UpdatedAt | TIMESTAMP |  | DEFAULT now() |

---
## 2. Workout & Program Management

### 2.1 Exercise
| Column | Type | Key | Constraints |
|--------|------|-----|-------------|
| ExerciseID | UUID | PK |
| TrainerID | UUID | FK → PersonalTrainer.TrainerID | ON DELETE CASCADE |
| Name | VARCHAR(120) |  | NOT NULL |
| VideoURL | TEXT |  | NULL |
| Description | TEXT |  | NULL |
| CreatedAt | TIMESTAMP |  | DEFAULT now() |

### 2.2 WorkoutProgram
| Column | Type | Key | Constraints |
|--------|------|-----|-------------|
| ProgramID | UUID | PK |
| ClientID | UUID | FK → Client.ClientID | ON DELETE CASCADE |
| Name | VARCHAR(120) |  | NOT NULL |
| StartDate | DATE |  | NULL |
| EndDate | DATE |  | NULL |
| CreatedAt | TIMESTAMP |  | DEFAULT now() |

### 2.3 WorkoutDay
| Column | Type | Key | Constraints |
|--------|------|-----|-------------|
| DayID | UUID | PK |
| ProgramID | UUID | FK → WorkoutProgram.ProgramID | ON DELETE CASCADE |
| DayOfWeek | SMALLINT |  | CHECK (DayOfWeek BETWEEN 0 AND 6) |
| Title | VARCHAR(120) |  | NULL |

### 2.4 WorkoutExercise
| Column | Type | Key | Constraints |
|--------|------|-----|-------------|
| W_ExerciseID | UUID | PK |
| DayID | UUID | FK → WorkoutDay.DayID | ON DELETE CASCADE |
| ExerciseID | UUID | FK → Exercise.ExerciseID | ON DELETE RESTRICT |
| SeqOrder | SMALLINT |  | NOT NULL |
| Sets | SMALLINT |  | DEFAULT 3 |
| Reps | SMALLINT |  | DEFAULT 10 |
| DropSets | SMALLINT |  | DEFAULT 0 |
| SuperSetGroup | UUID |  | NULL |
| TUT_Seconds | SMALLINT |  | NULL |
| RestSeconds | SMALLINT |  | NULL |
| RIR | SMALLINT |  | NULL |

### 2.5 ExerciseLog
| Column | Type | Key | Constraints |
|--------|------|-----|-------------|
| LogID | UUID | PK |
| W_ExerciseID | UUID | FK → WorkoutExercise.W_ExerciseID | ON DELETE CASCADE |
| ClientID | UUID | FK → Client.ClientID | ON DELETE CASCADE |
| PerformedAt | TIMESTAMP |  | DEFAULT now() |
| WeightKg | DECIMAL(6,2) |  | NOT NULL |
| RepsDone | SMALLINT |  | NOT NULL |
| TotalLoadKg | DECIMAL(10,2) |  | GENERATED ALWAYS AS (WeightKg*RepsDone) STORED |

---
## 3. Progress & Check-in Tracking

### 3.1 ProgressPhoto
| Column | Type | Key | Constraints |
|--------|------|-----|-------------|
| PhotoID | UUID | PK |
| ClientID | UUID | FK → Client.ClientID | ON DELETE CASCADE |
| CapturedAt | DATE |  | NOT NULL |
| UrlFront | TEXT |  | NOT NULL |
| UrlSideLeft | TEXT |  | NULL |
| UrlBack | TEXT |  | NULL |
| UrlSideRight | TEXT |  | NULL |

### 3.2 Measurement
| Column | Type | Key | Constraints |
|--------|------|-----|-------------|
| MeasurementID | UUID | PK |
| ClientID | UUID | FK → Client.ClientID | ON DELETE CASCADE |
| MeasuredAt | DATE |  | NOT NULL |
| BodyWeightKg | DECIMAL(6,2) |  | NOT NULL |
| BodyFatPercent | DECIMAL(5,2) |  | NULL |
| ArmCm | DECIMAL(5,2) |  | NULL |
| ChestCm | DECIMAL(5,2) |  | NULL |
| WaistCm | DECIMAL(5,2) |  | NULL |
| HipsCm | DECIMAL(5,2) |  | NULL |
| LegsCm | DECIMAL(5,2) |  | NULL |
| SkinfoldJson | JSONB |  | NULL |

### 3.3 CheckIn
| Column | Type | Key | Constraints |
|--------|------|-----|-------------|
| CheckInID | UUID | PK |
| ClientID | UUID | FK → Client.ClientID | ON DELETE CASCADE |
| SubmittedAt | TIMESTAMP |  | DEFAULT now() |
| QuestionnaireJson | JSONB |  | NOT NULL |
| PT_ResponseUrl | TEXT |  | NULL |

---
## 4. Nutrition, Supplements & Habits

### 4.1 MealPlan
| Column | Type | Key | Constraints |
|--------|------|-----|-------------|
| MealPlanID | UUID | PK |
| ClientID | UUID | FK → Client.ClientID | ON DELETE CASCADE |
| Name | VARCHAR(120) |  | NOT NULL |
| TotalCal | INTEGER |  | NOT NULL |
| ProteinG | INTEGER |  | NOT NULL |
| CarbsG | INTEGER |  | NOT NULL |
| FatG | INTEGER |  | NOT NULL |

### 4.2 Meal
| Column | Type | Key | Constraints |
|--------|------|-----|-------------|
| MealID | UUID | PK |
| MealPlanID | UUID | FK → MealPlan.MealPlanID | ON DELETE CASCADE |
| Name | VARCHAR(120) |  | NOT NULL |
| FoodItemsJson | JSONB |  | NOT NULL |

### 4.3 Habit & HabitLog
(Combined description for brevity)
- **Habit**: HabitID PK, ClientID FK, Title, CreatedAt
- **HabitLog**: LogID PK, HabitID FK, LoggedDate, Completed BOOLEAN DEFAULT false

---
## 5. Platform & Engagement

### 5.1 Payment
| Column | Type | Key | Constraints |
|--------|------|-----|-------------|
| PaymentID | UUID | PK |
| PayerID | UUID |  | REFERENCES (PersonalTrainer OR Client) |
| PayeeID | UUID |  | REFERENCES (PersonalTrainer OR Platform) |
| AmountCents | INTEGER |  | NOT NULL |
| Currency | CHAR(3) |  | DEFAULT 'USD' |
| PaidAt | TIMESTAMP |  | DEFAULT now() |

### 5.2 Message
| MessageID PK, SenderID FK, ReceiverID FK, SentAt, Content TEXT |

### 5.3 CalendarEvent
| EventID PK, UserID FK, Title, StartTime, EndTime, Notes |

### 5.4 Achievement
| AchievementID PK, ClientID FK, Title, Description, GrantedAt |

---
## Relationships Summary
- **PersonalTrainer 1-N Client**
- **PersonalTrainer 1-N Exercise / ProgramTemplate / InfoVideo**
- **Client 1-N WorkoutProgram / MealPlan / ProgressPhoto / Measurement / CheckIn / Habit / Achievement / ExerciseLog**
- **WorkoutProgram 1-N WorkoutDay 1-N WorkoutExercise 1-N ExerciseLog**
- **MealPlan 1-N Meal**
- **Habit 1-N HabitLog**
- **User (PT or Client) 1-N CalendarEvent / Message / Payment**

This schema supports every described feature: authentication, AI messaging, workouts, nutrition, payments, progress tracking, and gamified achievements.