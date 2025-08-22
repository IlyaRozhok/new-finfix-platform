# FinFix - Financial Management Platform

A comprehensive financial platform for tracking monthly expenses, income, debts, and financial statistics.

## 🏗️ Architecture

- **Backend**: NestJS + PostgreSQL + Docker
- **Frontend**: Next.js + shadcn/ui + TypeScript + Tailwind CSS
- **Database**: PostgreSQL with Docker
- **API**: RESTful API with OpenAPI documentation

## 🚀 Features

- Monthly financial overview
- Debt tracking and management
- Financial statistics and analytics
- Historical data analysis
- Modern, responsive UI

## 📁 Project Structure

```
finfix-platform-2/
├── backend/                 # NestJS backend application
├── frontend/                # Next.js frontend application
├── docker/                  # Docker configuration files
├── docker-compose.yml       # Main docker-compose file
└── README.md               # This file
```

## 🛠️ Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
npm run start:dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Docker Setup

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🔧 Development

### Backend Development

- API runs on `http://localhost:3001`
- Database runs on `localhost:5432`
- Swagger documentation: `http://localhost:3001/api`

### Frontend Development

- Runs on `http://localhost:3000`
- Hot reload enabled
- TypeScript strict mode

## 📊 Database Schema

The platform will include tables for:

- Users
- Transactions (income/expenses)
- Debts
- Categories
- Monthly summaries

## 🚀 Deployment

Docker images are provided for:

- NestJS backend
- PostgreSQL database

Frontend can be deployed to Vercel, Netlify, or any static hosting service.

## 📝 License

MIT License
