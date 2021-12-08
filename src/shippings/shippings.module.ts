import { Module } from '@nestjs/common';
import { ShippingsService } from './shippings.service';
import { ShippingsController } from './shippings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingT } from './entities/shipping.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ShippingT])],
  controllers: [ShippingsController],
  providers: [ShippingsService]
})
export class ShippingsModule {}
