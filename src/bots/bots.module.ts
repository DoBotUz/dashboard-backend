import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotsService } from './bots.service';
import { Bot } from './bot.entity';
import { IsBotExists, UniqueBotToken } from './validators';

@Module({
  imports: [TypeOrmModule.forFeature([Bot])],
  providers: [BotsService, IsBotExists, UniqueBotToken],
  exports: [BotsService, TypeOrmModule],
})
export class BotsModule {}
