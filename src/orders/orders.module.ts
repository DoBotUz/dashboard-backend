import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './order.entity';
import { IsOrderExists } from './validators';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  providers: [OrdersService, IsOrderExists],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
