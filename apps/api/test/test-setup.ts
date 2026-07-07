import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AuthModule } from '../src/auth/auth.module';
import { PrismaService } from '../src/prisma/prisma.service';

/**
 * Create a minimal NestJS test application with mocked PrismaService.
 * Returns the app instance and the PrismaService mock.
 */
export async function createTestApp(): Promise<{
  app: INestApplication;
  prisma: PrismaService;
}> {
  const prismaMock = createPrismaMock();

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AuthModule],
  })
    .overrideProvider(PrismaService)
    .useValue(prismaMock)
    .compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  await app.init();

  return { app, prisma: prismaMock as unknown as PrismaService };
}

/**
 * Create a mock PrismaService with all commonly used methods.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createPrismaMock(): any {
  return {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    session: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    project: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    contract: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    scan: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    report: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    notification: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    auditRecord: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    $transaction: jest.fn(),
  };
}

/**
 * Create a mock user object matching the Prisma User shape.
 */
export function mockUser(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: 'user-1',
    email: 'test@valorasec.dev',
    passwordHash: '$2a$12$LJ3m4ys3GZrsODbCp8qGseKPz7YKICfqhEPm34ASRW6Q8qGPbGmPe', // hashed "test1234"
    name: 'Test User',
    role: 'user',
    avatarUrl: null,
    isVerified: false,
    verifyToken: 'verify-token-123',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    ...overrides,
  };
}

/**
 * Create a mock session object.
 */
export function mockSession(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: 'session-1',
    userId: 'user-1',
    refreshToken: 'refresh-token-123',
    expiresAt: new Date(Date.now() + 604800000), // 7 days from now
    createdAt: new Date(),
    ...overrides,
  };
}

/**
 * Create a mock project object.
 */
export function mockProject(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: 'project-1',
    userId: 'user-1',
    name: 'Test Project',
    description: 'A test project',
    network: 'testnet',
    contracts: [],
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    ...overrides,
  };
}
