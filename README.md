markdown
# Notification System - Full Stack Challenge

A REST API for managing notifications for authenticated users, built with NestJS, PostgreSQL, and Docker.

## Swagger
- Local: http://localhost:3003/api

## Features
- User registration and authentication with JWT
- Create, read, update and delete notifications
- Notification delivery simulation by channel (Email, SMS, Push)
- Extensible channel strategy pattern — adding new channels requires no changes to existing logic
- E2E and unit tests with isolated test database
- Dockerized for both development and testing environments

## Tech Stack
- **NestJS 11** — Backend framework
- **TypeORM** — ORM integrated with NestJS
- **PostgreSQL 15** — Relational database
- **Passport JWT** — Authentication
- **Jest** — Unit and E2E testing
- **Swagger** — API documentation
- **Docker / Docker Compose** — Containerization

## Pre-requisites
- Docker installed without sudo
- Docker Compose installed without sudo
- Ports free: 3003, 2222, 5432

## How to run the app
```bash
chmod 711 ./up_dev.sh
./up_dev.sh
```

## How to run the tests
```bash
chmod 711 ./up_test.sh
./up_test.sh
```

## How to run locally without Docker
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start in development mode
PORT=3001 npm run start:dev
```

## Environment variables
Copy `.env.example` and fill in the values:
DB_HOST=localhost
DB_PORT=2222
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=notification_db
NODE_ENV=development
JWT_SECRET=your-secret-key


## Project Structure
src/
├── auth/           # JWT authentication, guards, strategies
├── notification/   # Notification module, strategies by channel
│   └── strategies/ # Email, SMS, Push — Strategy Pattern
├── user/           # User module
└── database/       # Database configuration
test/
├── helpers/        # Shared test setup and auth helpers
└── notification.e2e-spec.ts


## Architectural Decisions

**Strategy Pattern for notification channels** — Each channel (Email, SMS, Push) has its own strategy class implementing a common interface. Adding a new channel only requires creating a new strategy class, without modifying existing logic. This satisfies the Open/Closed principle.

**JWT Authentication** — Stateless authentication using signed tokens. Every protected endpoint validates the token via a NestJS guard, ensuring users can only access their own notifications.

**TypeORM** — Chosen for its native integration with NestJS and its active community. Used with `synchronize: true` for development simplicity.

**Docker** — Two separate compose files: one for development (`docker-compose.yml`) and one for testing (`docker-compose.test.yml`), each with its own isolated database volume to prevent data contamination between environments.

**Separate test database** — E2E tests run against `notification_db_test`, completely isolated from the development database. The schema is dropped and recreated before each test suite.

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/login | Login and get access token |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /user | Register new user |
| GET | /user | Get all users |
| GET | /user/:id | Get user by ID |
| PATCH | /user/:id | Update user |
| DELETE | /user/:id | Delete user |

### Notifications
| Method | Endpoint | Description | Auth required |
|--------|----------|-------------|---------------|
| POST | /notification | Create notification | ✅ |
| GET | /notification | Get own notifications | ✅ |
| GET | /notification/:id | Get notification by ID | ✅ |
| PATCH | /notification/:id | Update notification | ✅ |
| DELETE | /notification/:id | Delete notification | ✅ |

## Areas to improve
- Migrate from `synchronize: true` to proper TypeORM migrations with seed data
- Add user registration endpoint under `/auth/register`
- Improve error handling for duplicate users and invalid channels
- Add CI/CD pipeline
- Add coverage reporting
- Move test data to external fixtures files
Dos cosas que dejé marcadas en "Areas to improve" que te conviene mencionar en la defensa para mostrar criterio:

synchronize: true — funciona bien para desarrollo pero en producción deberían usarse migraciones para no perder datos ante cambios de schema.
/auth/register — el registro está en /user en lugar de /auth/register, lo cual es una inconsistencia semántica que podrías corregir en el futuro.







