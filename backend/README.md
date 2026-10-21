# Workout App Backend

Node.js/Express + PostgreSQL REST API for a workout logging and calorie tracking app.
Consumed by [workout-app-frontend](https://github.com/balloon083/workout-app-frontend).

## Features
- JWT auth (signup / login, bcrypt-hashed passwords)
- Workouts with nested exercises and sets, saved in a single transaction
- Reusable workout programs
- Meal logging with macros and a daily summary endpoint
- Food search backed by the USDA FoodData Central API

## Project structure
```
server.js                 entry point, loads env and starts the server
src/
  app.js                  express app: middleware + route mounting
  config/db.js            pg pool + withTransaction helper
  middleware/             auth (JWT) and central error handling
  routes/                 URL -> controller wiring, nothing else
  controllers/            request validation and HTTP responses
  services/               business logic and SQL
  utils/                  HttpError, token helpers, small shared helpers
db/
  schema.sql              full schema for a fresh database
  migrations/             incremental changes for existing databases
```

Requests flow `route -> controller -> service -> database`. Controllers throw
`HttpError`s and Express 5 forwards them to `middleware/errorHandler.js`, so
there's no repeated try/catch in every handler.

## API
| Method | Path | Description |
| --- | --- | --- |
| POST | `/auth/signup` | Create an account |
| POST | `/auth/login` | Log in, returns a JWT |
| GET / POST | `/workouts` | List / create workouts |
| DELETE | `/workouts/:id` | Delete a workout |
| GET / POST | `/programs` | List / create programs |
| DELETE | `/programs/:id` | Delete a program |
| GET / POST | `/meals` | List / log meals |
| GET | `/meals/today` | Today's entries plus macro totals |
| PUT / DELETE | `/meals/:id` | Edit / delete a meal |
| GET | `/foods/search?query=` | Search the USDA food database |

Everything except `/auth/*` requires an `Authorization: Bearer <token>` header.

## Setup
```bash
git clone https://github.com/balloon083/workout-app-backend
cd workout-app-backend
npm install
cp .env.example .env      # then fill in DATABASE_URL and JWT_SECRET
npm run db:schema         # fresh database only
npm run dev
```

## Stack
Node.js, Express 5, PostgreSQL
