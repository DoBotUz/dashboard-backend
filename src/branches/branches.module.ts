import { Module } from '@nestjs/common';
import { BranchesService } from './branches.service';

@Module({
  providers: [BranchesService]
})
export class BranchesModule {}
