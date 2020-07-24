import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BotsService } from './bots.service';
import { Bot } from './bot.entity';

@Module({
  imports: [SequelizeModule.forFeature([Bot])],
  providers: [BotsService],
  exports: [BotsService, SequelizeModule],
})
export class BotsModule {}
