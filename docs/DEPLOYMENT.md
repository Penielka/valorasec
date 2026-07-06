# Deployment Guide

## Docker Deployment

The easiest way to deploy ValoraSec is with Docker Compose:

```bash
# Clone the repository
git clone https://github.com/valorasec/valorasec.git
cd valorasec

# Start the full stack
docker compose -f docker/docker-compose.yml up -d
```

## Environment Variables

### API (`apps/api/.env`)

| Variable                    | Description                          | Default                                                    |
| --------------------------- | ------------------------------------ | ---------------------------------------------------------- |
| `DATABASE_URL`              | PostgreSQL connection string         | `postgresql://postgres:valorasec@localhost:5432/valorasec` |
| `JWT_SECRET`                | Secret for JWT signing               | _Required_                                                 |
| `JWT_EXPIRES_IN`            | Access token expiration              | `15m`                                                      |
| `JWT_REFRESH_EXPIRES_IN_MS` | Refresh token expiration (ms)        | `604800000` (7 days)                                       |
| `STELLAR_NETWORK`           | Network to use (`testnet`/`mainnet`) | `testnet`                                                  |
| `SOROBAN_RPC_URL`           | Soroban RPC endpoint                 | `https://soroban-testnet.stellar.org`                      |
| `REDIS_URL`                 | Redis connection string              | `redis://localhost:6379`                                   |
| `PORT`                      | API server port                      | `4000`                                                     |
| `CORS_ORIGIN`               | Allowed CORS origin                  | `http://localhost:3000`                                    |

### Web (`apps/web`)

| Variable              | Description     | Default                 |
| --------------------- | --------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:4000` |

## Production Considerations

1. **Use a real JWT secret** — Never use the default secret in production
2. **Enable HTTPS** — Use a reverse proxy like nginx or Caddy
3. **Set up monitoring** — Configure logging and metrics
4. **Database backups** — Set up regular PostgreSQL backups
5. **Rate limiting** — Add rate limiting to the API
6. **Mainnet mode** — Set `STELLAR_NETWORK=mainnet` for production

## Manual Deployment

### API

```bash
cd apps/api
pnpm build
node dist/main.js
```

### Web

```bash
cd apps/web
pnpm build
pnpm start
```
