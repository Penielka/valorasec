import { Module } from '@nestjs/common';
import { AuditRegistryService } from './audit-registry.service';
import { AuditRegistryController } from './audit-registry.controller';

@Module({
  controllers: [AuditRegistryController],
  providers: [AuditRegistryService],
  exports: [AuditRegistryService],
})
export class AuditRegistryModule {}
