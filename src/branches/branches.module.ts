import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BranchesService } from './branches.service';
import { Branch } from "./branch.entity";

@Module({
  imports: [SequelizeModule.forFeature([Branch])],
  providers: [BranchesService],
  exports: [BranchesService, SequelizeModule],
})
export class BranchesModule {}
