import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  ProductsController,
  PopularProductsController,
} from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductT } from './entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductT])],
  controllers: [ProductsController, PopularProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
