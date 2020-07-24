import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BranchesService } from './branches.service';
import { Branch } from "./branch.entity";
import { BranchesController } from './branches.controller';
import { IsBranchExists } from './validators';

@Module({
  imports: [SequelizeModule.forFeature([Branch])],
  providers: [BranchesService, IsBranchExists],
  exports: [BranchesService, SequelizeModule],
  controllers: [BranchesController],
})
export class BranchesModule {}
