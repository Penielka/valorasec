import { Controller, Post, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ScansService } from './scans.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Scans')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ScansController {
  constructor(private readonly scansService: ScansService) {}

  @Post('projects/:projectId/contracts/:contractId/scan')
  @ApiOperation({ summary: 'Run a security scan on a contract' })
  async runScan(@Param('projectId') projectId: string, @Param('contractId') contractId: string) {
    const scan = await this.scansService.runScan(projectId, contractId);
    return { data: scan };
  }

  @Get('scans/:scanId')
  @ApiOperation({ summary: 'Get scan details' })
  async getScan(@Param('scanId') scanId: string) {
    const scan = await this.scansService.getScan(scanId);
    return { data: scan };
  }

  @Get('contracts/:contractId/scans')
  @ApiOperation({ summary: 'Get scan history for a contract' })
  async getHistory(
    @Param('contractId') contractId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.scansService.getHistory(contractId, page ?? 1, limit ?? 10);
  }
}
