import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { IsOrderExists } from './validators';

@Module({
  imports: [SequelizeModule.forFeature([Order]), SequelizeModule.forFeature([OrderItem])],
  providers: [OrdersService, IsOrderExists],
  controllers: [OrdersController]
})
export class OrdersModule {}
