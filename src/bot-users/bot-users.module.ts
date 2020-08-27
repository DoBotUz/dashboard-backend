import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotUsersController } from './bot-users.controller';
import { BotUsersService } from './bot-users.service';
import { BotUser } from './bot-user.entity';
import { BotUsersCrudService } from './bot-users-crud.service';
import { IsBotUserExists } from './validators/isBotUserExists';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([BotUser])],
  controllers: [BotUsersController],
  providers: [BotUsersCrudService, BotUsersService, IsBotUserExists],
  exports: [BotUsersService, BotUsersCrudService],
})
export class BotUsersModule {}
