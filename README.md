# FleetCore API

FleetCore is a REST API for managing a vehicle fleet, mechanics, workshops, and maintenance records. It is built with NestJS, TypeScript, TypeORM, and PostgreSQL. Swagger is provided for API exploration and testing.

## Coder Information

- **Name:** Camilo Andrés Villalobos Ruiz
- **Clan:** Node/Nest

## Requirements

- Node.js 24 or a compatible recent Node.js release
- npm
- Docker and Docker Compose (recommended for running PostgreSQL), or a local PostgreSQL 16+ instance

## 1. Install the dependencies

Clone or extract this repository, then open a terminal in the project directory:

```bash
npm install
```

## 2. Configure environment variables

Create a `.env` file by copying the example file:

```bash
cp .env.example .env
```

Review the variables in `.env`:

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port used by the API | `3000` |
| `DB_HOST` | PostgreSQL hostname | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USERNAME` | PostgreSQL username | `postgres` |
| `DB_PASSWORD` | PostgreSQL password | `postgres` |
| `DB_NAME` | Database name | `fleetcore` |
| `JWT_SECRET` | Secret used to sign JWT tokens | Replace the example with a private secret |
| `JWT_EXPIRES_IN` | JWT expiration period | `1h` |
| `API_KEYS` | Comma-separated API keys for external integrations | `demo-key-1,demo-key-2` |

The values above are local development examples. Do not use example secrets or API keys in production.

## 3. Start PostgreSQL

### Option A: Start only the database with Docker Compose

The following command starts the PostgreSQL service defined in `docker-compose.yml`:

```bash
docker compose up -d db
```

Check that it is running:

```bash
docker compose ps
```

For this option, keep `DB_HOST=localhost` in your local `.env` file.

### Option B: Use an existing PostgreSQL instance

Create a database named `fleetcore` (or use the name configured in `DB_NAME`) and update the database connection variables in `.env`.

## 4. Build the project and run the seeder

Build the TypeScript project:

```bash
npm run build
```

Run the seeder:

```bash
node dist/seed/seed.js
```

The seeder creates sample users, mechanics, workshops, vehicles, and maintenance records. It is designed to be re-run without duplicating the seeded records.

### Test credentials

| Role | Email | Password |
|---|---|---|
| Administrator | `admin@fleetcore.com` | `Admin123*` |
| Technician | `tecnico1@fleetcore.com` | `Tech123*` |
| Technician | `tecnico2@fleetcore.com` | `Tech123*` |

Use these accounts for local testing only.

## 5. Run the API

Start the API in development mode:

```bash
npm run start:dev
```

The API will be available at:

- **Base URL:** `http://localhost:3000`
- **Swagger UI:** `http://localhost:3000/docs`

Open Swagger, select an endpoint, and use **Try it out** to send requests.

## 6. Authenticate and test protected endpoints

1. In Swagger, open `POST /auth/login`.
2. Submit a test user's email and password.
3. Copy the returned `accessToken`.
4. Click **Authorize** in Swagger and provide the token as a Bearer token.
5. Call the protected endpoints available to that user's role.

The API uses JWT authentication and role-based authorization. The integration endpoint uses an API key instead of a JWT.

### External integration endpoint

The integration route for a vehicle's maintenance history is:

```http
GET /integrations/vehiculos/{placa}/historial-mantenimiento
```

Include this header with one of the keys configured in `API_KEYS`:

```http
x-api-key: demo-key-1
```

For example, the seeded vehicle plate `ABC123` can be used to test the route. In Swagger, open the **Authorize** control or the endpoint's header parameter and enter the API key as required by the documentation.

## Useful commands

```bash
npm run start:dev  # Run in watch mode
npm run build      # Compile the project
```

## Main modules

- **Authentication:** registration, login, and current-user information.
- **Vehicles:** vehicle records and status.
- **Mechanics:** mechanic records and availability.
- **Workshops:** workshop records and status.
- **Maintenance:** maintenance scheduling, progress, and history.
- **Integrations:** API-key-protected access to a vehicle's maintenance history.
