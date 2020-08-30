import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UniqueEmail, IsUserExists } from './validators';
import { UsersController } from './users.controller';
import { ProfileController } from './profile.controller';
import { UsersCrudService } from './users-crud.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersCrudService,UsersService, UniqueEmail, IsUserExists],
  exports: [UsersService, TypeOrmModule],
  controllers: [UsersController, ProfileController],
})
export class UsersModule {}
