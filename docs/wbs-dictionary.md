# Work Breakdown Structure (WBS) and Dictionary for the AI-Assisted Fitness Platform

This combined file provides the hierarchical Work Breakdown Structure **(WBS)** and a full **WBS Dictionary** so that a solo developer can move from a blank code editor to a fully-deployed prototype ready to demo to personal trainers and gyms.

> **Tip for AI coding assistants:**  Treat every *Associated Activity* bullet as a discrete prompt you can feed directly into ChatGPT, Copilot, or similar tools to generate code, configurations, or documentation.

---
## 0.0  Project Setup & Planning  
| Field | Details |
|-------|---------|
| **WBS Code** | 0.0 |
| **Work Package Name** | Project Setup & Planning |
| **Description** | Establish the development environment, source-control, project board, and initial roadmap. |
| **Responsible** | Solo Developer |
| **Associated Activities** | ➊ Install VS Code, Node.js, Git ➋ Create **GitHub** repo with `/docs` folder (import all specs) ➌ Set up kanban board (Trello/Issues) with To-Do → In-Progress → Done columns ➍ Draft 12-week timeline in README ➎ Configure `.editorconfig`, Prettier, ESLint for Consistent code style |
| **Milestones** | Environment ready (Day 2) • Project board populated (Day 3) |
| **Resources** | Laptop • Internet • GitHub (free) |
| **Cost Estimate** | $0 |
| **Quality Requirements** | All source files version-controlled; no code lives only on local machine |
| **Acceptance Criteria** | `git clone` followed by `npm install && npm run dev` shows *Hello World* page |

---
## 1.0  Requirements & Design  
| Field | Details |
|-------|---------|
| **WBS Code** | 1.0 |
| **Work Package Name** | Requirements & Design |
| **Description** | Translate the Functional Requirements Specification, Website Sitemap, and ERD into actionable, low-level design artefacts. |
| **Responsible** | Solo Developer |
| **Associated Activities** | ➊ Break high-level features into user stories ➋ Draft wireframes in Figma for every sitemap route ➌ Convert ERD into Prisma schema `schema.prisma` ➍ Identify external APIs (Stripe, Nutritionix, OpenAI) & store keys in `.env` ➎ Review design doc against specs, update gaps |
| **Milestones** | Wireframes approved (Week 1) • Prisma schema compiles (Week 2) |
| **Resources** | Figma (free) • Prisma CLI |
| **Cost Estimate** | $0 |
| **Quality Requirements** | Wireframes cover 100 % of sitemap; database generates with no errors |
| **Acceptance Criteria** | Screen-by-screen walk-through matches requirements; `npx prisma validate` passes |

---
## 2.0  Backend Development  
### 2.1  Boilerplate & Auth
| Field | Details |
|-------|---------|
| **WBS Code** | 2.1 |
| **Name** | Boilerplate & Authentication |
| **Description** | Scaffold Express/Next.js API routes, connect Prisma, implement secure JWT auth. |
| **Associated Activities** | ➊ Run `npx create-next-app` ➋ Add `/api/auth/register` & `/api/auth/login` ➌ Hash passwords with `bcrypt` ➍ Issue JWT & HTTP-only cookie ➎ Protect routes with middleware |
| **Milestones** | Auth endpoints tested via Postman (Week 3) |

### 2.2  Core REST/GraphQL API
| **WBS Code** | 2.2 |
| **Description** | CRUD endpoints for all ERD entities (Clients, Programs, Exercises, etc.). |
| **Associated Activities** | Auto-generate Prisma CRUD • Custom business logic (total load calc, achievements) • Pagination & filtering |
| **Milestones** | CRUD complete (Week 4) |

### 2.3  Third-Party Integrations
| **WBS Code** | 2.3 |
| **Description** | Stripe payments, OpenAI chat proxy, Nutritionix food search, Google Calendar sync. |
| **Milestones** | Webhook test events succeed (Week 5) |

### 2.4  Unit Tests & API Docs
| **WBS Code** | 2.4 |
| **Description** | Jest tests ≥ 80 % coverage; Swagger or tRPC docs auto-generated. |
| **Milestones** | CI badge green (Week 6) |

---
## 3.0  Frontend Development  
### 3.1  Design System & Layout
| **WBS Code** | 3.1 |
| **Description** | Create reusable components (Button, Card, Modal) & role-based layouts (Public, PT, Client). |
| **Milestones** | Storybook up with 10 core components (Week 4) |

### 3.2  Public Pages
| **WBS Code** | 3.2 |
| **Description** | Home, Features, Pricing, Login, Register. Implement responsive Tailwind CSS. |
| **Milestones** | Lighthouse score ≥ 90 (Week 5) |

### 3.3  PT Dashboard
| **WBS Code** | 3.3 |
| **Description** | Build PT routes (`/pt/*`): client list, program builder (drag-drop), calendar, payments. |
| **Milestones** | Program builder saves to DB (Week 7) |

### 3.4  Client Dashboard
| **WBS Code** | 3.4 |
| **Description** | Build client routes (`/client/*`): workout viewer/logger, progress, nutrition, achievements. |
| **Milestones** | Live workout logging posts ExerciseLog (Week 8) |

### 3.5  Real-Time Features
| **WBS Code** | 3.5 |
| **Description** | Socket.io for chat, notifications, achievement toasts. |
| **Milestones** | Message delivered <1 s round-trip (Week 9) |

---
## 4.0  AI Integration  
| Field | Details |
|-------|---------|
| **WBS Code** | 4.0 |
| **Name** | AI Integration |
| **Description** | Connect frontend widgets & backend services to OpenAI. Provide program suggestions & Q&A bot. |
| **Associated Activities** | ➊ Build `/api/ai/suggest-program` ➋ Create `<AiHelperWidget/>` with OpenAI streaming ➌ Prompt-engineer safe responses ➍ Log Q&A to DB |
| **Milestones** | Demo: AI suggests 3-day plan in <15 s (Week 9) |

---
## 5.0  Testing & Quality Assurance  
| Field | Details |
|-------|---------|
| **WBS Code** | 5.0 |
| **Description** | Manual UI tests, automated end-to-end tests with Playwright, security audit. |
| **Milestones** | Zero critical bugs, OWASP scan clean (Week 10) |

---
## 6.0  Deployment & DevOps  
| Field | Details |
|-------|---------|
| **WBS Code** | 6.0 |
| **Description** | CI/CD pipelines, staging & production on Vercel + Supabase, domain, HTTPS, backups. |
| **Associated Activities** | GitHub Actions build → Vercel preview → prod promote, Supabase daily backups, Stripe webhook URL update. |
| **Milestones** | `https://app.fitpilot.ai` live (Week 11) |

---
## 7.0  Documentation & Training  
| Field | Details |
|-------|---------|
| **WBS Code** | 7.0 |
| **Description** | User guide (Markdown + screenshots), API docs, onboarding videos. |
| **Milestones** | README badges & video demo (Week 11) |

---
## 8.0  Go-Live & Support  
| Field | Details |
|-------|---------|
| **WBS Code** | 8.0 |
| **Description** | Beta launch with pilot PTs, collect feedback, hot-fix bugs, monitor logs. |
| **Milestones** | 3 PTs active, error rate <1 % (Week 12) |

---
## 9.0  Project Close-Out  
| Field | Details |
|-------|---------|
| **WBS Code** | 9.0 |
| **Description** | Retrospective, finalize documentation, roadmap v1.1, celebrate 🍕. |
| **Milestones** | Close-out report (Week 13) |

---
### Legend
* **PK** – Primary Key  •  **FK** – Foreign Key  •  **CI/CD** – Continuous Integration / Continuous Deployment.

> **End of WBS & Dictionary**
