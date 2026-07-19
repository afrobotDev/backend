# Backend JavaScript Learning Projects

This repository contains three small Node.js/Express backend projects that build on each other:

- `getting_started/` - a minimal Express server that demonstrates basic HTTP routes and JSON request handling.
- `node_with_sqlite/` - a full-stack todo app with Express, JWT authentication, an in-memory SQLite database, and a static browser UI.
- `full-backend/` - a more production-like todo API with Express, JWT authentication, PostgreSQL, Prisma, Docker, and a health check.

The projects are useful as a learning path: start with the simple Express server, move to the SQLite todo app, then use the Dockerized Prisma/PostgreSQL backend when you want persistent storage and a deployable service shape.

## Repository Layout

```text
.
|-- getting_started/
|   `-- web_server.js
|-- node_with_sqlite/
|   |-- public/
|   |   |-- fanta.css
|   |   |-- index.html
|   |   `-- style.css
|   |-- src/
|   |   |-- database.js
|   |   |-- middleware/
|   |   |-- routes/
|   |   `-- server.js
|   `-- package.json
|-- full-backend/
|   |-- prisma/
|   |   `-- schema.prisma
|   |-- src/
|   |   |-- middleware/
|   |   |-- routes/
|   |   |-- prisma.js
|   |   `-- server.js
|   |-- Dockerfile
|   |-- docker-compose.yml
|   `-- package.json
|-- package.json
`-- README.md
```

## Requirements

- Node.js 24 or newer is recommended.
- npm.
- Docker and Docker Compose for the `full-backend/` PostgreSQL setup.

Node 24 is especially relevant for `node_with_sqlite/`, because it uses the built-in `node:sqlite` module.

## Quick Start

### 1. Minimal Express Server

From the repository root:

```sh
npm install
npm run dev
```

The server listens on `http://localhost:3000`.

Available routes:

- `GET /` - returns a simple HTML page.
- `GET /users` - returns the current in-memory user data.
- `POST /users` - appends JSON object values to the in-memory data store.
- `PUT /users` - replaces the last value for each submitted key, or creates the key if it does not exist.
- `DELETE /users` - clears the in-memory data store.

Example:

```sh
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice"}'
```

Notes:

- Data is stored only in process memory.
- The root route serves image tags that point at files under an absolute local path used during development. Those image files may not exist on another machine.

## SQLite Todo App

The `node_with_sqlite/` project is an Express todo application with:

- JWT-based registration and login.
- Password hashing with `bcryptjs`.
- Authenticated todo CRUD routes.
- Static frontend served from `public/`.
- An in-memory SQLite database created at server startup.

### Setup

```sh
cd node_with_sqlite
npm install
```

Create a local `.env` file:

```sh
JWT_SECRET=replace-this-with-a-local-secret
PORT=3000
```

Start the app:

```sh
npm run dev
```

Open `http://localhost:3000` to use the browser UI.

### API

Authentication:

- `POST /auth/register`
- `POST /auth/login`

Request body:

```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

Successful authentication returns:

```json
{
  "token": "jwt-token"
}
```

Todos require an `Authorization: Bearer <token>` header.

- `GET /todos` - list todos for the authenticated user.
- `POST /todos` - create a todo.
- `PUT /todos/:id` - mark or update completion status.
- `DELETE /todos/:id` - delete a todo.

Create a todo:

```sh
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"task":"Write README"}'
```

Important behavior:

- The database is `:memory:`, so all users and todos are lost when the server restarts.
- Each new user receives one default todo after registration.
- The frontend stores the JWT in `localStorage`.

## Full Backend: Express, Prisma, and PostgreSQL

The `full-backend/` project is the most complete backend in this repository. It has the same basic auth and todo behavior as the SQLite app, but stores data in PostgreSQL through Prisma.

Features:

- Express 5 API server.
- JWT authentication middleware.
- Password hashing with `bcryptjs`.
- Prisma data models for users and todos.
- PostgreSQL persistence.
- Dockerfile and Docker Compose setup.
- `/health` endpoint for container health checks.

### Run With Docker Compose

From `full-backend/`:

```sh
cd full-backend
docker compose up --build
```

Docker Compose starts:

- `api` on `http://localhost:3000`
- `db`, a PostgreSQL 16 container

The API container waits for PostgreSQL to become healthy, runs `npm run db:push`, then starts the Express server.

Check the health endpoint:

```sh
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok"
}
```

Stop the stack:

```sh
docker compose down
```

Remove the database volume as well:

```sh
docker compose down -v
```

### Run Locally Without Docker

Use this path if you already have PostgreSQL running locally.

```sh
cd full-backend
npm install
```

Create `full-backend/.env`:

```sh
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/full_backend?schema=public
JWT_SECRET=replace-this-with-a-local-secret
PORT=3000
```

Generate the Prisma client and push the schema:

```sh
npm run prisma:generate
npm run db:push
```

Start the server:

```sh
npm run dev
```

### Prisma Schema

`full-backend/prisma/schema.prisma` defines two models:

- `User`
  - `id`
  - `username`
  - `password`
  - relation to `Todo`
- `Todo`
  - `id`
  - `user_id`
  - `task`
  - `completed`
  - relation to `User`

The Prisma client is generated into `full-backend/generated/prisma`.

### API

Authentication:

- `POST /auth/register`
- `POST /auth/login`

Request body:

```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

Successful response:

```json
{
  "token": "jwt-token"
}
```

Protected todo routes:

- `GET /todos`
- `POST /todos`
- `PUT /todos/:id`
- `DELETE /todos/:id`

Example request flow:

```sh
TOKEN=$(
  curl -s -X POST http://localhost:3000/auth/register \
    -H "Content-Type: application/json" \
    -d '{"username":"user@example.com","password":"password123"}' \
  | node -e "let body=''; process.stdin.on('data', c => body += c); process.stdin.on('end', () => console.log(JSON.parse(body).token));"
)

curl http://localhost:3000/todos \
  -H "Authorization: Bearer $TOKEN"

curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"task":"Ship the backend"}'
```

## Environment Variables

### `node_with_sqlite/.env`

| Variable | Required | Description |
| --- | --- | --- |
| `JWT_SECRET` | Yes | Secret used to sign and verify JWTs. |
| `PORT` | No | Server port. Defaults to `3000`. |

### `full-backend/.env`

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Prisma. |
| `JWT_SECRET` | Yes | Secret used to sign and verify JWTs. |
| `PORT` | No | Server port. Defaults to `3000`. |
| `NODE_ENV` | No | Runtime environment. Docker sets this to `production`. |

Do not commit `.env` files. They are ignored by `.gitignore`.

## Scripts

Root `package.json`:

| Script | Description |
| --- | --- |
| `npm run dev` | Starts `getting_started/web_server.js` with watch mode. |
| `npm start` | Starts `getting_started/web_server.js`. |
| `npm test` | Placeholder script that currently exits with an error. |

`node_with_sqlite/package.json`:

| Script | Description |
| --- | --- |
| `npm run dev` | Starts the SQLite todo app with watch mode and `--env-file=.env`. |
| `npm test` | Placeholder script that currently exits with an error. |

`full-backend/package.json`:

| Script | Description |
| --- | --- |
| `npm run dev` | Starts the Prisma/PostgreSQL API with watch mode and `--env-file=.env`. |
| `npm start` | Starts the API without watch mode. |
| `npm run prisma:generate` | Generates the Prisma client. |
| `npm run db:push` | Pushes the Prisma schema to the configured database. |
| `npm test` | Placeholder script that currently exits with an error. |

## Security Notes

- Use a strong `JWT_SECRET` outside local development.
- Passwords are hashed before storage, but request validation is minimal.
- The example APIs do not currently include rate limiting, CSRF protection, refresh tokens, password reset, account verification, or detailed input validation.
- The browser UI stores tokens in `localStorage`, which is simple for learning but has tradeoffs for production apps.

## Known Limitations

- There are no automated tests yet.
- Error handling is intentionally simple and mostly returns generic status codes.
- The SQLite app uses an in-memory database, so it is not persistent.
- The root `getting_started/` server stores data in memory and includes local-machine-specific static image paths.
- The todo update/delete routes are scoped to the authenticated user, but invalid IDs and missing records are not handled with detailed API errors.

## Suggested Next Steps

- Add request validation for auth and todo payloads.
- Add automated tests for auth, middleware, and todo ownership.
- Add persistent SQLite storage if the SQLite example should retain data after restart.
- Add migrations for the Prisma backend instead of relying only on `prisma db push`.
- Add structured logging and centralized error handling.
