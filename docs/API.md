# ValoraSec API Documentation

## Base URL

```
http://localhost:4000/api
```

## Authentication

All authenticated endpoints require a `Bearer` token in the `Authorization` header.

### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### Refresh Token

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

## Projects

### List Projects

```http
GET /api/projects?page=1&limit=10&search=my&network=testnet
Authorization: Bearer <token>
```

### Create Project

```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My DeFi Protocol",
  "description": "A decentralized exchange on Stellar",
  "network": "testnet"
}
```

### Get Project

```http
GET /api/projects/:id
Authorization: Bearer <token>
```

## Contracts

### Add Contract

```http
POST /api/projects/:projectId/contracts
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "LiquidityPool",
  "address": "CABC123...",
  "network": "testnet"
}
```

## Scans

### Run Scan

```http
POST /api/projects/:projectId/contracts/:contractId/scan
Authorization: Bearer <token>
```

### Get Scan

```http
GET /api/scans/:scanId
Authorization: Bearer <token>
```

## Reports

### Generate Report

```http
POST /api/scans/:scanId/report
Authorization: Bearer <token>
```

### Register On-Chain

```http
POST /api/reports/:id/register
Authorization: Bearer <token>
```

## Swagger

Full interactive API documentation is available at:

```
http://localhost:4000/api/docs
```
