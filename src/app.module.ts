import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from "@nestjs/platform-express";
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { AccessControlModule } from 'nest-access-control';
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
import { PromocodesModule } from './promocodes/promocodes.module';
import { SubscriptionPlansModule } from './subscription-plans/subscription-plans.module';
import { GatewaysModule } from './gateways/gateways.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MailingTemplatesModule } from './mailing-templates/mailing-templates.module';
import { ChatModule } from './chat/chat.module';
import { roles } from './app.roles';
import { ACLFilterInterceptor } from './acl-filter.interceptor';
import { JSendResInterceptor } from './jsend-res.interceptor';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AccessControlModule.forRoles(roles),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        // ignoreTLS: true,
        secure: true,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: process.env.MAIL_USER,
      },
      template: {
        dir: './templates',
        adapter: new HandlebarsAdapter(),
      },
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [],
      synchronize: true,
      autoLoadEntities: true,
      charset: 'utf8mb4_general_ci',
      extra: {
        'sql_mode': '',
      }
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
    PromocodesModule,
    SubscriptionPlansModule,
    GatewaysModule,
    NotificationsModule,
    MailingTemplatesModule,
    ChatModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService,  {
    provide: APP_INTERCEPTOR,
    useClass: JSendResInterceptor,
  }, {
    provide: APP_INTERCEPTOR,
    useClass: ACLFilterInterceptor,
  }],
})
export class AppModule {}
