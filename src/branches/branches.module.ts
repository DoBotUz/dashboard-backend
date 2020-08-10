import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchesService } from './branches.service';
import { Branch } from "./branch.entity";
import { BranchesController } from './branches.controller';
import { IsBranchExists } from './validators';

@Module({
  imports: [TypeOrmModule.forFeature([Branch])],
  providers: [BranchesService, IsBranchExists],
  exports: [BranchesService, TypeOrmModule],
  controllers: [BranchesController],
})
export class BranchesModule {}
