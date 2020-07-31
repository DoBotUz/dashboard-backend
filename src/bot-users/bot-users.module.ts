import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BotUsersController } from './bot-users.controller';
import { BotUsersService } from './bot-users.service';
import { BotUser } from './bot-user.entity';
import { IsBotUserExists } from './validators';

@Module({
  imports: [SequelizeModule.forFeature([BotUser])],
  controllers: [BotUsersController],
  providers: [BotUsersService, IsBotUserExists]
})
export class BotUsersModule {}
