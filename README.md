# 🚀 Madina Exam Project - Fullstack Monorepo

A modern full-stack web application built using a **pnpm Monorepo** architecture. It features a Fastify & PostgreSQL backend and a Vite + Vanilla JS frontend with a premium Glassmorphism design.

## 📦 Project Structure

This project uses `pnpm` workspaces to manage multiple applications in a single repository:

- `apps/backend/` - Fastify REST API Server
- `apps/frontend/` - Vite + Vanilla JS Client

## 🛠️ Tech Stack

**Backend:**
- [Fastify](https://fastify.dev/) - Lightning fast web framework for Node.js
- [PostgreSQL](https://www.postgresql.org/) - Relational Database (via `pg`)
- JWT Authentication & MD5 Password Hashing

**Frontend:**
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- Vanilla JavaScript & Modern CSS
- Premium "Aurora" Dark Glassmorphism UI Design

## ⚙️ Setup & Installation

### 1. Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)
- [PostgreSQL](https://www.postgresql.org/) Database

### 2. Install Dependencies
Run the following command at the root of the project to install all dependencies for both the frontend and backend automatically:
```bash
pnpm install
```

### 3. Database & Environment Setup
1. Create a PostgreSQL database for the project.
2. Run the SQL queries located in `apps/backend/sql/sql.sql` to create the required tables.
3. In the `apps/backend/` folder, create a `.env` file based on `.env.example`:
```env
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_DBNAME=exam
PG_PASSWORD=your_password
BACKEND_PORT=3000
JWT_SECRET=your_secret_key
```

### 4. Running the Application
Start both the Backend and Frontend development servers simultaneously from the root directory:
```bash
pnpm dev
```

- **Frontend Application:** http://localhost:5173
- **Backend API:** http://localhost:3000

## 🔐 API Endpoints

- `POST /signup` - Register a new user (can optionally register as admin)
- `POST /login` - Authenticate and receive a JWT token
- `GET /users` - Fetch users list (Requires Admin JWT Token, otherwise returns 403 Forbidden)

## ✨ Features
- Fully integrated Monorepo structure for seamless development.
- Secure JWT Token storage in browser `localStorage`.
- Protected Dashboard Route with Role-based access control.
- Beautiful animated Aurora Background with Frosted Glass UI.
