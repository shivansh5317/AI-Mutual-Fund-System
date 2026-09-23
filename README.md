<div align="center">

# 🚀 AI Mutual Fund System

### *Intelligent Wealth Management for the Modern Investor*

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Pinecone](https://img.shields.io/badge/Pinecone-000000?style=for-the-badge&logo=pinecone&logoColor=white)](https://www.pinecone.io/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build/)

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=28&duration=3000&pause=1000&color=6366F1&center=true&vCenter=true&width=600&lines=AI-Powered+Recommendations;Real-Time+Analytics;Smart+Portfolio+Management;Semantic+Search+Engine" alt="Typing SVG" />

---

### 🎯 Democratizing Wealth Management Through AI

*Empowering middle-class investors with institutional-grade mutual fund analysis and recommendations*

</div>

---

## 📊 Problem Statement

Traditional wealth management tools are either:
- ❌ **Too Complex** - Require extensive financial knowledge
- ❌ **Too Expensive** - High capital requirements
- ❌ **Too Risky** - Limited diversification options
- ❌ **Too Time-Consuming** - Manual research and tracking

### 💡 Our Solution

An **AI-powered mutual fund recommendation system** that provides:
- ✅ Intelligent fund recommendations based on your goals
- ✅ Real-time analytics and performance tracking
- ✅ Low entry barriers (SIP starting from ₹100)
- ✅ Risk-adjusted portfolio suggestions
- ✅ Semantic search for natural language queries

---

## 🏗️ Architecture

<div align="center">

```mermaid
graph TB
    subgraph Frontend["🎨 Frontend Layer"]
        A[Next.js UI]
        B[React Components]
        C[Dashboard]
        D[Fund Explorer]
        E[Portfolio Manager]
    end
    
    subgraph API["🔌 API Layer"]
        F[Express Server]
        G[REST Endpoints]
        H[Recommendations]
        I[Analytics]
        J[Filters]
    end
    
    subgraph Service["🧠 Service Layer"]
        K[AI Service]
        L[Recommendation Engine]
        M[Analytics Engine]
        N[Search Engine]
    end
    
    subgraph Data["💾 Data Layer"]
        O[(PostgreSQL)]
        Q[(Pinecone)]
    end
    
    A --> B
    B --> C
    B --> D
    B --> E
    F --> G
    G --> H
    G --> I
    G --> J
    K --> L
    K --> M
    K --> N
    A --> F
    F --> K
    K --> O
    K --> Q
```

</div>

---

## System Design
<img width="1430" height="541" alt="image" src="https://github.com/user-attachments/assets/cb171a38-a8b1-42b5-992a-2edfd6d5a137" />

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🤖 AI-Powered Recommendations
- Semantic search using Pinecone embeddings
- Natural language query understanding
- Risk-adjusted scoring algorithm
- Personalized fund matching

</td>
<td width="50%">

### 📈 Advanced Analytics
- Real-time performance tracking
- Category-wise distribution
- Historical returns analysis
- Fund comparison tools

</td>
</tr>
<tr>
<td width="50%">

### 🎯 Smart Filtering
- Filter by AMC, category, risk level
- Dynamic subcategory selection
- Rating-based sorting
- Minimum investment filters

</td>
<td width="50%">

### 💰 Trading & Portfolio
- Buy/Sell mutual funds
- Portfolio tracking & analytics
- Holdings management
- Real-time P&L calculations

</td>
</tr>
<tr>
<td width="50%">

### 🔐 Authentication & Security
- NextAuth.js integration
- Google OAuth login
- JWT-based session management
- Secure API endpoints

</td>
<td width="50%">

### 💳 Wallet Management
- Add/withdraw funds
- Transaction history
- Real-time balance updates
- Payment gateway integration

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 16 + React | Server-side rendering, optimal performance |
| **Backend** | Express.js + TypeScript | RESTful API, type safety |
| **Database** | PostgreSQL + Prisma | Structured data storage, ORM |
| **Vector DB** | Pinecone | Semantic search, embeddings |
| **Authentication** | NextAuth.js | OAuth, JWT sessions |
| **State Management** | TanStack Query | Server state, caching |
| **Monorepo** | Turborepo + pnpm | Build optimization, workspace management |
| **Styling** | Tailwind CSS + shadcn/ui | Utility-first styling, component library |
| **Validation** | Zod | Runtime type validation |

</div>

---

## 📦 Project Structure

```
Ai_Mutual_Fund_System/
├── 📱 apps/
│   └── mutualFundUi/          # Next.js frontend application
│       ├── app/               # App router pages
│       ├── components/        # React components
│       └── public/            # Static assets
│
├── 🖥️ servers/
│   └── express-server/        # Express.js backend
│       ├── api/               # API route exports
│       ├── controller/        # Request handlers
│       ├── routes/            # Route definitions
│       └── utils/             # Helper functions
│
├── 🧠 services/
│   └── aiSystemPinecone/      # AI recommendation service
│       ├── service.ts         # Business logic
│       ├── seeder.ts          # Data seeding script
│       └── types.ts           # Type definitions
│
├── 🗄️ database/
│   └── Prisma/                # Database layer
│       ├── schemas/           # Prisma schemas
│       │   └── prisma/
│       │       ├── schema.prisma
│       │       ├── user.prisma
│       │       └── mutualFund.prisma
│       └── prisma.ts          # Prisma client
│
└── 📦 packages/
    ├── common/                # Shared utilities
    │   ├── environment/       # Env validation
    │   ├── types/             # Shared types
    │   └── helper/            # Helper functions
    ├── ui/                    # Shared UI components
    └── eslint-config/         # ESLint configurations
```

---

## 🚀 Quick Start

### Prerequisites

```bash
Node.js >= 18.12
pnpm >= 9.0.0
PostgreSQL >= 14
Pinecone Account
```

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Ai_Mutual_Fund_System

# Install dependencies
pnpm install

# Setup environment variables
cp packages/common/secrets/.env.example packages/common/secrets/.env.local
# Add your credentials to .env.local
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mutual_funds"

# Pinecone Vector DB
PINECONE_API_KEY="your_pinecone_api_key"
PINECONE_INDEX_NAME="mutual-funds-index"

# Server Configuration
HTTP_SERVER_PORT=8080
BASE_API_ENDPOINT="/api/v1/ai-mutual-fund-system"
CLIENT_ORIGIN="http://localhost:3000"

# NextAuth Configuration
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Frontend
NEXT_PUBLIC_API_URL="http://localhost:8080"
```

### Database Setup

```bash
# Generate Prisma client
cd database/Prisma
pnpm prisma:generate

# Run migrations
pnpm prisma:migrate

# Seed data (CSV → Prisma + Pinecone)
cd ../../services/aiSystemPinecone
pnpm seed
```

### Development

```bash
# Build all packages
pnpm build

# Start development servers
pnpm dev

# Or start specific services
pnpm dev --filter=@repo/express
pnpm dev --filter=@repo/mutual_fund_ui
```

### Production

```bash
# Build for production
pnpm build

# Start production server
pnpm start:prod
```

---

## 🔄 Data Flow

<div align="center">

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant S as Service
    participant P as Prisma
    participant V as Pinecone

    U->>F: Enter investment criteria
    F->>A: POST /recommendations
    A->>S: getRecommendations()
    S->>V: Semantic search query
    V-->>S: Top 10 fund IDs
    S->>P: Fetch fund details
    P-->>S: Complete fund data
    S->>S: Calculate projections
    S->>S: Rank by score
    S-->>A: Ranked recommendations
    A-->>F: JSON response
    F-->>U: Display results
```

</div>

---

## 🎯 API Endpoints

### 🔍 Mutual Funds

```http
# Get AI Recommendations
POST /api/v1/ai-mutual-fund-system/mutual-funds/recommendations

# Get All Funds (Paginated)
GET /api/v1/ai-mutual-fund-system/mutual-funds/all?page=1&limit=10&search=

# Get Analytics
GET /api/v1/ai-mutual-fund-system/mutual-funds/analytics

# Get Filters
GET /api/v1/ai-mutual-fund-system/mutual-funds/filters

# Get Fund Details
GET /api/v1/ai-mutual-fund-system/mutual-funds/:id
```

### 💼 Trading & Portfolio

```http
# Place Order (Buy/Sell)
POST /api/v1/ai-mutual-fund-system/trading/orders

# Get Holdings
GET /api/v1/ai-mutual-fund-system/trading/holdings

# Get Orders History
GET /api/v1/ai-mutual-fund-system/trading/orders

# Watchlist Management
GET /api/v1/ai-mutual-fund-system/trading/watchlist
POST /api/v1/ai-mutual-fund-system/trading/watchlist
DELETE /api/v1/ai-mutual-fund-system/trading/watchlist/:id
```

### 💳 Wallet Management

```http
# Get Balance
GET /api/v1/ai-mutual-fund-system/wallet/balance

# Add Funds
POST /api/v1/ai-mutual-fund-system/wallet/add-funds

# Get Transactions
GET /api/v1/ai-mutual-fund-system/wallet/transactions
```

### 🔐 Authentication

```http
# User Authentication
POST /api/v1/ai-mutual-fund-system/user/auth
```

---

## 🧮 Recommendation Algorithm

```typescript
// Scoring Formula
score = (rating × 20) + (expectedReturn × 5) - (riskLevel × 2)

// Return Selection Logic
expectedReturn = tenure >= 5 ? returns5yr :
                 tenure >= 3 ? returns3yr :
                 returns1yr

// Projection Calculation
projectedValue = amountInvested × (1 + expectedReturn/100)^tenure
```

---

## 📈 Performance Metrics

<div align="center">

| Metric | Value |
|--------|-------|
| **API Response Time** | < 200ms |
| **Database Query Time** | < 50ms |
| **Vector Search Time** | < 100ms |
| **Frontend Load Time** | < 1.5s |
| **Build Time** | < 30s |

</div>

---

## 🎨 Features Roadmap

### ✅ Completed Features
- [x] AI-powered recommendations with Pinecone
- [x] Real-time analytics dashboard
- [x] Semantic search & filtering
- [x] Fund filtering and sorting
- [x] User authentication (NextAuth + Google OAuth)
- [x] Portfolio tracking & analytics
- [x] Trading system (Buy/Sell orders)
- [x] Wallet management
- [x] Holdings & P&L tracking
- [x] Responsive UI with dark theme
- [x] Real-time data updates

### 🚧 In Progress
- [ ] SIP automation
- [ ] Goal-based planning
- [ ] Performance alerts
- [ ] Fund comparison tool

### 📋 Planned Features
- [ ] Historical backtesting
- [ ] Mobile app (React Native)
- [ ] Advanced charting
- [ ] Tax optimization
- [ ] Risk assessment tools
- [ ] Social trading features

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License with additional usage requirements.

**⚠️ IMPORTANT USAGE REQUIREMENT:**
Before using this code, you MUST email invinciblecoder071723@gmail.com with:
- Your name/organization
- Intended use case
- Project description

**🚫 Anti-Plagiarism Notice:**
This software is protected against plagiarism. Unauthorized copying or claiming as your own work is prohibited. Proper attribution to "Invincible Coder" is required.

See [LICENSE](./LICENSE) for full terms.

---

## 👥 Team

<div align="center">

Built with ❤️ by passionate developers committed to democratizing wealth management

</div>

---

## 📞 Support

For support, email invinciblecoder071723@gmail.com

---

<div align="center">

### ⭐ Star us on GitHub — it motivates us a lot!

[![GitHub stars](https://img.shields.io/github/stars/yourusername/ai-mutual-fund-system?style=social)](https://github.com/yourusername/ai-mutual-fund-system)

---

**Made with 💜 using Next.js, Prisma, Pinecone & Turborepo**

</div>
