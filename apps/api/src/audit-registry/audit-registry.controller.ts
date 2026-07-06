import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuditRegistryService } from './audit-registry.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Audit Registry')
@Controller('audit-registry')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AuditRegistryController {
  constructor(private readonly auditRegistryService: AuditRegistryService) {}

  @Get('report/:reportId')
  @ApiOperation({ summary: 'Get audit record by report ID' })
  async getAuditRecord(@Param('reportId') reportId: string) {
    const record = await this.auditRegistryService.getAuditRecord(reportId);
    return { data: record };
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'List all audit records for a project' })
  async listProjectAudits(@Param('projectId') projectId: string) {
    const records = await this.auditRegistryService.listProjectAudits(projectId);
    return { data: records };
  }
}
