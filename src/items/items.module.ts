import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { Item } from './item.entity';
import { IsItemExists } from './validators';

@Module({
  imports: [SequelizeModule.forFeature([Item])],
  providers: [ItemsService, IsItemExists],
  controllers: [ItemsController]
})
export class ItemsModule {}
