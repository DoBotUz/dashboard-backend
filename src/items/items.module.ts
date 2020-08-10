import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { Item } from './item.entity';
import { IsItemExists } from './validators';
import { ItemsCrudService } from './items-crud.service';

@Module({
  imports: [TypeOrmModule.forFeature([Item])],
  providers: [ItemsCrudService, ItemsService, IsItemExists],
  controllers: [ItemsController]
})
export class ItemsModule {}
