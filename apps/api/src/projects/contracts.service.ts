import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContractsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(projectId: string) {
    const contracts = await this.prisma.contract.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
    return contracts;
  }

  async create(projectId: string, data: { name: string; address: string; network: string }) {
    return this.prisma.contract.create({
      data: { ...data, projectId },
    });
  }

  async remove(projectId: string, contractId: string) {
    const contract = await this.prisma.contract.findFirst({
      where: { id: contractId, projectId },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    await this.prisma.contract.delete({ where: { id: contractId } });
  }
}
