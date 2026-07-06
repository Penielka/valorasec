import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';

@Module({
  controllers: [ProjectsController, ContractsController],
  providers: [ProjectsService, ContractsService],
  exports: [ProjectsService, ContractsService],
})
export class ProjectsModule {}
