import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promocode } from './promocode.entity';
import { PromocodesService } from './promocodes.service';
import { PromocodesController } from './promocodes.controller';
import { PromocodeCrudService } from './promocodes-crud.service';
import { IsPromocodeExists } from './validators/isPromocodeExists';

@Module({
  imports: [TypeOrmModule.forFeature([Promocode])],
  providers: [PromocodeCrudService, PromocodesService, IsPromocodeExists],
  controllers: [PromocodesController],
  exports: [PromocodesService],
})
export class PromocodesModule {}
