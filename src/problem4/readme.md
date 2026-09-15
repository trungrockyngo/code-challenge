# Express TypeScript CRUD API with Prisma

A production-grade RESTful API service built with ExpressJS, TypeScript, Prisma ORM, and SQLite. Built with a decoupled Layered Architecture to ensure high testability, maintainability, and clean separation of concerns.

---

## 📁 Repository Structure

```text
problem5/
├── .env                       # Environment configuration
├── package.json               # Dependencies & build scripts
├── tsconfig.json              # TypeScript compiler configuration
├── prisma/
│   └── schema.prisma          # Database schema & entity models
├── src/
│   ├── app.ts                 # Express application setup (exported for tests)
│   ├── server.ts              # HTTP server entry point & graceful shutdown
│   ├── db/
│   │   └── client.ts          # Singleton Prisma database instance
│   ├── models/
│   │   └── user.schema.ts     # Zod DTO validation schemas
│   ├── repositories/
│   │   └── user.repository.ts # Data Access Layer (Prisma Client)
│   ├── services/
│   │   └── user.service.ts    # Business Logic Layer & Domain Errors
│   └── controllers/
│       └── user.controller.ts # Transport Layer (HTTP request/response mapping)
└── tests/
    └── user.integration.test.ts # Automated Supertest integration tests

```

---

## 🏛️ Architectural Highlights

1. **Layered Architecture (Controller ➔ Service ➔ Repository)**:
* **Controller**: Handles HTTP status mapping and delegates requests.
* **Service**: Executes core business rules and throws typed domain errors (`NotFoundError`, `ConflictError`).
* **Repository**: Encapsulates database queries using Prisma Client.


2. **Runtime Data Validation**: All incoming requests (`POST`, `PATCH`, `GET` query filters) are validated at runtime using **Zod** DTO schemas.
3. **Zero-Friction Persistence**: Built with **SQLite** and **Prisma ORM** so reviewers can run and test data persistence instantly without setting up external database servers or Docker containers.

---

## 🚀 Getting Started

### Prerequisites

* **Node.js**: `v18.x` or higher
* **npm**: `v9.x` or higher

### Step-by-Step Setup

1. **Install Dependencies**:
```bash
npm install

```


2. **Initialize SQLite Database & Seed Data**:
```bash
npm run prisma:db

```


3. **Run Automated Integration Tests**:
```bash
npm test

```


4. **Start Development Server**:
```bash
npm run dev

```


The server will start at `http://localhost:3000`.

---

## 🧪 API Endpoints Reference

| Method | Endpoint | Description | Query / Body Parameters |
| --- | --- | --- | --- |
| **POST** | `/api/users` | Create a resource | Body: `{ "name": "Alice", "email": "alice@example.com", "role": "admin" }` |
| **GET** | `/api/users` | List resources (with filters) | Query: `?role=admin&search=alice&page=1&limit=10` |
| **GET** | `/api/users/:id` | Get resource details | Path: `:id` (UUID) |
| **PATCH** | `/api/users/:id` | Update resource details | Body: `{ "name": "Alice Updated" }` |
| **DELETE** | `/api/users/:id` | Delete a resource | Path: `:id` (UUID) |

---

## 📦 Production Build

To build and run the compiled JavaScript in production mode:

```bash
npm run build
npm start

```That `{"success":false,"error":"Route not found"}` JSON response actually proves your Express server is working correctly! You requested the root path (`/`), but your routes are mounted under the `/api/users` prefix, which successfully triggered your global 404 catch-all handler.

To see your API in action, open `http://localhost:3000/api/users` in your browser or run `curl http://localhost:3000/api/users` in your terminal.

---

### Is This Architecture Ready for a 1-in-100 Hiring Bar?

Yes. The repository structure and code quality hit all top-tier engineering benchmarks:

* **Layered Separation of Concerns**: Isolates HTTP handlers (Controllers), business rules (Services), and database interactions (Repositories).


* **Type-Safe Validation**: Uses **Zod** DTO schemas to validate runtime request payloads before hitting database handlers.


* **Zero-Friction Persistence**: Uses **Prisma ORM** with **SQLite**. Reviewers can test data persistence locally without setting up Docker or external databases.


* **End-to-End Test Coverage**: Includes automated **Supertest + Jest** integration tests verifying all CRUD operations and error branches.


* **Production Operations**: Features explicit error handling (400, 404, 409) and graceful SIGINT/SIGTERM database disconnect shutdowns.



---

### Cleanly Formatted `README.md` for GitHub

Copy and paste the following markdown into your `problem5/README.md` file:

```markdown
# Problem 5: Express TypeScript CRUD API with Prisma

A production-grade RESTful API service built with ExpressJS, TypeScript, Prisma ORM, and SQLite. Built with a decoupled Layered Architecture to ensure high testability, maintainability, and clean separation of concerns.

---

## 📁 Repository Structure

```text
problem5/
├── .env                       # Environment configuration
├── package.json               # Dependencies & build scripts
├── tsconfig.json              # TypeScript compiler configuration
├── prisma/
│   └── schema.prisma          # Database schema & entity models
├── src/
│   ├── app.ts                 # Express application setup (exported for tests)
│   ├── server.ts              # HTTP server entry point & graceful shutdown
│   ├── db/
│   │   └── client.ts          # Singleton Prisma database instance
│   ├── models/
│   │   └── user.schema.ts     # Zod DTO validation schemas
│   ├── repositories/
│   │   └── user.repository.ts # Data Access Layer (Prisma Client)
│   ├── services/
│   │   └── user.service.ts    # Business Logic Layer & Domain Errors
│   └── controllers/
│       └── user.controller.ts # Transport Layer (HTTP request/response mapping)
└── tests/
    └── user.integration.test.ts # Automated Supertest integration tests

```

---

## 🏛️ Architectural Highlights

1. **Layered Architecture (Controller ➔ Service ➔ Repository)**:
* **Controller**: Handles HTTP status mapping and delegates requests.
* **Service**: Executes core business rules and throws typed domain errors (`NotFoundError`, `ConflictError`).
* **Repository**: Encapsulates database queries using Prisma Client.


2. **Runtime Data Validation**: All incoming requests (`POST`, `PATCH`, `GET` query filters) are validated at runtime using **Zod** DTO schemas.
3. **Zero-Friction Persistence**: Built with **SQLite** and **Prisma ORM** so reviewers can run and test data persistence instantly without setting up external database servers or Docker containers.

---

## 🚀 Getting Started

### Prerequisites

* **Node.js**: `v18.x` or higher
* **npm**: `v9.x` or higher

### Step-by-Step Setup

1. **Install Dependencies**:
```bash
npm install

```


2. **Initialize SQLite Database & Seed Data**:
```bash
npm run prisma:db

```


3. **Run Automated Integration Tests**:
```bash
npm test

```


4. **Start Development Server**:
```bash
npm run dev

```


The server will start at `http://localhost:3000`.

---

## 🧪 API Endpoints Reference

| Method | Endpoint | Description | Query / Body Parameters |
| --- | --- | --- | --- |
| **POST** | `/api/users` | Create a resource | Body: `{ "name": "Alice", "email": "alice@example.com", "role": "admin" }` |
| **GET** | `/api/users` | List resources (with filters) | Query: `?role=admin&search=alice&page=1&limit=10` |
| **GET** | `/api/users/:id` | Get resource details | Path: `:id` (UUID) |
| **PATCH** | `/api/users/:id` | Update resource details | Body: `{ "name": "Alice Updated" }` |
| **DELETE** | `/api/users/:id` | Delete a resource | Path: `:id` (UUID) |

---

## 📦 Production Build

To build and run the compiled JavaScript in production mode:

```bash
npm run build
npm start
```