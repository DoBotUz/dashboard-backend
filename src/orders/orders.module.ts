import { Module, Global, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './order.entity';
import { OrdersCrudService } from './orders-crud.service';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { IsOrderExists } from './validators/isOrderExists';
import { BotUsersModule } from 'src/bot-users/bot-users.module';
import { OrderItem } from './order-item.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    TypeOrmModule.forFeature([OrderItem]),
    OrganizationsModule,
    BotUsersModule,
  ],
  providers: [
    IsOrderExists,
    OrdersCrudService,
    OrdersService,
  ],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
