import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './order.entity';
import { IsOrderExists } from './validators';
import { OrdersCrudService } from './orders-crud.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  providers: [OrdersCrudService, OrdersService, IsOrderExists],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
