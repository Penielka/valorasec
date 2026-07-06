# Architecture

## Overview

ValoraSec is a monorepo built with **pnpm workspaces** and **Turborepo**. It follows a modular architecture designed for extensibility and maintainability.

## Tech Stack

| Layer      | Technology                                                 |
| ---------- | ---------------------------------------------------------- |
| Frontend   | Next.js 14 (App Router), React 18, Tailwind CSS, shadcn/ui |
| Backend    | NestJS 10, TypeScript, Prisma ORM                          |
| Database   | PostgreSQL 16                                              |
| Cache      | Redis 7                                                    |
| Blockchain | Stellar Testnet, Soroban SDK 22                            |
| Contracts  | Rust, Soroban SDK                                          |
| Build      | Turborepo, pnpm                                            |
| Testing    | Jest (API), Vitest (Frontend), Rust tests (Contracts)      |

## Component Flow

```
User → Next.js Frontend → SDK Client → NestJS API → Prisma → PostgreSQL
                                                    ↓
                                             Soroban Contracts
                                                    ↓
                                             Stellar Testnet
```

## Design Patterns

- **Repository Pattern** — Data access through Prisma service
- **Dependency Injection** — NestJS module system
- **Clean Architecture** — Separation of concerns across layers
- **Feature-based Structure** — Each domain has its own module

## Key Packages

### `@valorasec/shared`

Shared TypeScript types, interfaces, and constants used across the entire application.

### `@valorasec/analyzer`

Mock security analyzer with configurable rules. Designed to be replaced with a real analysis engine while maintaining the same interface.

### `@valorasec/sdk`

TypeScript API client with automatic token refresh. Used by the frontend to communicate with the backend.

### `@valorasec/ui`

Shared UI components built on shadcn/ui and Radix UI primitives.

## Database Schema

The database uses PostgreSQL with Prisma ORM. Key tables:

- `users` — User accounts and authentication
- `projects` — Project management
- `contracts` — Soroban contract addresses
- `scans` — Security scan records
- `reports` — Audit reports
- `audit_records` — On-chain verification records
- `notifications` — User notifications
- `sessions` — JWT session management

## Smart Contracts

Three Soroban contracts are provided:

1. **Audit Registry** — Stores and verifies audit records on-chain
2. **Reputation** — Tracks user reputation scores and badges
3. **Bug Bounty** — Manages bug bounty programs and payouts
