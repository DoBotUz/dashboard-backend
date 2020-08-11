import { Module, Global, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './order.entity';
import { OrdersCrudService } from './orders-crud.service';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { IsAllowedBotUser } from './validators/IsAllowedBotUser';
import { IsAllowedBranch } from './validators/IsAllowedBranch';
import { IsOrderExists } from './validators/isOrderExists';
import { BotUsersModule } from 'src/bot-users/bot-users.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    OrganizationsModule,
    BotUsersModule,
  ],
  providers: [
    IsOrderExists,
    IsAllowedBranch,
    IsAllowedBotUser,
    OrdersCrudService,
    OrdersService,
  ],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
