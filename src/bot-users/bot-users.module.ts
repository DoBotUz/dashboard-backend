import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotUsersController } from './bot-users.controller';
import { BotUsersService } from './bot-users.service';
import { BotUser } from './bot-user.entity';
import { IsBotUserExists } from './validators';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([BotUser])],
  controllers: [BotUsersController],
  providers: [BotUsersService, IsBotUserExists],
  exports: [BotUsersService],
})
export class BotUsersModule {}
