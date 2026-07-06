import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ContractsService } from './contracts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateContractDto } from './dto/create-contract.dto';

@ApiTags('Projects')
@Controller('projects/:projectId/contracts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all contracts for a project' })
  async findAll(@Param('projectId') projectId: string) {
    const contracts = await this.contractsService.findAll(projectId);
    return { data: contracts };
  }

  @Post()
  @ApiOperation({ summary: 'Add a contract to a project' })
  async create(@Param('projectId') projectId: string, @Body() dto: CreateContractDto) {
    const contract = await this.contractsService.create(projectId, dto);
    return { data: contract };
  }

  @Delete(':contractId')
  @ApiOperation({ summary: 'Remove a contract from a project' })
  async remove(@Param('projectId') projectId: string, @Param('contractId') contractId: string) {
    await this.contractsService.remove(projectId, contractId);
    return { data: { message: 'Contract removed' } };
  }
}
