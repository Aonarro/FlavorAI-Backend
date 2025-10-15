# Recipe App — Backend

This is the backend server for the Recipe App, built with **NestJS**, **TypeScript**, **PostgreSQL**, and **Prisma**. It handles user authentication, recipe management, and rating functionality. The server uses **Passport JWT** for secure access and is containerized with **Docker**.

---

## Features

- JWT-based user authentication
- Create, read, update, and delete recipes
- Rate recipes
- Protected endpoints for authenticated users
- PostgreSQL database with Prisma ORM
- Docker support for easy deployment
- CORS support for frontend integration

---

## Tech Stack

- **NestJS** — backend framework
- **TypeScript** — static typing
- **PostgreSQL** — relational database
- **Prisma** — ORM for database access
- **Passport JWT** — authentication
- **Docker** — containerization
- **Yarn** — package manager

---

## Environment Variables

Create a `.env` file in the root directory and add the following:

```env
PORT=8080

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/viso?schema=public"

JWT_ACCESS_SECRET="42a4243667864855cb582765d3d7c703e053d1f1667d38eb696fa4de43d241f9"
JWT_REFRESH_SECRET="7d7f5a6747dece98d47270a532cad5b9be78a16814323d8f34c04b8d673246d7"

JWT_ACCESS_EXPIRES="15m"
JWT_REFRESH_EXPIRES="7d"

CLIENT_URL="http://localhost:3000"
```

Getting Started

1. Clone the repository
   git clone https://github.com/Aonarro/FlavorAI-Backend
   cd recipe-app-backend
2. Install dependencies
   yarn install
3. Generate Prisma client
   npx prisma generate
4. Apply database migrations
   npx prisma migrate dev
5. Start the development server
   yarn start:dev

6. Docker Setup
   docker-compose up --build

API Endpoints

Auth

- POST /auth/register — Register a new user
- POST /auth/login — Log in and receive tokens
- GET /auth/me — Get current user info
- GET /auth/refresh — Refresh access token
- POST /auth/logout — Log out and clear tokens
  Recipes
- GET /recipes — Get all recipes
- GET /recipes/:id — Get recipe by ID
- GET /recipes/search?q=carbonara — Search recipe by title
- GET /recipes/me/list — Get recipes created by the current user
- POST /recipes — Create a new recipe
  Ratings
- POST /recipes/:id/rate — Submit a rating for a recipe
