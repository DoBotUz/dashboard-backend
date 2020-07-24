import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { BranchesModule } from './branches/branches.module';
import { BotsModule } from './bots/bots.module';

@Module({
  imports: [
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
