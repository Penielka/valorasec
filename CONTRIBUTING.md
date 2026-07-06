# Contributing to ValoraSec

Thank you for your interest in contributing! 🚀

## Code of Conduct

Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) before contributing.

## Getting Started

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/YOUR_USERNAME/valorasec.git`
3. **Install dependencies**: `pnpm install`
4. **Create a branch**: `git checkout -b feat/my-feature`

## Development Workflow

```bash
# Start infrastructure
docker compose -f docker/docker-compose.yml up postgres redis -d

# Push DB schema
cd apps/api && pnpm db:push && cd ../..

# Start dev servers
pnpm dev
```

## Before Submitting

- Run `pnpm lint` and fix any issues
- Run `pnpm typecheck` and fix type errors
- Run `pnpm test` and ensure all tests pass
- Run `pnpm format` to format your code
- Write tests for new features

## Commit Conventions

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `refactor:` Code refactor
- `test:` Adding/updating tests
- `chore:` Maintenance

## Pull Request Process

1. Update relevant documentation
2. Add tests for new functionality
3. Ensure CI passes
4. Request review from a maintainer

## Project Structure

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for a detailed overview.

## Questions?

Open an issue or start a discussion on GitHub.
