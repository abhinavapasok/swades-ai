# SwadesAI Customer Support System

An AI-powered customer support system with a multi-agent architecture built with Turborepo, Hono.dev, React, and Google Gemini AI.

## 🚀 Features

- **Multi-Agent Architecture**: Router Agent that analyzes queries and routes to specialized sub-agents.
- **Gemini 2.0 Flash**: Powered by Google's highly efficient Gemini 2.0 Flash model for fast, accurate, and cost-effective responses.
- **Three Specialized Agents**:
  - **Support Agent**: Handles FAQs, troubleshooting, and general inquiries.
  - **Order Agent**: Manages order tracking, status, and cancellations.
  - **Billing Agent**: Handles payments, refunds, and invoices.
- **Real-time Streaming**: Server-Sent Events (SSE) for live, interactive AI responses.
- **Typing Indicators**: Visual feedback showing which agent is processing each request.
- **Conversation History**: Persistent chat history for seamless context-aware interactions.
- **Rate Limiting**: Built-in API rate limiting for security and stability.
- **Hono RPC**: Type-safe end-to-end communication between frontend and backend.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Monorepo | Turborepo |
| Frontend | React + Vite + TypeScript |
| Backend | Hono.dev |
| Database | PostgreSQL |
| ORM | Prisma |
| AI Infra | Vercel AI SDK |
| AI Model | Google Gemini 2.0 Flash |

## 📁 Project Structure

```
swadesai-support/
├── apps/
│   ├── api/                    # Hono.dev backend
│   │   ├── src/
│   │   │   ├── agents/         # AI agents (router, support, order, billing)
│   │   │   ├── controllers/    # Request handlers
│   │   │   ├── services/       # Business logic
│   │   │   ├── tools/          # Agent tools (Database queries)
│   │   │   ├── middleware/     # Error handling, rate limiting
│   │   │   ├── routes/         # API routes
│   │   │   └── lib/            # Shared utilities (Model config)
│   │   └── prisma/             # Database schema and seed scripts
│   │
│   └── web/                    # React + Vite frontend
│       └── src/
│           ├── components/     # UI components & Chat interface
│           ├── hooks/          # React hooks for state & API
│           └── lib/            # API client (Axios & streaming fetch)
│
└── packages/
    └── shared/                 # Shared types and validation schemas
```

## 🚦 Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 9.15.4
- **Docker & Docker Compose** (recommended) OR PostgreSQL
- Google AI API key (get from [AI Studio](https://aistudio.google.com/app/apikey))

### Option 1: Quick Start with Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/abhinavapasok/swades-ai.git
   cd swades-ai
   ```

2. **Start PostgreSQL with Docker**
   ```bash
   docker compose up -d
   ```
   
   This starts PostgreSQL on `localhost:5432` with:
   - Username/Password: `postgres`
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

Follow the same steps as Option 1, but ensure your local PostgreSQL is running and update the `DATABASE_URL` in `apps/api/.env` accordingly.

## 📡 API Endpoints (Local)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat/messages` | Send message (streaming) |
| GET | `/api/chat/conversations/:id` | Get conversation history |
| GET | `/api/chat/conversations` | List user conversations |
| DELETE | `/api/chat/conversations/:id` | Delete conversation |
| GET | `/api/agents` | List available agents |
| GET | `/api/health` | API Health check |

> [!NOTE]
> In production, the API is available at `https://swades-ai-api.vercel.app`. Note that the `/api` prefix is removed for all production requests.

## 🤖 Agent System

- **Router Agent**: Analyzes queries and classifies intent into `support`, `order`, or `billing`.
- **Support Agent**: Handles general inquiries using `searchFAQs` and `getUserInfo` tools.
- **Order Agent**: Manages order tracking and cancellations via `fetchOrderDetails` and `checkDeliveryStatus`.
- **Billing Agent**: Processes refunds and payment inquiries using `getInvoiceDetails` and `requestRefund`.

## 🧪 Sample Queries to Test

- "Track my order ORD-2024-002"
- "What is your return policy?"
- "Check refund status for INV-2024-005"
- "Show my recent orders"
- "How do I reset my password?"

## 🔧 Development Commands

```bash
pnpm dev              # Start all apps in dev mode
pnpm build            # Build all apps for production
pnpm db:studio        # Open Prisma Studio to view database data
pnpm lint             # Run linting across the monorepo
pnpm check-types      # Run TypeScript type checks
```

## 📄 License

MIT
