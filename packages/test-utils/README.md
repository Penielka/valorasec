# @valorasec/test-utils

Shared test fixtures, factory functions, and test helpers for the ValoraSec platform.

## Installation

This package is internal and available as a workspace dependency:

```bash
pnpm add @valorasec/test-utils --filter <your-package>
```

## Usage

### Mock Factories

```typescript
import {
  createMockUser,
  createMockProject,
  createMockContract,
  createMockScan,
  createMockReport,
} from '@valorasec/test-utils';

// Create with defaults
const user = createMockUser();

// Create with overrides
const adminUser = createMockUser({ role: 'admin', email: 'admin@test.com' });
const project = createMockProject({ name: 'My DeFi Protocol' });
const scan = createMockScan({ status: 'pending' });
```

### Prisma Test Helper

```typescript
import { createPrismaMock } from '@valorasec/test-utils';

const prisma = createPrismaMock();

// Mock specific queries
prisma.user.findUnique.mockResolvedValue(createMockUser());
prisma.project.findMany.mockResolvedValue([createMockProject()]);
```

### API Test Helper

```typescript
import { createTestApp, createPrismaMock } from '@valorasec/test-utils';
import { MyModule } from './my.module';
import { PrismaService } from '../prisma/prisma.service';
import request from 'supertest';

const { app, authHeader } = await createTestApp(MyModule, [
  { provider: PrismaService, useValue: createPrismaMock() },
]);

// Make authenticated requests
await request(app.getHttpServer()).get('/api/my-route').set(authHeader()).expect(200);

await app.close();
```

### Frontend Test Helper

```typescript
import { renderWithProviders } from '@valorasec/test-utils';

// Render components wrapped with common providers
const { element } = renderWithProviders(<MyComponent />);
```

## Available Factories

| Factory                    | Description                     |
| -------------------------- | ------------------------------- |
| `createMockUser()`         | User with default test values   |
| `createMockSession()`      | Auth session                    |
| `createMockProject()`      | Project with optional contracts |
| `createMockContract()`     | Soroban smart contract          |
| `createMockScan()`         | Security scan result            |
| `createMockReport()`       | Audit report                    |
| `createMockNotification()` | User notification               |
| `createMockAuditRecord()`  | On-chain audit record           |

All factories accept an optional `overrides` object to customize any field.
