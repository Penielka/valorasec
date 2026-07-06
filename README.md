# ValoraSec

<div align="center">
  <img src="https://img.shields.io/badge/Stellar-Testnet-blue?style=flat-square" alt="Stellar Testnet" />
  <img src="https://img.shields.io/badge/Soroban-SDK%2022-green?style=flat-square" alt="Soroban SDK" />
  <img src="https://img.shields.io/badge/license-MIT-brightgreen?style=flat-square" alt="License MIT" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square" alt="PRs Welcome" />
</div>

<br />

**ValoraSec** is an open-source security platform for **Soroban smart contracts** on the **Stellar Network**. It provides automated security analysis, audit report generation, and on-chain verification — all from a modern, developer-friendly dashboard.

## ✨ Features

- 🔍 **Automated Security Analysis** — Mock rule-based analyzer with 8 security rules
- 📄 **Audit Reports** — Generate structured reports with severity scoring
- ⛓️ **On-Chain Verification** — Register audit records on Stellar Testnet via Soroban contracts
- 📊 **Dashboard** — Track projects, scans, and security scores
- 🌐 **Dark Mode** — Modern cybersecurity aesthetic by default
- 🐳 **Docker Ready** — One-command development environment with `docker compose up`

## 🏗️ Architecture

```
valorasec/
├── apps/
│   ├── web/          # Next.js frontend (App Router)
│   ├── api/          # NestJS backend
│   └── docs/         # Documentation site (Nextra)
├── packages/
│   ├── shared/       # Shared types and constants
│   ├── ui/           # Shared UI components
│   ├── sdk/          # TypeScript API client
│   └── analyzer/     # Mock security analyzer
├── contracts/
│   ├── audit-registry/   # On-chain audit registry (Soroban)
│   ├── reputation/       # Reputation system (Soroban)
│   └── bug-bounty/       # Bug bounty platform (Soroban)
└── docker/
    ├── Dockerfile
    └── docker-compose.yml
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 20
- **pnpm** >= 10
- **Docker** & **Docker Compose** (for full stack)
- **Rust** & **Soroban CLI** (for contracts)

### One-Command Start (Docker)

```bash
docker compose -f docker/docker-compose.yml up
```

This starts PostgreSQL, Redis, the API server, and the web application.

- **Web**: http://localhost:3000
- **API**: http://localhost:4000
- **Swagger Docs**: http://localhost:4000/api/docs

### Local Development

```bash
# Install dependencies
pnpm install

# Build shared packages
pnpm build --filter=@valorasec/shared --filter=@valorasec/analyzer --filter=@valorasec/sdk

# Start PostgreSQL and Redis
docker compose -f docker/docker-compose.yml up postgres redis -d

# Push database schema
cd apps/api && pnpm db:push

# Start development servers
pnpm dev
```

### Smart Contracts

```bash
# Navigate to a contract directory
cd contracts/audit-registry

# Build the contract
cargo build --target wasm32-unknown-unknown --release

# Deploy to Stellar Testnet
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/audit_registry.wasm \
  --source <your-secret-key> \
  --network testnet
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# API tests
cd apps/api && pnpm test

# Frontend tests
cd apps/web && pnpm test

# Contract tests
cd contracts/audit-registry && cargo test
```

## 📚 Documentation

- [Architecture Guide](./docs/ARCHITECTURE.md)
- [Development Guide](./docs/DEVELOPMENT.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [API Documentation](./docs/API.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [Security Policy](./SECURITY.md)

## 🛡️ Security

ValoraSec is designed to help secure Soroban smart contracts. If you discover a vulnerability in ValoraSec itself, please see our [Security Policy](./SECURITY.md).

## 📄 License

MIT © ValoraSec Contributors

---

<div align="center">
  Built with 💚 for the Stellar ecosystem
</div>
