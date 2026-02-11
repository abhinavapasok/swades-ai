# SwadesAI Customer Support System

An AI-powered customer support system with a multi-agent architecture built with Turborepo, Hono.dev, React, and Google Gemini AI.

## 🚀 Features

- **Multi-Agent Architecture**: Router Agent that analyzes queries and routes to specialized sub-agents
- **Google Gemini 2.0 Flash**: Powered by Google's latest Gemini models for fast, accurate responses
- **Three Specialized Agents**:
  - **Support Agent**: Handles FAQs, troubleshooting, and general inquiries
  - **Order Agent**: Manages order tracking, status, and cancellations
  - **Billing Agent**: Handles payments, refunds, and invoices
- **Real-time Streaming**: Server-Sent Events for live AI responses
- **Typing Indicators**: Shows which agent is processing the request
- **Conversation History**: Persistent chat history with context awareness
- **Rate Limiting**: Built-in API rate limiting
- **Hono RPC**: Type-safe API communication

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Monorepo | Turborepo |
| Frontend | React + Vite + TypeScript |
| Backend | Hono.dev |
| Database | PostgreSQL |
| ORM | Prisma |
| AI | Vercel AI SDK + Google Gemini 2.0 |

## 📁 Project Structure

```
swadesai-support/
├── apps/
│   ├── api/                    # Hono.dev backend
│   │   ├── src/
│   │   │   ├── agents/         # AI agents (router, support, order, billing)
│   │   │   ├── controllers/    # Request handlers
│   │   │   ├── services/       # Business logic
│   │   │   ├── tools/          # Agent tools for DB queries
│   │   │   ├── middleware/     # Error handling, rate limiting
│   │   │   ├── routes/         # API routes
│   │   │   └── db/             # Database client
│   │   └── prisma/             # Database schema and seed
│   │
│   └── web/                    # React + Vite frontend
│       └── src/
│           ├── components/     # UI components
│           ├── hooks/          # React hooks
│           └── lib/            # API client
│
└── packages/
    └── shared/                 # Shared types
```

## 🚦 Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 9.0.0
- **Docker & Docker Compose** (recommended) OR PostgreSQL installed locally
- Google AI API key (get from https://aistudio.google.com/app/apikey)

### Option 1: Quick Start with Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd swadesai-support
   ```

2. **Start PostgreSQL with Docker**
   ```bash
   docker compose up -d
   ```
   
   This starts PostgreSQL on `localhost:5432` with:
   - Username: `postgres`
   - Password: `postgres`
   - Database: `swadesai_support`

3. **Install dependencies**
   ```bash
   pnpm install
   ```

4. **Configure environment**
   ```bash
   cp apps/api/.env.example apps/api/.env
   ```
   
   Edit `apps/api/.env` and add your Google AI API key:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/swadesai_support?schema=public"
   GOOGLE_GENERATIVE_AI_API_KEY="your-google-ai-api-key"
   PORT=3001
   ```

5. **Setup database**
   ```bash
   pnpm db:generate  # Generate Prisma client
   pnpm db:push      # Create database schema
   pnpm db:seed      # Seed with sample data
   ```

6. **Start development servers**
   ```bash
   pnpm dev
   ```

   - API server: `http://localhost:3001`
   - Web app: `http://localhost:5173`

### Option 2: Using Local PostgreSQL

### Prerequisites

- Node.js >= 18
- pnpm >= 9.0.0
- PostgreSQL database (installed locally)
- Google AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd swadesai-support
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment**
   ```bash
   cp apps/api/.env.example apps/api/.env
   ```
   
   Edit `apps/api/.env` and add:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/swadesai_support?schema=public"
   GOOGLE_GENERATIVE_AI_API_KEY="your-google-ai-api-key"
   PORT=3001
   ```

4. **Setup database**
   ```bash
   # Generate Prisma client
   pnpm db:generate
   
   # Push schema to database
   pnpm db:push
   
   # Seed with sample data
   pnpm db:seed
   ```

5. **Start development servers**
   ```bash
   pnpm dev
   ```

   This will start:
   - API server at `http://localhost:3001`
   - Web app at `http://localhost:5173`

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat/messages` | Send message (streaming) |
| GET | `/api/chat/conversations/:id` | Get conversation history |
| GET | `/api/chat/conversations` | List user conversations |
| DELETE | `/api/chat/conversations/:id` | Delete conversation |
| GET | `/api/agents` | List available agents |
| GET | `/api/agents/:type/capabilities` | Get agent capabilities |
| GET | `/api/health` | Health check |

## 🤖 Agent System

### Router Agent
Analyzes incoming queries and classifies intent into:
- `support` - General inquiries and FAQs
- `order` - Order-related queries
- `billing` - Payment and invoice queries

### Support Agent Tools
- `searchFAQs` - Search FAQ database
- `getConversationHistory` - Get conversation context
- `getUserInfo` - Get user account details

### Order Agent Tools
- `fetchOrderDetails` - Get order information
- `checkDeliveryStatus` - Check shipping status
- `getOrderHistory` - List user orders
- `cancelOrder` - Cancel eligible orders

### Billing Agent Tools
- `getInvoiceDetails` - Get invoice information
- `checkRefundStatus` - Check refund status
- `getPaymentHistory` - List payment history
- `requestRefund` - Submit refund request

## 🧪 Sample Queries to Test

- "Track my order ORD-2024-002"
- "What is your return policy?"
- "Check refund status for INV-2024-005"
- "Show my recent orders"
- "How do I reset my password?"
- "View my payment history"

## 📝 Sample Data

The seed script creates:
- 5 users
- 8 orders with various statuses
- 10 payments including refund scenarios
- 15 FAQs covering common topics
- Sample conversations

## 🔧 Development Commands

```bash
# Development
pnpm dev              # Start all apps in dev mode

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema changes
pnpm db:seed          # Seed database
pnpm db:studio        # Open Prisma Studio

# Build
pnpm build            # Build all apps

# Lint & Types
pnpm lint             # Run linting
pnpm check-types      # TypeScript checks
```

## 📄 License

MIT
