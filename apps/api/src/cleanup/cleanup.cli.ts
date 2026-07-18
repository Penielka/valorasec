/**
 * Manual cleanup CLI script.
 *
 * Usage: npx ts-node src/cleanup/cleanup.cli.ts
 *    or: pnpm cleanup  (via package.json script)
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CleanupService } from './cleanup.service';

async function run(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule);
  const cleanupService = app.get(CleanupService);

  console.info('Starting manual cleanup...\n');

  const metrics = await cleanupService.runCleanup();

  console.info('\nCleanup Results:');
  console.info('─────────────────────────────────────────────');
  console.info(`  Expired sessions deleted:  ${metrics.expiredSessionsDeleted}`);
  console.info(`  Old scans soft-deleted:     ${metrics.scansSoftDeleted}`);
  console.info(`  Archived projects deleted:  ${metrics.archivedProjectsHardDeleted}`);
  console.info(`  Duration:                   ${metrics.duration}ms`);
  console.info(`  Timestamp:                  ${metrics.timestamp}`);
  console.info('─────────────────────────────────────────────');

  await app.close();
  process.exit(0);
}

run().catch((error) => {
  console.error('Cleanup failed:', error);
  process.exit(1);
});
