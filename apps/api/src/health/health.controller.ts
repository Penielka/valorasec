import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Health check' })
  async check() {
    let dbStatus = 'disconnected';

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbStatus = 'connected';
    } catch {
      // Keep disconnected
    }

    return {
      data: {
        status: 'ok',
        version: '0.1.0',
        network: process.env.STELLAR_NETWORK ?? 'testnet',
        database: dbStatus,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
