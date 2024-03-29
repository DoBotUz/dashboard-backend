import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchesService } from './branches.service';
import { Branch } from "./branch.entity";
import { BranchesController } from './branches.controller';
import { IsBranchExists } from './validators';
import { BranchesCrudService } from './branches-crud.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Branch]),
  ],
  providers: [
    BranchesCrudService,
    BranchesService,
    IsBranchExists
  ],
  exports: [BranchesService, TypeOrmModule],
  controllers: [BranchesController],
})
export class BranchesModule {}
