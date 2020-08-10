import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { Item } from './item.entity';
import { IsItemExists } from './validators';

@Module({
  imports: [TypeOrmModule.forFeature([Item])],
  providers: [ItemsService, IsItemExists],
  controllers: [ItemsController]
})
export class ItemsModule {}
