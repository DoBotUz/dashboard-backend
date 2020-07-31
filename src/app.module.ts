import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MulterModule } from "@nestjs/platform-express";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { BranchesModule } from './branches/branches.module';
import { BotsModule } from './bots/bots.module';
import { CategoriesModule } from './categories/categories.module';
import { ItemsModule } from './items/items.module';
import { FilesModule } from './files/files.module';
import { BotUsersModule } from './bot-users/bot-users.module';
import { BotNotificationsModule } from './bot-notifications/bot-notifications.module';
import { FeedbacksModule } from './feedbacks/feedbacks.module';
import { OrdersModule } from './orders/orders.module';
import { PromosModule } from './promos/promos.module';
import { PromocodesModule } from './promocodes/promocodes.module';
import { SubscriptionPlansModule } from './subscription-plans/subscription-plans.module';
import { GatewaysModule } from './gateways/gateways.module';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'dobot',
      password: '04aOnb4yWUtRavTb',
      database: 'dobot',
      autoLoadModels: true,
      synchronize: true,
      models: [],
      logging: false
    }),
    AuthModule,
    UsersModule,
    OrganizationsModule,
    BranchesModule,
    BotsModule,
    CategoriesModule,
    ItemsModule,
    FilesModule,
    BotUsersModule,
    BotNotificationsModule,
    FeedbacksModule,
    OrdersModule,
    PromosModule,
    PromocodesModule,
    SubscriptionPlansModule,
    GatewaysModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
