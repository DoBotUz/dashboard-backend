import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UniqueEmail, IsUserExists } from './validators';
import { UsersController } from './users.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, UniqueEmail, IsUserExists],
  exports: [UsersService, TypeOrmModule],
  controllers: [UsersController],
})
export class UsersModule {}
