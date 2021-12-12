import { Module } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { ShopsController, StaffsController } from './shops.controller';
import { ShopT } from './entities/shop.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShopT]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ShopsController, StaffsController],
  providers: [ShopsService],
})
export class ShopsModule {}
