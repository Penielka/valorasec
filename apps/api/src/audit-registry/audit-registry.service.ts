import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditRegistryService {
  constructor(private readonly prisma: PrismaService) {}

  async getAuditRecord(reportId: string) {
    const record = await this.prisma.auditRecord.findUnique({
      where: { reportId },
    });

    if (!record) {
      throw new NotFoundException('Audit record not found');
    }

    return record;
  }

  async listProjectAudits(projectId: string) {
    return this.prisma.auditRecord.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      include: { report: true },
    });
  }
}
