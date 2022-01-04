import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController, OrderStatusController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderT } from './entities/order.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderT]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [OrdersController, OrderStatusController],
  providers: [OrdersService],
})
export class OrdersModule {}
