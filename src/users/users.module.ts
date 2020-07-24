import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './users.service';
import { User } from "./user.entity";
import { UniqueEmail, IsUserExists } from "./validators";
import { UsersController } from './users.controller';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [UsersService, UniqueEmail, IsUserExists],
  exports: [UsersService, SequelizeModule],
  controllers: [UsersController],
})
export class UsersModule {}
