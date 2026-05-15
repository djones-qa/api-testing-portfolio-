# API Testing Portfolio

A REST API test suite built with **Playwright's API testing capabilities** and **TypeScript**, targeting the [Restful Booker](https://restful-booker.herokuapp.com) public API.

This repo demonstrates pure API testing skills independent of any UI layer — a companion to the [e2e-testing-portfolio](https://github.com/Djones-qa/e2e-testing-portfolio).

---

## What's Covered

| Area | Details |
|---|---|
| **Auth** | Token generation, invalid credentials, missing fields |
| **CRUD** | GET, POST, PUT, PATCH, DELETE against `/booking` |
| **Chained Requests** | Full lifecycle: create → read → update → delete using the same booking ID |
| **Schema Validation** | AJV-powered JSON schema checks on all response shapes |
| **Filters / Query Params** | Filtering bookings by name and date |
| **Data-Driven Tests** | Same test logic run across multiple guest profiles |
| **Negative Tests** | 404s, 403s, missing auth, post-delete verification |

---

## Tech Stack

- [Playwright Test](https://playwright.dev/docs/api-testing) — API request context
- [TypeScript](https://www.typescriptlang.org/)
- [AJV](https://ajv.js.org/) — JSON Schema validation

---

## Project Structure

```
api-testing-portfolio/
├── tests/
│   ├── auth.spec.ts            # Token auth tests
│   ├── crud.spec.ts            # Full CRUD operations
│   ├── chainedRequests.spec.ts # End-to-end booking lifecycle
│   ├── schema.spec.ts          # JSON schema validation
│   ├── filters.spec.ts         # Query param filtering
│   ├── dataDriven.spec.ts      # Data-driven guest profiles
│   └── negativeTests.spec.ts   # Error handling & edge cases
├── utils/
│   ├── auth.ts                 # Token helper (cached)
│   ├── bookingHelpers.ts       # Create/delete helpers + types
│   └── schemaValidator.ts      # AJV wrapper
├── schemas/
│   └── bookingSchema.ts        # AJV schemas for booking responses
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Install Playwright (no browsers needed for API testing)
npx playwright install

# Run all tests
npm test

# Run by tag
npm run test:smoke       # @smoke — fast sanity check
npm run test:crud        # @crud — all CRUD operations
npm run test:auth        # @auth — authentication tests
npm run test:schema      # @schema — schema validation
npm run test:data-driven # @data-driven — parameterised tests

# View HTML report
npm run report
```

---

## API Under Test

**Restful Booker** — `https://restful-booker.herokuapp.com`

A purpose-built public API for testing practice. Supports full CRUD on hotel bookings with token-based authentication.

| Endpoint | Method | Description |
|---|---|---|
| `/auth` | POST | Generate auth token |
| `/booking` | GET | List all bookings (supports filters) |
| `/booking` | POST | Create a booking |
| `/booking/:id` | GET | Get a single booking |
| `/booking/:id` | PUT | Full update (requires auth) |
| `/booking/:id` | PATCH | Partial update (requires auth) |
| `/booking/:id` | DELETE | Delete a booking (requires auth) |

---

## Key Patterns Demonstrated

**Token caching** — auth token is fetched once and reused across tests in the same run.

**Chained requests** — booking ID from `POST` flows directly into `GET`, `PUT`, `PATCH`, and `DELETE` — no hardcoded IDs.

**Self-contained tests** — each test creates and cleans up its own data, so tests can run in any order.

**Data-driven loops** — a single test definition runs against multiple guest profiles using a `for...of` loop over a typed array.

**Schema contracts** — AJV validates response shapes so structural regressions are caught immediately.
