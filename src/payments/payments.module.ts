import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentType } from './payment_type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentType])],
  providers: [],
  controllers: [],
  exports: [],
})
export class PaymentsModule {}
