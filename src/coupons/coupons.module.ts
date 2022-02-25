import { Module } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CouponsController } from './coupons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponT } from './entities/coupon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CouponT])],
  controllers: [CouponsController],
  providers: [CouponsService],
})
export class CouponsModule {}
