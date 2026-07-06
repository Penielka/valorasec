import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    userId: string,
    query: { page?: number; limit?: number; search?: string; network?: string },
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { userId };
    if (query.search) {
      where.name = { contains: query.search, mode: 'insensitive' };
    }
    if (query.network) {
      where.network = query.network;
    }

    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        include: { contracts: true },
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: string, projectId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, userId },
      include: { contracts: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async create(userId: string, data: { name: string; description?: string; network: string }) {
    return this.prisma.project.create({
      data: { ...data, userId },
      include: { contracts: true },
    });
  }

  async update(userId: string, projectId: string, data: { name?: string; description?: string }) {
    await this.findOne(userId, projectId); // verify ownership
    return this.prisma.project.update({
      where: { id: projectId },
      data,
      include: { contracts: true },
    });
  }

  async remove(userId: string, projectId: string) {
    await this.findOne(userId, projectId);
    await this.prisma.project.delete({ where: { id: projectId } });
  }
}
