import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AuditRegistryService } from './audit-registry.service';
import { PrismaService } from '../prisma/prisma.service';
import { createPrismaMock, createMockAuditRecord } from '@valorasec/test-utils';

describe('AuditRegistryService', () => {
  let service: AuditRegistryService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prisma = createPrismaMock();

    const moduleFixture = await Test.createTestingModule({
      providers: [AuditRegistryService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = moduleFixture.get<AuditRegistryService>(AuditRegistryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ─── getAuditRecord ────────────────────────────────────────────────────

  describe('getAuditRecord', () => {
    it('should return an audit record by report ID', async () => {
      const mockRecord = createMockAuditRecord();
      prisma.auditRecord.findUnique.mockResolvedValue(mockRecord);

      const result = await service.getAuditRecord('report-1');

      expect(result).toBeDefined();
      expect(result.id).toBe('audit-1');
      expect(result.reportId).toBe('report-1');
      expect(result.reportHash).toBe('0xabcdef1234567890');
      expect(prisma.auditRecord.findUnique).toHaveBeenCalledWith({
        where: { reportId: 'report-1' },
      });
    });

    it('should throw NotFoundException when audit record not found', async () => {
      prisma.auditRecord.findUnique.mockResolvedValue(null);

      await expect(service.getAuditRecord('non-existent')).rejects.toThrow(NotFoundException);
      await expect(service.getAuditRecord('non-existent')).rejects.toThrow(
        'Audit record not found',
      );
    });
  });

  // ─── listProjectAudits ─────────────────────────────────────────────────

  describe('listProjectAudits', () => {
    const mockRecords = [
      createMockAuditRecord({ id: 'audit-1', createdAt: new Date('2025-02-01') }),
      createMockAuditRecord({ id: 'audit-2', createdAt: new Date('2025-01-01') }),
    ];

    it('should list audit records for a project ordered by date desc', async () => {
      prisma.auditRecord.findMany.mockResolvedValue(mockRecords);

      const result = await service.listProjectAudits('project-1');

      expect(result).toHaveLength(2);
      expect(result[0]!.id).toBe('audit-1'); // newer first
      expect(prisma.auditRecord.findMany).toHaveBeenCalledWith({
        where: { projectId: 'project-1' },
        orderBy: { createdAt: 'desc' },
        include: { report: true },
      });
    });

    it('should return empty array when no audits found', async () => {
      prisma.auditRecord.findMany.mockResolvedValue([]);

      const result = await service.listProjectAudits('project-1');

      expect(result).toHaveLength(0);
    });
  });
});
