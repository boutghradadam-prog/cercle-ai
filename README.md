# Cercle AI - AI-Powered Math & Science Education Platform

> Master Mathematics and Science with AI-powered tutoring, step-by-step problem solving, interactive quizzes, and personalized learning paths.

![Cercle AI](https://img.shields.io/badge/Cercle%20AI-EdTech-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)

## Features

- **AI Math Tutor** — Step-by-step problem solving with detailed explanations
- **AI Science Tutor** — Physics, Chemistry, and Biology with real-world examples
- **Interactive Chat** — ChatGPT-style conversations with context-aware AI
- **Formula Recognition** — Snap photos of handwritten notes and formulas
- **AI Quizzes & Exams** — Auto-generated quizzes tailored to your level
- **Personalized Learning Paths** — Custom paths based on your performance
- **Progress Dashboard** — Visual analytics with charts and streaks
- **Gamification** — Points, badges, levels, and leaderboards
- **Multi-Language** — English, French, Arabic support
- **Dark & Light Mode** — Full theme support
- **Role-Based Access** — Student, Teacher, and Admin roles
- **Subscription Plans** — Free, Pro ($12/mo), Premium ($24/mo)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS 4, shadcn/ui |
| Backend | Next.js API Routes, Prisma ORM |
| Database | SQLite (dev) / PostgreSQL via Neon (prod) |
| AI | OpenRouter (DeepSeek / GPT models) |
| Charts | Recharts |
| State | Zustand |
| Auth | Custom with bcrypt |
| Payments | Stripe-ready |

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- An OpenRouter API key

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/cercle-ai.git
cd cercle-ai

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Set up the database
bun run db:push

# Start the development server
bun run dev
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | SQLite or PostgreSQL connection string | Yes |
| `OPENROUTER_API_KEY` | OpenRouter API key for AI features | Yes |
| `ADMIN_PASSWORD` | Password for admin panel access | Yes |
| `NEON_DATABASE_URL` | PostgreSQL URL for production | No |

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/route.ts      # Authentication (signup, signin, admin)
│   │   ├── chat/route.ts      # AI chat with subject-specific prompts
│   │   ├── quiz/route.ts      # AI quiz generation
│   │   ├── data/route.ts      # User data, badges, progress
│   │   ├── users/route.ts     # Admin user management
│   │   └── activity/route.ts  # Save chats, quizzes, award points
│   ├── layout.tsx
│   ├── page.tsx               # Main SPA entry
│   └── globals.css            # Theme & animations
├── components/
│   ├── landing/               # Landing page, auth, pricing
│   ├── dashboard/             # Dashboard, progress, settings
│   ├── chat/                  # AI tutor chat interface
│   ├── quiz/                  # Quiz generator & player
│   ├── admin/                 # Admin panel
│   ├── providers/             # Theme provider
│   └── ui/                    # shadcn/ui components
├── store/
│   └── useAppStore.ts         # Zustand global state
├── lib/
│   ├── db.ts                  # Prisma client
│   └── utils.ts               # Utility functions
└── prisma/
    └── schema.prisma          # Database schema
```

## Architecture

The app is built as a **Single Page Application (SPA)** using Next.js client-side routing. The `useAppStore` Zustand store manages all views and data flow:

1. **Landing Page** → User clicks "Get Started"
2. **Auth Page** → Sign up / Sign in / Admin access
3. **Dashboard** → Real-time stats, quick actions, badges
4. **Chat** → AI tutor with auto-save & points
5. **Quiz** → AI-generated quizzes with scoring
6. **Progress** → Analytics charts (Recharts)
7. **Admin** → User management, stats, system monitoring

## Database Schema

- **User** — Profile, role, plan, points, level, streak
- **ChatSession** — Conversation history per subject
- **QuizAttempt** — Quiz scores and answers
- **Progress** — Per-subject topic mastery
- **Badge / UserBadge** — Achievement system
- **LearningPath** — Personalized learning sequences
- **SubscriptionPlan** — Plan definitions

## License

MIT

---

Built with ❤️ by the Cercle AI team
