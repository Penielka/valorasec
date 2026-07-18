/**
 * API test helper: utilities for creating NestJS test applications and
 * making authenticated requests.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Create a minimal NestJS test application with the given module.
 * Sets up global ValidationPipe and global prefix.
 *
 * @param module - The NestJS module class to load
 * @param overrides - Optional provider overrides [{ provider, useValue }]
 * @returns The initialized app, module fixture, authHeader and getAccessToken helpers
 *
 * @example
 * ```ts
 * import { createTestApp } from '@valorasec/test-utils';
 * import request from 'supertest';
 *
 * const { app, authHeader } = await createTestApp(MyModule, [
 *   { provider: PrismaService, useValue: prismaMock },
 * ]);
 *
 * await request(app.getHttpServer())
 *   .get('/api/my-route')
 *   .set(authHeader())
 *   .expect(200);
 *
 * await app.close();
 * ```
 */
export async function createTestApp(
  module: any,
  overrides: Array<{ provider: any; useValue: any }> = [],
): Promise<{
  app: INestApplication;
  moduleFixture: TestingModule;
  authHeader: (userId?: string) => { Authorization: string };
  getAccessToken: (userId?: string) => string;
}> {
  const builder = Test.createTestingModule({
    imports: [module],
  });

  for (const override of overrides) {
    builder.overrideProvider(override.provider).useValue(override.useValue);
  }

  const moduleFixture = await builder.compile();
  const jwtService = moduleFixture.get<JwtService>(JwtService);

  const app = moduleFixture.createNestApplication();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  await app.init();

  const getAccessToken = (userId = 'user-1'): string => {
    return jwtService.sign({ sub: userId });
  };

  const authHeader = (userId?: string): { Authorization: string } => {
    return { Authorization: `Bearer ${getAccessToken(userId)}` };
  };

  return { app, moduleFixture, authHeader, getAccessToken };
}
