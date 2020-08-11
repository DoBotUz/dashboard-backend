import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UniqueEmail, IsUserExists } from './validators';
import { UsersController } from './users.controller';
import { IsLoggedInUser } from './validators/IsLoggedInUser';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, UniqueEmail, IsUserExists, IsLoggedInUser],
  exports: [UsersService, TypeOrmModule],
  controllers: [UsersController],
})
export class UsersModule {}
