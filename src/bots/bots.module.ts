import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BotsService } from './bots.service';
import { Bot } from './bot.entity';
import { IsBotExists } from './validators';

@Module({
  imports: [SequelizeModule.forFeature([Bot])],
  providers: [BotsService, IsBotExists],
  exports: [BotsService, SequelizeModule],
})
export class BotsModule {}
